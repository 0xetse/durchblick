// Minimal foreground static server for dist/ – used by the E2E tests.
// Why not `astro preview`: outside a terminal it detaches into the background
// and silently moves to another port if 4321 is busy, so Playwright could test
// the wrong build. This server stays in the foreground and fails if the port
// is taken. No dependencies, serves only files inside dist/.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT ?? 4321);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Applies dist/_headers like Netlify, Cloudflare Pages and other static hosts do,
 * so the browser tests run with the same header CSP as the deployed site.
 * Supports what the file uses: "/*", "/prefix/*" and exact paths.
 */
async function headerRules() {
  let text = '';
  try {
    text = await readFile(join(root, '_headers'), 'utf8');
  } catch {
    return [];
  }
  const rules = [];
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: [] });
    else if (rules.length) {
      const i = line.indexOf(':');
      rules.at(-1).headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}
const rules = await headerRules();
const matches = (pattern, path) => (pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern);
// Test-only escape hatch, used for Playwright's Firefox (see playwright.config.ts).
const omit = new Set((process.env.SERVE_OMIT_HEADERS ?? '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean));
const headersFor = (path) =>
  Object.fromEntries(rules.filter((r) => matches(r.pattern, path)).flatMap((r) => r.headers).filter(([k]) => !omit.has(k.toLowerCase())));

async function file(path) {
  const full = normalize(join(root, path));
  if (full !== root && !full.startsWith(root + sep)) return null;
  try {
    const s = await stat(full);
    if (s.isDirectory()) return file(join(path, 'index.html'));
    return { full, body: await readFile(full) };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }
  const hit = await file(path);
  if (hit) {
    res.writeHead(200, { ...headersFor(path), 'content-type': types[extname(hit.full)] ?? 'application/octet-stream' });
    res.end(hit.body);
    return;
  }
  const notFound = await file('/404.html');
  res.writeHead(404, { ...headersFor(path), 'content-type': types['.html'] });
  res.end(notFound?.body ?? 'Not found');
})
  .on('error', (e) => {
    console.error(`serve-dist: ${e.message}`);
    process.exit(1);
  })
  .listen(port, 'localhost', () => console.log(`serve-dist: http://localhost:${port}`));
