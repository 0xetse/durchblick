import { defineConfig, devices } from '@playwright/test';

// Chromium to use: PW_CHROMIUM_PATH if set (e.g. a browser that is already
// installed), else Playwright's own (`npx playwright install chromium`).
// Only for the Chromium projects: Firefox and WebKit always use Playwright's builds.
const executablePath = process.env.PW_CHROMIUM_PATH;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    locale: 'de-DE',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions } },
    // Other engines: the user flows and state handling (not every page again).
    // Run with `npm run test:e2e:engines` after `npx playwright install firefox webkit`.
    ...(process.env.PW_ENGINES
      ? [
          // Firefox gets its own server without the Cross-Origin-Opener-Policy header:
          // with it, Playwright's Firefox fails to finish page.goto in about 16 % of
          // navigations (independent review, 80 navigations; 0 without the header).
          // All other headers stay. COOP itself is checked in the other engines
          // (trust.spec.ts). Whether real Firefox is affected: manual device test.
          { name: 'firefox', testMatch: /(flows|state|trust|keyboard|header|selection-privacy)\.spec\.ts/, use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:4322' } },
          { name: 'webkit', testMatch: /(flows|state|trust|keyboard|header|selection-privacy)\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
          { name: 'iphone', testMatch: /(flows|state|trust|keyboard|header|selection-privacy)\.spec\.ts/, use: { ...devices['iPhone 13'] } },
        ]
      : []),
  ],
  webServer: [
    {
      // Serves the built dist/ in the foreground, with dist/_headers applied (see scripts/serve-dist.mjs).
      command: 'node scripts/serve-dist.mjs',
      url: 'http://localhost:4321',
      reuseExistingServer: false,
      timeout: 60_000,
    },
    ...(process.env.PW_ENGINES
      ? [
          {
            command: 'node scripts/serve-dist.mjs',
            url: 'http://localhost:4322',
            env: { PORT: '4322', SERVE_OMIT_HEADERS: 'Cross-Origin-Opener-Policy' },
            reuseExistingServer: false,
            timeout: 60_000,
          },
        ]
      : []),
  ],
});
