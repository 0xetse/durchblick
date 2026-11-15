import { expect, test, type Page } from '@playwright/test';

/**
 * The whole wizard with the keyboard only (WCAG 2.1.1, 2.4.3, 2.4.7, 4.1.3).
 * Automated: this checks focus and semantics, not what a screen reader says.
 */
const active = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return { id: el?.id ?? '', text: el?.textContent?.trim().replace(/\s+/g, ' ') ?? '', tag: el?.tagName ?? '', cls: el?.className ?? '' };
  });

async function tabUntil(page: Page, match: (a: Awaited<ReturnType<typeof active>>) => boolean, max = 60) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (match(await active(page))) return;
  }
  throw new Error('focus never reached the expected element');
}

test('wizard: keyboard only, from the first tile to an action', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard walk on desktop');
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);

  // Step 1: "Weiter" without a selection explains itself and keeps focus.
  await tabUntil(page, (a) => a.tag === 'BUTTON' && a.text === 'Weiter');
  await page.keyboard.press('Enter');
  const status = page.locator('.wiz-nav [role="status"]');
  await expect(status).toHaveText('Tippe zuerst mindestens eine App an.');
  expect((await active(page)).text).toBe('Weiter');

  // Tiles: Space and Enter toggle, state is exposed as aria-pressed.
  await page.locator('a.skip-link').focus();
  await tabUntil(page, (a) => a.cls.includes('app-tile') && a.text === 'Instagram');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveCount(2);
  // The live region stays (so later messages are announced), but it is empty now.
  await expect(status).toHaveText('');

  // Next: focus moves to the new step's heading, which names the step.
  await tabUntil(page, (a) => a.tag === 'BUTTON' && a.text.startsWith('Weiter'));
  await page.keyboard.press('Enter');
  await expect(page.locator('#wiz-h')).toBeFocused();
  await expect(page.locator('#wiz-count')).toContainText('Schritt 2 von 4');

  // Back with the keyboard and forward again.
  await tabUntil(page, (a) => a.tag === 'BUTTON' && a.text === 'Zurück');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wiz-h')).toBeFocused();
  await expect(page.locator('#wiz-count')).toContainText('Schritt 1 von 4');
  await tabUntil(page, (a) => a.tag === 'BUTTON' && a.text.startsWith('Weiter'));
  await page.keyboard.press('Enter');
  await expect(page.locator('#wiz-h')).toBeFocused(); // like a person: wait until the new step is there
  await tabUntil(page, (a) => a.tag === 'BUTTON' && a.text === 'Weiter');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wiz-h')).toBeFocused();
  await expect(page.locator('#wiz-h')).toHaveText('Das wissen die wenigsten');

  // Step 3: the evidence opens with the keyboard.
  await tabUntil(page, (a) => a.tag === 'SUMMARY' && a.text.startsWith('Woher wissen wir das?'));
  await page.keyboard.press('Enter');
  await expect(page.locator('.wow-card details')).toHaveAttribute('open', '');
  await tabUntil(page, (a) => a.text === 'Was kann ich tun?');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wiz-h')).toBeFocused();
  await expect(page.locator('#wiz-count')).toContainText('Schritt 4 von 4');

  // Step 4: an action is reachable – the official link or the steps.
  await tabUntil(page, (a) => (a.tag === 'A' && a.text.includes('öffnen')) || (a.tag === 'SUMMARY' && a.text === 'Schritt für Schritt') || a.text.startsWith('Mein Plan'));
  // Every focused control in the wizard has a visible focus indicator.
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

test('plan: sharing works with the keyboard and reports the result', async ({ page, context, browserName, isMobile }) => {
  test.skip(isMobile, 'keyboard walk on desktop');
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/plan/#d=google,instagram');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.locator('a.skip-link').focus();
  await tabUntil(page, (a) => a.tag === 'SUMMARY' && a.text === 'Link mit meiner Auswahl teilen');
  await page.keyboard.press('Enter');
  await expect(page.locator('details.share')).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(page.locator('.share-url')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Link kopieren' })).toBeFocused();
  await page.keyboard.press('Enter');
  // Copied, or – where the browser refuses – an honest fallback; either way announced in role=status.
  await expect(page.locator('details.share [role="status"]')).toHaveText(/Kopiert|Kopieren hat nicht geklappt/);
});

test('plan: after answering "merken?" focus returns to the tick that asked, and the answer is announced', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard walk on desktop');
  for (const answer of ['Ja, auf diesem Gerät merken', 'Nein, nur für jetzt']) {
    // Start each round without consent: clear storage before the plan reads it.
    await page.goto('/404.html');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/plan/#d=google');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
    const box = page.locator('.stage-start .done-toggle input').nth(1);
    await box.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: answer })).toBeVisible();
    await page.getByRole('button', { name: answer }).focus();
    await page.keyboard.press('Enter');
    await expect(box).toBeFocused();
    await expect(page.locator('.storage-note')).toHaveAttribute('role', 'status');
  }
});

test('transparency: after "Alles löschen" focus stays in the storage card', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard walk on desktop');
  await page.goto('/plan/#d=google');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.goto('/transparenz/');
  await expect(page.locator('#live-storage')).toHaveText('In deinem Browser gespeichert');
  await page.getByRole('button', { name: 'Alles löschen' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#live-storage')).toBeFocused();
});
