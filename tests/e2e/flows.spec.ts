import { expect, test } from '@playwright/test';

test('signature: harmless traces combine into a labelled inference', async ({ page }) => {
  await page.goto('/spuren/');
  const sim = page.locator('.spuren');
  const first = sim.getByRole('button', { pressed: false }).first();
  await expect(first).toBeVisible();
  const chips = sim.locator('.chips button');
  const n = await chips.count();
  for (let i = 0; i < Math.min(n, 6); i++) await chips.nth(i).click();
  await expect(sim.locator('.inference').first()).toBeVisible();
  await expect(sim.locator('.inference .badge').first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('first use: wizard apps → areas → sourced fact → action, nothing stored', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Was erfahren deine Apps/);
  await expect(page.getByRole('heading', { name: 'Welche Apps nutzt du?' })).toBeVisible();
  await expect(page.getByText('Schritt 1 von 4')).toBeVisible();
  for (const name of [/^Instagram/, /^Google/, /^Amazon/]) await page.locator('.app-tile').filter({ hasText: name }).click();
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveCount(3);
  await expect(page.getByText('Deine Auswahl bleibt in deinem Browser')).toBeVisible();
  await page.getByRole('button', { name: /Weiter · 3 Apps gewählt/ }).click();
  // step 2: areas in plain words, focus follows the step
  const h2 = page.locator('#wiz-h');
  await expect(h2).toContainText('Deine 3 Apps können');
  await expect(h2).toBeFocused();
  await expect(page.locator('.wiz-areas li')).toHaveCount(3);
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  // step 3: one fact about a selected app, evidence one tap away
  await expect(h2).toHaveText('Das wissen die wenigsten');
  const wow = page.locator('.wow-card');
  await wow.getByText('Woher wissen wir das?').click();
  await expect(wow.locator('.evidence a').first()).toHaveAttribute('rel', /noreferrer/);
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  // step 4: the bridge from insight to action
  await expect(h2).toContainText('Das kannst du in etwa');
  await expect(page.locator('.act-card')).toContainText('Das bleibt');
  // D-N24: the selection stays in this tab – not in the address, not in links, not on the device.
  await expect(page.getByRole('link', { name: /Mein Plan: deine wichtigsten Schritte/ })).toHaveAttribute('href', '/plan/');
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('durchblick:selection'))).toBe('["instagram","google","amazon"]');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('a shared link opens the wizard at step 2 and is removed from the address', async ({ page }) => {
  await page.goto('/#d=whatsapp');
  await expect(page.getByText('Schritt 2 von 4')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#wiz-h')).toContainText('Deine App WhatsApp kann');
  await page.getByRole('button', { name: 'Zurück' }).click();
  await expect(page.locator('.app-tile[aria-pressed="true"]')).toHaveText(/WhatsApp/);
});

test('the selection travels with this tab, not in links or addresses, nothing on the device', async ({ page, isMobile }) => {
  await page.goto('/#d=spotify,paypal');
  await expect(page).toHaveURL(/\/$/);
  const link = page.locator('header a[href="/plan/"]').filter({ visible: true }).first();
  if (isMobile) await page.locator('.nav-menu summary').click();
  await expect(link).toHaveAttribute('href', '/plan/');
  await link.click();
  await expect(page).toHaveURL(/\/plan\/$/);
  await expect(page.locator('.plan-head')).toContainText('Spotify');
  await expect(page.locator('.plan-head')).toContainText('PayPal');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('plan → consent → trust panel shows exactly what is stored → delete', async ({ page }) => {
  await page.goto('/check/#d=google,youtube');
  await expect(page.locator('.muster-headline')).toBeVisible();
  await page.getByRole('link', { name: 'Meine ersten Schritte' }).click();
  await expect(page).toHaveURL(/\/plan\/$/);
  await expect(page.locator('.plan-head')).toContainText('Google, YouTube');
  await expect(page.getByRole('heading', { name: 'Start hier' })).toBeVisible();
  await expect(page.locator('.stage-start .action')).toHaveCount(3);
  // The list is server-rendered; wait until the plan island is interactive before ticking.
  await expect(page.locator('astro-island[ssr]:has(.stage-start)')).toHaveCount(0);
  const box = page.locator('.stage-start .done-toggle input').first();
  await box.check();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
  await expect(page.getByText(/1 von 3/)).toBeVisible();

  // trust panel: the real local state, in plain words
  await page.locator('.trust-panel summary').click();
  const pop = page.locator('.trust-pop');
  await expect(pop).toContainText('Durchblick weiß gerade');
  await expect(pop).toContainText('Gespeichert: deine Apps');
  await expect(pop).toContainText('1 erledigte Schritte');
  await pop.getByRole('button', { name: 'Alles löschen' }).click();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);

  await page.goto('/transparenz/');
  await expect(page.getByText('Nichts.')).toBeVisible();
});

test('transparency page lists and deletes stored data', async ({ page }) => {
  await page.goto('/plan/#d=google');
  await page.locator('.done-toggle input').first().check();
  await page.getByRole('button', { name: 'Ja, auf diesem Gerät merken' }).click();
  await page.goto('/transparenz/');
  // three entries on the device (after consent) plus the selection of this tab
  await expect(page.locator('.stored li')).toHaveCount(4);
  await expect(page.locator('.stored')).toContainText('durchblick:selection');
  await page.getByRole('button', { name: 'Alles löschen' }).click();
  await expect(page.getByText('Alles gelöscht: auf diesem Gerät und in diesem Tab.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
});

test('declining consent keeps working without storing anything', async ({ page }) => {
  await page.goto('/plan/#d=google');
  await page.locator('.done-toggle input').first().check();
  await page.getByRole('button', { name: 'Nein, nur für jetzt' }).click();
  await expect(page.getByText(/1 von \d+/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('service page reads as a structured brief and works without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/dienste/instagram/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Instagram');
  for (const q of ['Was Instagram wissen kann', 'Wie Instagram es erfährt', 'Was sich daraus schließen lässt', 'Was du ändern kannst', 'Belege']) {
    await expect(page.getByRole('heading', { name: q, level: 2 })).toBeVisible();
  }
  await expect(page.locator('.journey-step').first()).toBeVisible();
  await expect(page.locator('.source-list li').first()).toBeVisible();
  await expect(page.getByText('Typische Preisgabe')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Was du ändern kannst' })).toBeVisible();
  await ctx.close();
});

test('external links never leak the referrer', async ({ page }) => {
  await page.goto('/dienste/google/');
  const rels = await page.locator('a[target="_blank"]').evaluateAll((as) => as.map((a) => a.getAttribute('rel')));
  expect(rels.length).toBeGreaterThan(0);
  for (const r of rels) expect(r).toContain('noreferrer');
});

test('orientation: every subpage says where you are and lights up its menu entry', async ({ page, isMobile }) => {
  await page.goto('/anleitungen/google-ads-personalisation/');
  const crumbs = page.getByRole('navigation', { name: 'Du bist hier' });
  await expect(crumbs.getByRole('link')).toHaveText(['Start', 'Einstellungen ändern', 'Google']);
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Anleitung');
  if (isMobile) await page.locator('.nav-menu summary').click();
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(nav.locator('a[aria-current]:visible')).toHaveText('Einstellungen ändern');
  await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Du bist hier' })).toHaveCount(0);
});

test('settings: from an app page to its settings, own apps first, nothing stored', async ({ page }) => {
  await page.goto('/dienste/instagram/');
  await page.getByRole('link', { name: 'Einstellungen bei Instagram ändern' }).click();
  await expect(page).toHaveURL(/\/einstellungen\/#instagram$/);
  const section = page.locator('details#instagram');
  await expect(section).toHaveAttribute('open', '');
  await expect(page.locator('details#google')).not.toHaveAttribute('open', '');
  await expect(section.getByRole('heading', { name: 'Instagram' })).toBeVisible();
  await expect(section.locator('.settings-rows li').first()).toBeVisible();
  await expect(section.getByRole('link', { name: /^Anleitung/ }).first()).toHaveAttribute('href', /^\/anleitungen\//);

  await page.goto('/einstellungen/#d=whatsapp,google');
  await expect(page.locator('[data-settings-sections] > details').first()).toHaveAttribute('id', 'whatsapp');
  await expect(page.locator('[data-settings-sections] > details').nth(1)).toHaveAttribute('id', 'google');
  await expect(page.locator('details#google')).toHaveAttribute('open', '');
  await expect(page.locator('details#youtube')).not.toHaveAttribute('open', '');
  await expect(page.locator('.is-mine')).toHaveCount(2);
  for (const rel of await page.locator('.settings-app a[target="_blank"]').evaluateAll((as) => as.map((a) => a.getAttribute('rel')))) {
    expect(rel).toContain('noreferrer');
  }
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('why it matters: real cases with sources and a way to act', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Standortdaten aus Apps wurden verkauft/ }).click();
  await expect(page).toHaveURL(/\/warum\/#databroker-files$/);
  const cases = page.locator('.case');
  expect(await cases.count()).toBeGreaterThanOrEqual(5);
  const first = cases.first();
  await expect(first).toContainText('Was das für dich heißt');
  await first.getByText('Woher wissen wir das?').click();
  await expect(first.locator('.evidence a').first()).toHaveAttribute('rel', /noreferrer/);
  await expect(page.locator('.case-action a').first()).toHaveAttribute('href', /^\/anleitungen\//);
});

test('language switch: same page, same selection, English throughout, nothing stored', async ({ page }) => {
  // an older link with a selection on a page without its own selection logic
  await page.goto('/dienste/google/#d=google,whatsapp');
  await expect(page).toHaveURL(/\/dienste\/google\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  const toEn = page.locator('header a.lang-switch');
  await expect(toEn).toHaveAttribute('href', '/en/apps/google/');
  await toEn.click();
  await expect(page).toHaveURL(/\/en\/apps\/google\/$/);
  await page.locator('.trust-panel summary').click();
  await expect(page.locator('.trust-pop')).toContainText('Google, WhatsApp');
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Google');
  await expect(page.getByRole('navigation', { name: 'You are here' })).toBeVisible();
  await expect(page.locator('header a.lang-switch')).toHaveAttribute('href', '/dienste/google/');
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', /\/dienste\/google\/$/);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('English first use: wizard to a setting, links stay in English', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Step 1 of 4')).toBeVisible();
  await page.locator('.app-tile').filter({ hasText: /^Google/ }).click();
  await page.getByRole('button', { name: /Next/ }).click();
  await expect(page.locator('#wiz-h')).toContainText('Google');
  await page.getByRole('button', { name: /^Next$/ }).click();
  await page.getByRole('button', { name: /What can I do/ }).click();
  const links = await page.locator('.wiz a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(links.length).toBeGreaterThan(0);
  for (const l of links) expect(l, l ?? '').toMatch(/^\/en\//);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('step 4 says where it works, shows unchecked steps as such, and opens the steps when there is no direct link', async ({ page }) => {
  // Facebook's first change is not yet checked against the official help (EU differs).
  await page.goto('/#d=facebook');
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  const card = page.locator('.act-card');
  await expect(card.locator('.act-where')).toContainText('Wo das geht:');
  await expect(card.locator('.act-unverified')).toContainText('noch nicht an der offiziellen Hilfe nachgeprüft');

  // WhatsApp's change has checked steps but no direct link: the steps are open.
  await page.goto('about:blank');
  await page.goto('/#d=whatsapp');
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.getByRole('button', { name: 'Was kann ich tun?' }).click();
  await expect(page.locator('.act-card .act-unverified')).toHaveCount(0);
  await expect(page.locator('.act-card a[target="_blank"]')).toHaveCount(0);
  await expect(page.locator('.wiz-steps')).toHaveAttribute('open', '');
  await expect(page.locator('.wiz-steps .steps li').first()).toBeVisible();
});

test('the progress names all four steps and marks the current one', async ({ page }) => {
  await page.goto('/#d=google');
  const names = page.locator('.wiz-progress-name');
  await expect(names).toHaveText(['Apps', 'Was sie erfahren', 'Ein Fakt', 'Ändern']);
  await expect(page.locator('.wiz-progress .is-current')).toHaveText('Was sie erfahren');
  await expect(page.locator('#wiz-count')).toHaveText('Schritt 2 von 4: Was sie erfahren');
});
