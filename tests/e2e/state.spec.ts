import { expect, test, type Page } from '@playwright/test';

/**
 * Regression tests for navigation and state (audit 2026-11): browser history in
 * the wizard, reload, anchors, "Alles löschen", the service worker cache.
 */

const pick = async (page: Page, names: string[]) => {
  for (const n of names) await page.locator('.app-tile').filter({ hasText: new RegExp(`^${n}`) }).click();
};
const stepText = (page: Page) => page.locator('#wiz-count');

test('wizard: browser back and forward walk through the steps, the selection stays', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['Instagram', 'WhatsApp']);
  await page.getByRole('button', { name: /Weiter · 2 Apps gewählt/ }).click();
  await expect(stepText(page)).toContainText('Schritt 2 von 4');
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(stepText(page)).toContainText('Schritt 3 von 4');
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  await expect(stepText(page)).toContainText('Schritt 4 von 4');

  await page.goBack();
  await expect(stepText(page)).toContainText('Schritt 3 von 4');
  await expect(page.locator('#wiz-h')).toBeFocused();
  await page.goBack();
  await page.goBack();
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveCount(2);
  await expect(page).toHaveURL(/\/$/); // D-N24: never in the address

  // Change the selection on step 1, then go forward: the new selection wins.
  await pick(page, ['Google']);
  await page.goForward();
  await expect(stepText(page)).toContainText('Schritt 2 von 4');
  await expect(page.locator('#wiz-h')).toContainText('Deine 3 Apps');
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('durchblick:selection'))).toBe('["instagram","whatsapp","google"]');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('wizard: a reload keeps the current step and the selection', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['Google']);
  await page.getByRole('button', { name: /Weiter/ }).click();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  await expect(stepText(page)).toContainText('Schritt 4 von 4');
  await page.reload();
  await expect(stepText(page)).toContainText('Schritt 4 von 4');
  await expect(page.locator('.act-card')).toContainText('Google');
  // Reload on step 1 with a selection stays on step 1 (it does not jump ahead).
  await page.getByRole('button', { name: 'Andere Apps wählen' }).click();
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await page.reload();
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveText(/Google/);
});

test('wizard: deselecting everything falls back to step 1 for real, the next tap does not jump ahead', async ({ page }) => {
  await page.goto('/');
  await pick(page, ['Google']);
  await page.getByRole('button', { name: /Weiter/ }).click();
  await expect(stepText(page)).toContainText('Schritt 2 von 4');
  // Back to step 1 with the browser, deselect, forward again: nothing selected → step 1.
  await page.goBack();
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await pick(page, ['Google']);
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  // aria-disabled, but still focusable and clickable: it explains what is missing.
  // dispatchEvent instead of a forced pointer click: deterministic on touch emulation too.
  const next = page.getByRole('button', { name: 'Weiter', exact: true });
  await expect(next).toHaveAttribute('aria-disabled', 'true');
  await next.dispatchEvent('click');
  await expect(page.getByText('Tippe zuerst mindestens eine App an.')).toBeVisible();
  // The next tap stays on step 1.
  await pick(page, ['YouTube']);
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await expect(page.getByRole('button', { name: /Weiter · 1 App gewählt/ })).toBeVisible();
});

test('wizard: after "Alles löschen" the next tap stays on step 1', async ({ page }) => {
  await page.goto('/#d=whatsapp');
  await expect(stepText(page)).toContainText('Schritt 2 von 4');
  await page.locator('.trust-panel summary').click();
  await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
  await page.keyboard.press('Escape');
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await pick(page, ['Google']);
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  expect(await page.evaluate(() => (history.state as { durchblickStep?: number } | null)?.durchblickStep)).toBe(1);
});

test('a selection typed into the address on the same page is taken over', async ({ page }) => {
  await page.goto('/#d=google');
  await expect(page.locator('#wiz-h')).toContainText('Google');
  await page.evaluate(() => (location.hash = '#d=tiktok'));
  await expect(page.locator('#wiz-h')).toContainText('TikTok');
  await page.goto('/plan/#d=tiktok');
  await expect(page.locator('.plan-head')).toContainText('TikTok');
  await page.evaluate(() => (location.hash = '#d=netflix'));
  await expect(page.locator('.plan-head')).toContainText('Netflix');
});

test('skip link and anchors keep the selection for the next page', async ({ page, isMobile }) => {
  await page.goto('/#d=spotify,paypal');
  await expect(page.locator('#wiz-h')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.evaluate(() => (location.hash = '#main'));
  if (isMobile) await page.locator('.nav-menu summary').click();
  const plan = page.locator('header a[href="/plan/"]').filter({ visible: true }).first();
  await plan.click();
  await expect(page.locator('.plan-head')).toContainText('Spotify, PayPal');
});

test('"Alles löschen" removes the selection from the address too, and the plan stops claiming it saves', async ({ page }) => {
  await page.goto('/plan/#d=google');
  await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
  await page.locator('.stage-start .done-toggle input').first().check();
  await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
  await expect(page.getByText('Dein Fortschritt ist nur auf diesem Gerät gespeichert.')).toBeVisible();

  await page.locator('.trust-panel summary').click();
  await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await expect(page).toHaveURL(/\/plan\/$/);
  await expect(page.locator('.trust-pop')).toContainText('nichts');
  await expect(page.getByText('Dein Fortschritt ist nur auf diesem Gerät gespeichert.')).toHaveCount(0);
  await expect(page.locator('.plan-head')).toContainText('Ohne Auswahl');
  await expect(page.locator('.stage-start .done-toggle input:checked')).toHaveCount(0);
});

test('"Alles löschen" is offered when the selection is only in the address', async ({ page }) => {
  await page.goto('/#d=whatsapp');
  await expect(stepText(page)).toContainText('Schritt 2 von 4');
  await page.locator('.trust-panel summary').click();
  await expect(page.locator('.trust-pop')).toContainText('Ausgewählt: WhatsApp');
  await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(stepText(page)).toContainText('Schritt 1 von 4');
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveCount(0);
});

test('a broken stored value does not break the pages', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/transparenz/');
  await page.evaluate(() => {
    localStorage.setItem('durchblick:consent', 'local');
    localStorage.setItem('durchblick:services', '{"a":1}');
    localStorage.setItem('durchblick:plan-done', '"x"');
  });
  for (const path of ['/', '/check/', '/plan/']) {
    await page.goto(path);
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  }
  await page.evaluate(() => sessionStorage.setItem('durchblick:selection', '{"not":"a list"}'));
  for (const path of ['/', '/check/', '/plan/', '/einstellungen/']) {
    await page.goto(path);
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  }
  await page.goto('/');
  await pick(page, ['Google']);
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('durchblick:selection'))).toBe('["google"]');
  expect(errors).toEqual([]);
});

test('header pop-ups close with Escape (focus back on the button) and by tapping elsewhere', async ({ page, isMobile }) => {
  await page.goto('/');
  const trust = page.locator('.trust-panel');
  await trust.locator('summary').click();
  await expect(trust).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(trust).not.toHaveAttribute('open', '');
  await trust.locator('summary').click();
  await page.mouse.click(10, (page.viewportSize()?.height ?? 600) - 10);
  await expect(trust).not.toHaveAttribute('open', '');
  if (isMobile) {
    const menu = page.locator('.nav-menu');
    await menu.locator('summary').click();
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(menu.locator('summary')).toBeFocused();
  }
});

test('the service worker never stores the selection (#d=…) and works offline', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'service worker checks run in Chromium');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.goto('/plan/#d=tiktok,netflix');
  await page.goto('/einstellungen/#d=paypal');
  await page.goto('/dienste/tiktok/');
  await page.goto('/en/apps/snapchat/');
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).length)).toBeGreaterThan(0);
  const keys = await page.evaluate(async () => {
    const all: string[] = [];
    for (const name of await caches.keys()) for (const r of await (await caches.open(name)).keys()) all.push(r.url);
    return all;
  });
  expect(keys.some((k) => k.includes('#'))).toBe(false);
  // Only fixed core pages and build files – the cache must not tell which apps someone looked at.
  expect(keys.filter((k) => /\/dienste\/[a-z]|\/apps\/[a-z]/.test(k)), 'visited app pages in the cache').toEqual([]);
  expect(keys.some((k) => k.includes('/_astro/') && k.endsWith('.css'))).toBe(true);

  await context.setOffline(true);
  await page.goto('/en/plan/#d=google');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.plan-head')).toContainText('Google');
  await context.setOffline(false);
});

test.describe('small phones (360 px)', () => {
  test.use({ viewport: { width: 360, height: 780 } });
  for (const path of ['/', '/plan/#d=google', '/dienste/instagram/', '/einstellungen/', '/en/', '/transparenz/']) {
    test(`no horizontal scroll, menu fully visible: ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      const visible = page.locator('header .nav-menu summary, header .nav-wide').filter({ visible: true }).first();
      const box = await visible.boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(360);
      await page.locator('.trust-panel summary').click();
      expect(await page.evaluate(() => window.scrollX)).toBe(0);
      const pop = await page.locator('.trust-pop').boundingBox();
      expect(pop!.x).toBeGreaterThanOrEqual(0);
      expect(pop!.x + pop!.width).toBeLessThanOrEqual(360);
    });
  }
});

test.describe('audit 2026-11: findings without a test so far', () => {
  test('P1-4: a new wizard step starts below the sticky header on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await pick(page, ['Instagram', 'WhatsApp', 'Google']);
    await page.getByRole('button', { name: /Weiter · 3 Apps gewählt/ }).click();
    await expect(page.locator('#wiz-h')).toBeFocused();
    const headerBottom = await page.locator('.site-header').evaluate((e) => e.getBoundingClientRect().bottom);
    const headingTop = await page.locator('#wiz-h').evaluate((e) => e.getBoundingClientRect().top);
    expect(headingTop).toBeGreaterThanOrEqual(headerBottom);
  });

  test('P2-4 / review P1-A: a saved selection works on every page without ever entering an address', async ({ page }) => {
    await page.goto('/plan/#d=paypal');
    await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
    await page.locator('.stage-start .done-toggle input').first().check();
    await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
    const visited: string[] = [];
    page.on('framenavigated', (f) => {
      if (f === page.mainFrame()) visited.push(f.url());
    });
    for (const path of ['/', '/plan/', '/check/', '/einstellungen/']) {
      await page.goto('about:blank');
      await page.goto(path);
      await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
      expect(page.url(), `${path} must not show the saved selection in the address`).not.toContain('#d=');
    }
    await expect(page.locator('details#paypal')).toHaveClass(/is-mine/);
    await page.goto('/plan/');
    await expect(page.locator('.plan-head')).toContainText('PayPal');
    await expect(page.locator('header a[href^="/einstellungen/"]').first()).toHaveAttribute('href', '/einstellungen/');
    expect(visited.filter((u) => u.includes('#d=')), 'no saved selection in any visited address').toEqual([]);
  });

  test('review P2: "Alles löschen" also clears the marks on the settings page', async ({ page }) => {
    await page.goto('/einstellungen/#d=whatsapp');
    await expect(page.locator('details#whatsapp')).toHaveClass(/is-mine/);
    await page.locator('.trust-panel summary').click();
    await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
    await expect(page.locator('details#whatsapp')).not.toHaveClass(/is-mine/);
    await expect(page.locator('.is-mine')).toHaveCount(0);
  });

  test('P2-6: with storage blocked, the plan says so instead of asking for consent', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    await page.goto('/plan/#d=google');
    await expect(page.getByText('Dein Browser erlaubt dieser Seite gerade keine Speicherung.', { exact: false })).toBeVisible();
    // D-N24 consequence, said honestly (final review): no storage, no selection across pages.
    await expect(page.locator('.storage-note')).toContainText('deine Auswahl geht nicht von Seite zu Seite mit');
    await page.locator('.stage-start .done-toggle input').first().check();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByText(/1 von 3/)).toBeVisible();
  });
});

test('P2-5: without JavaScript the start page shows the way in, not dead buttons', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('.wiz')).toBeHidden();
  await expect(page.locator('noscript').first()).toBeAttached();
  await expect(page.getByRole('link', { name: 'Alle Apps' }).first()).toBeVisible();
  await ctx.close();
});

test('two open tabs do not keep each other busy (storage ping-pong, found on main)', async ({ context }) => {
  await context.addInitScript(() => {
    (window as unknown as { __storageEvents: number }).__storageEvents = 0;
    addEventListener('storage', () => (window as unknown as { __storageEvents: number }).__storageEvents++);
  });
  const first = await context.newPage();
  await first.goto('/plan/#d=google');
  await expect(first.locator('astro-island[ssr]')).toHaveCount(0);
  const second = await context.newPage();
  await second.goto('/');
  await expect(second.locator('astro-island[ssr]')).toHaveCount(0);
  await second.locator('.app-tile').first().click();
  await expect.poll(() => second.evaluate(() => sessionStorage.getItem('durchblick:selection'))).toBe('["instagram"]');
  await first.waitForTimeout(1500);
  const events = await first.evaluate(() => (window as unknown as { __storageEvents: number }).__storageEvents);
  expect(events).toBeLessThan(10);
});

test.describe('review 2 (phase 4): focus and position', () => {
  test('P1-a: after a long, scrolled step 1 the next step starts fully below the header', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await page.getByRole('button', { name: /weitere Apps zeigen/ }).click();
    for (const tile of await page.locator('.app-tile').all()) await tile.click();
    await page.getByRole('button', { name: /Weiter · 14 Apps gewählt/ }).click();
    await expect(page.locator('#wiz-h')).toBeFocused();
    const headerBottom = await page.locator('.site-header').evaluate((e) => e.getBoundingClientRect().bottom);
    const countTop = await page.locator('#wiz-count').evaluate((e) => e.getBoundingClientRect().top);
    expect(countTop).toBeGreaterThanOrEqual(headerBottom);
  });

  test('P1-b: the "remember?" question gets focus and is on screen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/plan/#d=google,instagram');
    await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
    await page.locator('.stage-start .done-toggle input').first().check();
    const yes = page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' });
    await expect(yes).toBeFocused();
    await expect(yes).toBeInViewport();
  });

  test('P2-1: after "Alles löschen" focus stays in the panel, on the new state', async ({ page }) => {
    await page.goto('/#d=whatsapp');
    await page.locator('.trust-panel summary').click();
    await page.locator('.trust-pop').getByRole('button', { name: 'Alles löschen' }).click();
    await expect(page.locator('.trust-nothing')).toBeFocused();
    await expect(page.locator('.trust-nothing')).toContainText('nichts');
    await expect(page.locator('.trust-nothing')).toContainText('Andere offene Tabs behalten ihre eigene Auswahl');
  });
});
