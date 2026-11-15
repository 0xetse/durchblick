import { chromium, expect, test, type Page } from '@playwright/test';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * D-N24 (decided 2026-11-13): the app selection lives in this tab only – never
 * in an address, so never in the browser history. Sharing is a deliberate step.
 * Decision and measurements: docs/privacy/d-n24-entscheidungsvorlage.md
 */
const TAB = 'durchblick:selection';
const tabSelection = (page: Page) => page.evaluate((k) => sessionStorage.getItem(k), TAB);
const pick = async (page: Page, names: string[]) => {
  for (const n of names) await page.locator('.app-tile').filter({ hasText: new RegExp(`^${n}`) }).click();
};

test('the browser history (Chromium profile on disk) never receives the selection', async ({ baseURL, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'reads the history database of a real Chromium profile');
  const dir = mkdtempSync(join(tmpdir(), 'durchblick-history-'));
  try {
    // The full Chromium keeps a history; the headless shell does not.
    const ctx = await chromium.launchPersistentContext(dir, { channel: 'chromium', ...(baseURL ? { baseURL } : {}) });
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    await page.goto('/');
    await page.getByRole('button', { name: /weitere Apps zeigen/ }).click();
    await pick(page, ['Telegram', 'Instagram', 'ChatGPT']);
    await page.getByRole('button', { name: /Weiter · 3 Apps gewählt/ }).click();
    await page.getByRole('button', { name: 'Weiter', exact: true }).click();
    await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
    await page.locator('.wiz-links').getByRole('link', { name: /Mein Plan/ }).click();
    await expect(page.locator('.plan-head')).toContainText('Telegram');
    await page.goto('/einstellungen/');
    await page.goto('/check/');
    await page.locator('.app-tile').filter({ hasText: /^Google/ }).first().click();
    await page.goBack();
    await page.reload();
    await ctx.close();

    const { DatabaseSync } = await import('node:sqlite');
    copyFileSync(join(dir, 'Default', 'History'), join(dir, 'history-copy'));
    const db = new DatabaseSync(join(dir, 'history-copy'));
    const urls = (db.prepare('select url from urls').all() as { url: string }[]).map((r) => r.url);
    db.close();
    expect(urls.length, 'the profile recorded the visits').toBeGreaterThan(3);
    expect(urls.filter((u) => u.includes('#d=')), 'no selection in the history').toEqual([]);
    expect(urls.join(' ')).not.toMatch(/telegram|chatgpt/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a shared link is taken over and removed from the address without a new history entry', async ({ page, context }) => {
  // Same number of entries as opening the plan without a link (Playwright starts each tab with about:blank).
  const plain = await context.newPage();
  await plain.goto('/plan/');
  const expected = await plain.evaluate(() => history.length);
  await plain.close();
  await page.goto('/plan/#d=tiktok,netflix');
  await expect(page.locator('.plan-head')).toContainText('TikTok, Netflix');
  await expect(page).toHaveURL(/\/plan\/$/);
  expect(await page.evaluate(() => history.length)).toBe(expected);
  expect(await tabSelection(page)).toBe('["tiktok","netflix"]');
  // also on pages without their own selection logic (older links)
  await page.goto('/warum/#d=paypal');
  await expect(page).toHaveURL(/\/warum\/$/);
  await expect.poll(() => tabSelection(page)).toBe('["paypal"]');
  // a plain anchor stays untouched
  await page.goto('/einstellungen/#instagram');
  await expect(page).toHaveURL(/#instagram$/);
});

test('sharing is deliberate and says that the link contains the selection', async ({ page, context, browserName }) => {
  await page.goto('/plan/#d=google,instagram');
  const share = page.locator('details.share');
  await expect(share).not.toHaveAttribute('open', '');
  // Before the person opens it, the link is neither shown nor focusable nor read out (closed <details>).
  await expect(page.locator('.share-url')).toBeHidden();
  await page.locator('a.skip-link').focus();
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.classList.contains('share-url'))).toBe(false);
  }
  await share.locator('summary').click();
  await expect(share).toContainText('Dieser Link enthält deine Auswahl: Google, Instagram');
  await expect(share).toContainText('im Verlauf speichern');
  const url = page.locator('.share-url');
  await expect(url).toHaveValue(/\/plan\/#d=google,instagram$/);
  await expect(page).toHaveURL(/\/plan\/$/); // showing the link does not put it into the address
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await share.getByRole('button', { name: 'Link kopieren' }).click();
    await expect(share.locator('[role="status"]')).toHaveText('Kopiert. Der Link enthält deine Auswahl.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/plan\/#d=google,instagram$/);
  }
  // the shared link works for whoever opens it – in a fresh tab
  const other = await context.newPage();
  await other.goto((await url.inputValue()).replace(/^https?:\/\/[^/]+/, ''));
  await expect(other.locator('.plan-head')).toContainText('Google, Instagram');
  await expect(other).toHaveURL(/\/plan\/$/);
});

test('each tab keeps its own selection', async ({ context }) => {
  const a = await context.newPage();
  await a.goto('/');
  await pick(a, ['Amazon']);
  await expect.poll(() => tabSelection(a)).toBe('["amazon"]');
  const b = await context.newPage();
  await b.goto('/plan/');
  await expect(b.locator('.plan-head')).toContainText('Ohne Auswahl');
  await b.goto('/');
  await pick(b, ['TikTok']);
  await expect.poll(() => tabSelection(b)).toBe('["tiktok"]');
  await a.goto('/plan/');
  await expect(a.locator('.plan-head')).toContainText('Amazon');
  await expect(a.locator('.plan-head')).not.toContainText('TikTok');
});

test('a change on another page in this tab is there after going back (back/forward cache or not)', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['WhatsApp']);
  await expect.poll(() => tabSelection(page)).toBe('["whatsapp"]');
  await page.goto('/check/');
  await page.locator('.app-tile').filter({ hasText: /^YouTube/ }).first().click();
  await expect.poll(() => tabSelection(page)).toBe('["whatsapp","youtube"]');
  await page.goBack();
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveText(['WhatsApp', 'YouTube']);
  await expect(page).toHaveURL(/\/$/);
});

test('reload keeps the selection and step without anything in the address', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['ChatGPT']);
  await page.getByRole('button', { name: /Weiter · 1 App gewählt/ }).click();
  await page.reload();
  await expect(page.locator('#wiz-count')).toContainText('Schritt 2 von 4');
  await expect(page.locator('#wiz-h')).toContainText('ChatGPT');
  await expect(page).toHaveURL(/\/$/);
});

test('"In meinen Plan übernehmen" adds the app to this tab without an address', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['Google']);
  await expect.poll(() => tabSelection(page)).toBe('["google"]');
  await page.goto('/dienste/telegram/');
  await page.getByRole('link', { name: 'In meinen Plan übernehmen' }).click();
  await expect(page).toHaveURL(/\/plan\/$/);
  await expect(page.locator('.plan-head')).toContainText('Google, Telegram');
});

test('"Alles löschen" in the trust panel also empties this tab', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['Instagram']);
  await expect.poll(() => tabSelection(page)).toBe('["instagram"]');
  await page.locator('.trust-panel summary').click();
  await expect(page.locator('.trust-pop')).toContainText('nur in diesem Tab');
  await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
  expect(await tabSelection(page)).toBeNull();
  expect(await page.evaluate(() => sessionStorage.length + localStorage.length)).toBe(0);
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveCount(0);
  await page.goto('/plan/');
  await expect(page.locator('.plan-head')).toContainText('Ohne Auswahl');
});

test.describe('independent review (phase 5)', () => {
  test('P1: after "Alles löschen" on another page, Back (back/forward cache) does not bring the selection back', async ({ baseURL, browserName, isMobile }) => {
    test.skip(browserName !== 'chromium' || isMobile, 'needs Chromium with its back/forward cache switched on');
    // The full Chromium (not the headless shell) with its back/forward cache on.
    const dir = mkdtempSync(join(tmpdir(), 'durchblick-bfcache-'));
    const ctx = await chromium.launchPersistentContext(dir, {
      channel: 'chromium',
      ignoreDefaultArgs: ['--disable-back-forward-cache'],
      ...(baseURL ? { baseURL } : {}),
    });
    await ctx.addInitScript(() => addEventListener('pageshow', (e) => ((window as unknown as { __restored: boolean }).__restored = e.persisted)));
    const page = await ctx.newPage();
    const restored = () => page.evaluate(() => (window as unknown as { __restored?: boolean }).__restored === true);
    for (const [path, act] of [
      ['/', () => pick(page, ['Google'])],
      ['/check/', () => page.locator('.app-tile').filter({ hasText: /^TikTok/ }).first().click()],
      ['/plan/', async () => undefined],
    ] as const) {
      // Chromium keeps a page in its cache most of the time, not always: the
      // precondition gets up to three attempts; the check itself never retries.
      let cached = false;
      for (let attempt = 0; attempt < 3 && !cached; attempt++) {
        await page.goto('/');
        await pick(page, ['Amazon']);
        await expect.poll(() => tabSelection(page)).not.toBeNull();
        await page.goto(path);
        await act();
        await page.waitForTimeout(200);
        await page.goto('/impressum/');
        await page.locator('.trust-panel summary').click();
        await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
        await page.goBack({ waitUntil: 'commit' }); // a cache restore fires no "load"
        cached = await expect.poll(restored, { timeout: 2000 }).toBe(true).then(() => true, () => false);
      }
      expect(cached, `${path} came back from the back/forward cache in one of three attempts`).toBe(true);
      if (path === '/plan/') {
        await expect(page.locator('.plan-head')).toContainText('Ohne Auswahl');
        await expect(page.locator('details.share')).toHaveCount(0);
      } else {
        await expect(page.locator('.app-tile[aria-pressed="true"]'), path).toHaveCount(0);
      }
      expect(await tabSelection(page)).toBeNull();
    }
    await ctx.close();
    rmSync(dir, { recursive: true, force: true });
  });

  test('P1: /transparenz/ does not claim consent for the tab entry, and says other tabs keep theirs', async ({ page }) => {
    await page.goto('/');
    await pick(page, ['WhatsApp']);
    await expect.poll(() => tabSelection(page)).not.toBeNull();
    await page.goto('/transparenz/');
    const summary = page.locator('.live-summary');
    await expect(summary).toContainText('nur für diesen Tab, ohne Zustimmung');
    await expect(summary).not.toContainText('weil du es erlaubt hast');
    await page.getByRole('button', { name: 'Alles löschen' }).click();
    await expect(page.getByText('Andere offene Tabs behalten ihre eigene Auswahl')).toBeVisible();
  });

  test('P2: a shared link fills this tab only and never replaces the apps saved on this device', async ({ page }) => {
    await page.goto('/plan/#d=google');
    await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
    await page.locator('.stage-start .done-toggle input').first().check();
    await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
    // saved after consent: google
    expect(await page.evaluate(() => localStorage.getItem('durchblick:services'))).toBe('["google"]');
    for (const link of ['/warum/#d=tiktok', '/plan/#d=tiktok', '/#d=tiktok', '/einstellungen/#d=tiktok']) {
      await page.goto('about:blank');
      await page.goto(link);
      await expect.poll(() => tabSelection(page), link).toBe('["tiktok"]');
      expect(await page.evaluate(() => localStorage.getItem('durchblick:services')), link).toBe('["google"]');
    }
  });

  test('final review P1: a shared link does not reach the saved apps on the next page loads either', async ({ page }) => {
    await page.goto('/plan/#d=google');
    await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
    await page.locator('.stage-start .done-toggle input').first().check();
    await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
    await page.goto('about:blank');
    await page.goto('/#d=tiktok');
    await expect.poll(() => tabSelection(page)).toBe('["tiktok"]');
    for (const path of ['/', '/check/', '/plan/', '/einstellungen/']) {
      await page.reload();
      await page.goto(path);
      await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('durchblick:services')), path).toBe('["google"]');
    }
    // A change the person makes is saved, as before.
    await page.goto('/');
    await page.locator('.app-tile').filter({ hasText: /^YouTube/ }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('durchblick:services'))).toBe('["tiktok","youtube"]');
  });

  test('P2: unknown ids in a link are dropped and do not replace the selection', async ({ page }) => {
    await page.goto('/');
    await pick(page, ['Instagram']);
    await expect.poll(() => tabSelection(page)).toBe('["instagram"]');
    await page.goto('/warum/#d=bogus');
    await expect(page).toHaveURL(/\/warum\/$/);
    expect(await tabSelection(page)).toBe('["instagram"]');
  });

  test('P2: Ctrl/Cmd-click and middle-click on "In meinen Plan übernehmen" still add the app', async ({ page, isMobile }) => {
    test.skip(isMobile, 'modifier and middle clicks on desktop');
    for (const click of [{ modifiers: ['ControlOrMeta'] as const }, { button: 'middle' as const }]) {
      await page.goto('/');
      await pick(page, ['Google']);
      await expect.poll(() => tabSelection(page)).toBe('["google"]');
      await page.goto('/dienste/telegram/');
      await page.getByRole('link', { name: 'In meinen Plan übernehmen' }).click(click as Parameters<typeof page.click>[1]);
      await expect(page).toHaveURL(/\/plan\/$/);
      await expect(page.locator('.plan-head')).toContainText('Google, Telegram');
      await page.evaluate(() => sessionStorage.clear());
    }
  });
});

test('final review P3: progress kept "nur für jetzt" is gone after leaving the page (back/forward cache)', async ({ baseURL, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'needs Chromium with its back/forward cache switched on');
  const dir = mkdtempSync(join(tmpdir(), 'durchblick-bfcache-'));
  const ctx = await chromium.launchPersistentContext(dir, {
    channel: 'chromium',
    ignoreDefaultArgs: ['--disable-back-forward-cache'],
    ...(baseURL ? { baseURL } : {}),
  });
  await ctx.addInitScript(() => addEventListener('pageshow', (e) => ((window as unknown as { __restored: boolean }).__restored = e.persisted)));
  const page = await ctx.newPage();
  let cached = false;
  for (let attempt = 0; attempt < 3 && !cached; attempt++) {
    await page.goto('/plan/#d=google');
    await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
    await page.locator('.stage-start .done-toggle input').nth(0).check();
    await page.getByRole('button', { name: 'Nein, nur für jetzt' }).click();
    await page.locator('.stage-start .done-toggle input').nth(1).check();
    await expect(page.locator('.stage-start .done-toggle input:checked')).toHaveCount(2);
    await page.goto('/warum/');
    await page.goBack({ waitUntil: 'commit' }); // a cache restore fires no "load"
    cached = await expect
      .poll(() => page.evaluate(() => (window as unknown as { __restored?: boolean }).__restored === true), { timeout: 2000 })
      .toBe(true)
      .then(() => true, () => false);
  }
  expect(cached, 'the plan came back from the back/forward cache in one of three attempts').toBe(true);
  await expect(page.locator('.stage-start .done-toggle input:checked')).toHaveCount(0);
  await ctx.close();
  rmSync(dir, { recursive: true, force: true });
});
