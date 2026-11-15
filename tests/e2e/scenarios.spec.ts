import { expect, test, type Page } from '@playwright/test';

/**
 * Realistic selections, end to end: every app on its own, typical mixes and
 * all apps. Each must lead to a fact with a source, a concrete change and a plan.
 */
const ALL = ['instagram', 'whatsapp', 'google', 'youtube', 'amazon', 'tiktok', 'facebook', 'chatgpt', 'spotify', 'netflix', 'paypal', 'telegram', 'snapchat', 'linkedin'];
const MIXES: Record<string, string[]> = {
  'typical phone': ['whatsapp', 'instagram', 'youtube'],
  'only the less common ones': ['paypal', 'linkedin', 'telegram'],
  'streaming only': ['netflix', 'spotify'],
  'everything': ALL,
};

async function walk(page: Page, ids: string[]) {
  await page.goto('about:blank');
  await page.goto(`/#d=${ids.join(',')}`);
  await expect(page.locator('#wiz-count')).toContainText('Schritt 2 von 4');
  await expect(page.locator('.wiz-areas li').first()).toBeVisible();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(page.locator('#wiz-h')).toHaveText('Das wissen die wenigsten');
  const fact = page.locator('.wow-fact');
  await expect(fact).not.toBeEmpty();
  expect((await fact.textContent())!.length).toBeGreaterThan(40);
  await expect(page.locator('.wow-card .evidence a').first()).toHaveAttribute('href', /^https:\/\//);
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  const card = page.locator('.act-card');
  await expect(card, 'step 4 must suggest a concrete change').toBeVisible();
  // a way to act: the official setting, the steps right here, or the guide page
  const ways = await card.locator('a.btn-primary[target="_blank"], .wiz-steps .steps li, a[href*="/anleitungen/"]').count();
  expect(ways).toBeGreaterThan(0);
  await page.locator('.wiz-links').getByRole('link', { name: /Mein Plan/ }).click();
  await expect(page.locator('.stage-start .action').first()).toBeVisible();
  const n = await page.locator('.stage-start .action').count();
  expect(n).toBeGreaterThanOrEqual(1);
  expect(n).toBeLessThanOrEqual(3);
}

test.describe('scenarios', () => {
  test.skip(({ isMobile }) => isMobile, 'content scenarios once, on desktop');
  for (const id of ALL) test(`one app: ${id}`, async ({ page }) => walk(page, [id]));
  for (const [name, ids] of Object.entries(MIXES)) test(`mix: ${name}`, async ({ page }) => walk(page, ids));
});
