// Turns dist/ into a test build that search engines ignore: noindex on every
// page, a robots.txt that disallows everything and an X-Robots-Tag header for
// hosts that read _headers (Cloudflare Pages, Netlify). Run after `astro build`
// (npm run build:test).
import { appendFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist';
const META = '<meta name="robots" content="noindex, nofollow">';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])),
  );
  return nested.flat();
}

let marked = 0;
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  if (html.includes(META)) continue;
  const next = html.replace(/<meta charset="utf-8"\s*\/?>/i, (m) => `${m}${META}`);
  if (next === html) throw new Error(`${file}: no <meta charset> to anchor the noindex tag`);
  await writeFile(file, next);
  marked++;
}
await writeFile(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await appendFile(join(root, '_headers'), '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log(`test build: noindex on ${marked} pages, robots.txt disallows all`);
