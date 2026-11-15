// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://durchblick.example',
  trailingSlash: 'always',
  integrations: [preact()],
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'never' },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      // Astro adds script-src and style-src with hashes. Everything else is
      // locked to this site, so even a compromised bundled script could not
      // send data elsewhere (fetch, beacon, image, font, worker). Directives a
      // <meta> cannot carry (frame-ancestors …) are in public/_headers.
      directives: [
        "default-src 'self'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "worker-src 'self'",
        "manifest-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },
  vite: { resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } } },
});
