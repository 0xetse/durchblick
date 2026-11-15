import { expect, test } from '@playwright/test';

/** Keyboard order in the header follows what is on screen (audit 2026-11, P2-11). */
test('header: Tab order matches the visual order on phones and desktops', async ({ page, isMobile }) => {
  await page.goto('/einstellungen/');
  const order: string[] = [];
  await page.keyboard.press('Tab'); // skip link
  for (let i = 0; i < (isMobile ? 4 : 7); i++) {
    await page.keyboard.press('Tab');
    order.push(
      await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        return el.closest('.trust-panel') ? 'trust' : el.closest('.nav-menu') ? 'menu' : el.classList.contains('lang-switch') ? 'lang' : el.classList.contains('brand') ? 'brand' : `link:${el.textContent?.trim()}`;
      }),
    );
  }
  // and the visual order, left to right, of the same elements
  const visual = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.bar a, .bar summary')]
      .filter((el) => el.checkVisibility() && el.getBoundingClientRect().width > 0 && !el.closest('.trust-pop') && !(el.tagName === 'A' && el.closest('details:not([open])')))
      .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
      .map((el) => (el.closest('.trust-panel') ? 'trust' : el.closest('.nav-menu') ? 'menu' : el.classList.contains('lang-switch') ? 'lang' : el.classList.contains('brand') ? 'brand' : `link:${el.textContent?.trim()}`)),
  );
  expect(order).toEqual(visual);
  expect(order).toEqual(isMobile ? ['brand', 'lang', 'trust', 'menu'] : expect.arrayContaining(['brand', 'lang', 'trust']));
  expect(await page.getByRole('navigation', { name: 'Hauptnavigation' }).count()).toBe(1);
});
