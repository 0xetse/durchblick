import { expect, test } from '@playwright/test';

const PAGES = ['/', '/spuren/', '/check/#d=google,youtube,instagram,facebook,whatsapp,tiktok,amazon,chatgpt', '/#d=google,instagram,whatsapp', '/plan/#d=google,instagram', '/dienste/', '/dienste/instagram/', '/alternativen/', '/transparenz/', '/methodik/', '/einstellungen/', '/warum/', '/en/', '/en/#d=google,instagram,whatsapp', '/en/apps/instagram/', '/en/settings/', '/en/why/', '/en/alternatives/'];

for (const path of PAGES) {
  test(`no horizontal page scroll: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('service page: the numbered jump bar stays visible while scrolling and its targets are not hidden', async ({ page }) => {
  await page.goto('/dienste/instagram/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  const bar = await page.locator('.jump').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(bar!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
  expect(bar!.y).toBeLessThan(header!.y + header!.height + 2);
  await page.locator('.jump a[href="#tun"]').click();
  await expect(page).toHaveURL(/#tun$/);
  const h2 = await page.locator('#tun h2').boundingBox();
  const barNow = await page.locator('.jump').boundingBox();
  expect(h2!.y).toBeGreaterThanOrEqual(barNow!.y + barNow!.height);
});

test('service page: on a 360 px phone all five jump entries are visible', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const path of ['/dienste/linkedin/', '/en/apps/linkedin/']) {
    await page.goto(path);
    const last = await page.locator('.jump a').last().boundingBox();
    expect(last!.x + last!.width, path).toBeLessThanOrEqual(360);
  }
});

test('no island loads its code later (a deploy in between would leave it broken)', async ({ page }) => {
  // Reproduced 2026-11-13: an island hydrated on scroll (client:visible) requested
  // its old chunk after a deploy had replaced the files – 404 in Chromium, Firefox
  // and WebKit, with and without the service worker. Everything loads up front now.
  for (const path of ['/', '/check/', '/plan/', '/einstellungen/', '/dienste/instagram/', '/en/apps/instagram/', '/spuren/', '/transparenz/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('astro-island[client="visible"], astro-island[client="media"]'), path).toHaveCount(0);
    await expect(page.locator('astro-island[ssr]'), `${path}: all islands hydrated without scrolling`).toHaveCount(0);
  }
});
