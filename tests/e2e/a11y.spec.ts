import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/#d=instagram,google,amazon', '/spuren/', '/check/#d=google,youtube', '/plan/#d=google', '/dienste/', '/dienste/google/', '/anleitungen/google-ads-personalisation/', '/alternativen/', '/transparenz/', '/methodik/', '/einstellungen/#d=whatsapp,google', '/warum/', '/en/', '/en/#d=instagram,google,amazon', '/en/settings/#d=whatsapp', '/en/apps/google/', '/en/guides/google-ads-personalisation/', '/en/why/', '/en/plan/#d=google', '/en/traces/', '/en/transparency/'];

for (const path of PAGES) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`a11y ${scheme}: ${path}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path, { waitUntil: 'networkidle' });
      // open all disclosures so hidden content is audited too
      // (the header trust popover is audited separately – opened, it overlays content by design)
      await page.evaluate(() =>
        document.querySelectorAll('details:not(.trust-panel)').forEach((d) => ((d as HTMLDetailsElement).open = true)),
      );
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`);
      expect(summary).toEqual([]);
    });
  }
}

test('trust panel popover is accessible when open', async ({ page }) => {
  await page.goto('/#d=google,instagram', { waitUntil: 'networkidle' });
  await page.locator('.trust-panel summary').click();
  await expect(page.locator('.trust-pop')).toBeVisible();
  const results = await new AxeBuilder({ page }).include('.trust-panel').withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('keyboard: skip link moves focus to main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard test on desktop');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  // The address keeps its selection (#d=…) instead of switching to #main.
  await expect(page).toHaveURL(/\/$/);
});
