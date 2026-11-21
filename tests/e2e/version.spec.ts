import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const version = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number | string) => String(n).padStart(2, '0');

/** "zwischen 07.10. und 11.11.2026" / "am 11.11.2026" → ["2026-10-07", "2026-11-11"] */
function parseDe(text: string): [string, string] {
  const between = /^Inhalte zuletzt geprüft zwischen (\d{2})\.(\d{2})\.(\d{4})? und (\d{2})\.(\d{2})\.(\d{4}) · Version (.+)$/.exec(text);
  if (between) {
    const [, d1, m1, y1, d2, m2, y2] = between;
    return [`${y1 ?? y2}-${m1}-${d1}`, `${y2}-${m2}-${d2}`];
  }
  const on = /^Inhalte zuletzt geprüft am (\d{2})\.(\d{2})\.(\d{4}) · Version (.+)$/.exec(text);
  if (!on) throw new Error(`unexpected German footer: ${text}`);
  return [`${on[3]}-${on[2]}-${on[1]}`, `${on[3]}-${on[2]}-${on[1]}`];
}

/** "between 7 Oct and 11 Nov 2026" / "on 11 Nov 2026" → ["2026-10-07", "2026-11-11"] */
function parseEn(text: string): [string, string] {
  const m = (s: string) => pad(MONTHS.indexOf(s) + 1);
  const between = /^Content last reviewed between (\d{1,2}) ([A-Z][a-z]{2})(?: (\d{4}))? and (\d{1,2}) ([A-Z][a-z]{2}) (\d{4}) · Version (.+)$/.exec(text);
  if (between) {
    const [, d1, m1, y1, d2, m2, y2] = between;
    return [`${y1 ?? y2}-${m(m1!)}-${pad(d1!)}`, `${y2}-${m(m2!)}-${pad(d2!)}`];
  }
  const on = /^Content last reviewed on (\d{1,2}) ([A-Z][a-z]{2}) (\d{4}) · Version (.+)$/.exec(text);
  if (!on) throw new Error(`unexpected English footer: ${text}`);
  const day = `${on[3]}-${m(on[2]!)}-${pad(on[1]!)}`;
  return [day, day];
}

test('footer: content review span and the version from package.json, the same in German and English', async ({ page }) => {
  await page.goto('/');
  const de = (await page.locator('[data-footer-meta]').innerText()).trim();
  await page.goto('/en/');
  const en = (await page.locator('[data-footer-meta]').innerText()).trim();
  expect(de.endsWith(`· Version ${version}`), de).toBe(true);
  expect(en.endsWith(`· Version ${version}`), en).toBe(true);
  const [deFrom, deTo] = parseDe(de);
  expect(parseEn(en)).toEqual([deFrom, deTo]);
  expect(deFrom <= deTo).toBe(true);
  // Every page shows the same footer.
  await page.goto('/methodik/');
  expect((await page.locator('[data-footer-meta]').innerText()).trim()).toBe(de);
});

for (const path of ['/transparenz/', '/en/transparency/']) {
  test(`${path}: technical state with version and commit, a link only for a matching commit`, async ({ page }) => {
    await page.goto(path);
    const list = page.locator('dl[data-build-state]');
    await expect(page.locator('[data-build-version]')).toHaveText(version);
    const state = await list.getAttribute('data-build-state');
    expect(['clean', 'modified', 'unknown']).toContain(state);
    const commit = await list.locator('[data-build-commit]').getAttribute('data-build-commit');
    const link = list.locator('a');
    if (state === 'unknown') {
      expect(commit).toBe('');
      await expect(link).toHaveCount(0);
    } else {
      expect(commit).toMatch(/^[0-9a-f]{12}$/);
      if (state === 'clean') {
        await expect(link).toHaveAttribute('href', `https://github.com/0xetse/durchblick/commit/${commit}`);
        await expect(link).toHaveAttribute('rel', /noreferrer/);
      } else {
        await expect(link).toHaveCount(0);
      }
    }
    // In GitHub Actions the build comes from GITHUB_SHA and a clean checkout.
    const sha = process.env.GITHUB_SHA;
    if (sha && !process.env.DURCHBLICK_COMMIT) {
      expect(commit).toBe(sha.slice(0, 12).toLowerCase());
      expect(state).toBe('clean');
    }
  });
}
