/*
 * Durchblick service worker — offline support only.
 * - Handles same-origin GET requests exclusively; never touches other origins.
 * - Stores only this site's own public files. No personal data, no analytics,
 *   no background sync, no push.
 */
// Bump on every change: activating a new version deletes all older caches
// (v4 removed entries stored with a #d=… fragment; v5 removes visited pages).
const VERSION = 'v5';
const CACHE = `durchblick-${VERSION}`;
const CORE = ['/', '/check/', '/plan/', '/einstellungen/', '/spuren/', '/dienste/', '/transparenz/', '/en/', '/en/plan/', '/en/settings/', '/manifest.webmanifest', '/icons/icon.svg'];

/**
 * Cache key without the fragment. Fetch keeps the fragment in request.url,
 * and the app selection lives there (#d=…) – it must never end up in Cache
 * Storage, which would persist it without consent.
 */
const keyOf = (url) => `${url.origin}${url.pathname}${url.search}`;
/** Offline fallback in the language of the requested page. */
const homeOf = (url) => (url.pathname.startsWith('/en/') ? '/en/' : '/');

/**
 * The build files (styles, scripts, fonts) have hashed names that this file
 * cannot know. They are read from the core pages themselves, so the pages also
 * work offline when they were never opened online after installation.
 */
async function precache() {
  const c = await caches.open(CACHE);
  // Required: if the core pages cannot be fetched, installation fails and the
  // previous version (with its offline copies) stays in charge. Fresh from the
  // network, not from the HTTP cache, so pages and asset names match.
  await c.addAll(CORE.map((p) => new Request(p, { cache: 'reload' })));
  try {
    await precacheAssets(c);
  } catch {
    /* Build files are a bonus: they are also cached when first used. */
  }
}

async function precacheAssets(c) {
  const assets = new Set();
  for (const page of CORE.filter((p) => p.endsWith('/'))) {
    const res = await c.match(page);
    const html = res ? await res.text() : '';
    for (const m of html.matchAll(/["'(](\/_astro\/[^"'()\s]+)/g)) assets.add(m[1]);
  }
  // Island scripts import shared chunks ("./hooks.module.js") that the pages do not list.
  const scanned = new Set();
  let pending = [...assets].filter((a) => a.endsWith('.js'));
  while (pending.length) {
    const next = [];
    for (const js of pending) {
      scanned.add(js);
      const res = await fetch(js);
      const text = res.ok ? await res.text() : '';
      for (const m of text.matchAll(/["']\.\/([\w.-]+\.js)["']/g)) {
        const chunk = `/_astro/${m[1]}`;
        assets.add(chunk);
        if (!scanned.has(chunk)) next.push(chunk);
      }
    }
    pending = [...new Set(next)].filter((js) => !scanned.has(js));
  }
  await c.addAll([...assets]);
  // Fonts are referenced from the stylesheets. Only the Latin subsets: the
  // site is German and English, other alphabets would only waste space.
  const fonts = new Set();
  for (const css of [...assets].filter((a) => a.endsWith('.css'))) {
    const res = await c.match(css);
    const text = res ? await res.text() : '';
    for (const m of text.matchAll(/url\((\/_astro\/[^)\s]*latin[^)\s]*\.woff2)\)/g)) fonts.add(m[1]);
  }
  await c.addAll([...fonts]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('durchblick-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Hashed build assets never change: cache first.
  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(keyOf(url), copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Pages and other files: network first, fall back to cache when offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        // Only the fixed core pages are refreshed in the cache – never other
        // visited pages: the cache must not tell which apps someone looked at.
        if (res.ok && (CORE.includes(url.pathname) || url.pathname.endsWith('.woff2'))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(keyOf(url), copy));
        }
        return res;
      })
      .catch(() => caches.match(keyOf(url)).then((hit) => hit || caches.match(homeOf(url)))),
  );
});
