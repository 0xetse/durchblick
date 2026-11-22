// Checks that keep the test and the production build apart.
//
//   inspectDist()     – a built dist/ before it is packaged (offline)
//   packageDist()     – inspect, zip into a temporary file, verify the zip,
//                       and only then move it to its final, unique name
//   validateTarget()  – accepts only a public https origin given by the user
//   checkDeployment() – a live deployment of that origin
//
// "test" means: noindex on every page, robots.txt disallows everything and
// X-Robots-Tag: noindex. "prod" means: none of that. Every check fails when a
// build of the other kind is found, so a test build can never pass as a
// production build and vice versa. The build commit must match exactly.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { isIP } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const TARGETS = /** @type {const} */ (['test', 'prod']);
export const NOINDEX_META = '<meta name="robots" content="noindex, nofollow">';
export const COMMIT_LENGTH = 12;

/** Files every deployment must contain. */
export const REQUIRED_FILES = [
  'index.html',
  '404.html',
  'robots.txt',
  '_headers',
  'sw.js',
  'manifest.webmanifest',
  '.well-known/security.txt',
  'en/index.html',
  'transparenz/index.html',
  'en/transparency/index.html',
  'datenschutz/index.html',
  'impressum/index.html',
];

/** Everything a build may contain; anything else is unexpected. */
const ALLOWED_FILES = [
  /^(index|404)\.html$/,
  /^[a-z0-9-]+(\/[a-z0-9-]+)*\/index\.html$/,
  /^_astro\/[A-Za-z0-9._-]+\.(js|css|woff2?)$/,
  /^icons\/[a-z0-9-]+\.(png|svg)$/,
  /^licenses\/[A-Za-z0-9._-]+\.txt$/,
  /^(robots\.txt|_headers|sw\.js|manifest\.webmanifest)$/,
  /^\.well-known\/security\.txt$/,
];

/** Security headers every page response (and the /* rule in _headers) must carry. */
export const SECURITY_HEADERS = {
  'content-security-policy': (v) =>
    /frame-ancestors 'none'/.test(v) && /connect-src 'self'/.test(v) && !/unsafe-inline|unsafe-eval/.test(v),
  'strict-transport-security': (v) => /^max-age=(\d+)(;|$)/.test(v) && Number(/max-age=(\d+)/.exec(v)[1]) >= 31_536_000,
  'x-content-type-options': (v) => v === 'nosniff',
  'x-frame-options': (v) => v === 'DENY',
  'referrer-policy': (v) => v === 'no-referrer',
  'permissions-policy': (v) => /camera=\(\)/.test(v) && /geolocation=\(\)/.test(v) && /microphone=\(\)/.test(v),
  'cross-origin-opener-policy': (v) => v === 'same-origin',
  'cross-origin-resource-policy': (v) => v === 'same-origin',
};

const ROBOTS_META = /<meta\b[^>]*\bname\s*=\s*["']?(?:robots|googlebot)["']?[^>]*>/gi;
const BLOCKS_INDEX = /noindex|none/i;
const DISALLOW_ALL = /^\s*Disallow:\s*\/\s*$/im;

/** A commit id shortened to 12 lowercase hex characters, or null. */
export function normalizeCommit(value) {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  return /^[0-9a-f]{12,64}$/.test(v) ? v.slice(0, COMMIT_LENGTH) : null;
}

function assertOptions(expect, commit) {
  if (!TARGETS.includes(expect)) throw new Error(`--expect must be "test" or "prod", not ${JSON.stringify(expect)}`);
  const c = normalizeCommit(commit);
  if (!c) throw new Error(`--commit must be a commit id (12–64 hex characters), not ${JSON.stringify(commit)}`);
  return c;
}

/** Build state as rendered on the transparency page. */
export function readBuildState(html) {
  const state = /data-build-state="([a-z]*)"/.exec(html)?.[1] ?? null;
  const commit = /data-build-commit="([0-9a-f]*)"/.exec(html)?.[1] ?? null;
  return { state, commit };
}

/** Problems of the robots meta tags of one page for the expected kind of build. */
export function robotsMetaProblems(html, expect) {
  const head = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? '';
  const tags = html.match(ROBOTS_META) ?? [];
  if (expect === 'test') {
    if (tags.length !== 1 || !head.includes(NOINDEX_META)) return ['test page without exactly one noindex, nofollow tag in <head>'];
    return [];
  }
  return tags.some((t) => BLOCKS_INDEX.test(t)) ? ['production page carries a noindex robots tag'] : [];
}

/** Problems of robots.txt for the expected kind of build. */
export function robotsTxtProblems(text, expect) {
  if (expect === 'test') {
    return /^\s*User-agent:\s*\*\s*$/im.test(text) && DISALLOW_ALL.test(text) ? [] : ['test robots.txt does not disallow everything'];
  }
  return DISALLOW_ALL.test(text) ? ['production robots.txt disallows everything'] : [];
}

/** Problems of an X-Robots-Tag value (null = header absent). */
export function xRobotsProblems(value, expect) {
  if (expect === 'test') return value && /noindex/i.test(value) ? [] : ['test deployment without X-Robots-Tag: noindex'];
  return value && BLOCKS_INDEX.test(value) ? ['production deployment sends X-Robots-Tag with noindex'] : [];
}

/**
 * Parses a Netlify-style _headers file into { path: { header: [values] } }.
 * @param {string} text
 * @returns {Record<string, Record<string, string[]>>}
 */
export function parseHeadersFile(text) {
  /** @type {Record<string, Record<string, string[]>>} */
  const rules = {};
  let current = null;
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = line.trim();
      rules[current] ??= {};
    } else if (current) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const name = line.slice(0, i).trim().toLowerCase();
      (rules[current][name] ??= []).push(line.slice(i + 1).trim());
    }
  }
  return rules;
}

/** Problems of a set of security headers ({ name: value|null }). A duplicated header with differing values is a conflict. */
export function securityHeaderProblems(get, where) {
  const problems = [];
  for (const [name, ok] of Object.entries(SECURITY_HEADERS)) {
    const value = get(name);
    if (value === null || value === undefined) problems.push(`${where}: missing ${name}`);
    else if (!ok(value)) problems.push(`${where}: unexpected or conflicting ${name}: ${value}`);
  }
  return problems;
}

function listFiles(root) {
  const out = [];
  const problems = [];
  const walk = (dir, rel) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isSymbolicLink()) problems.push(`symbolic link: ${r}`);
      else if (e.isDirectory()) walk(join(dir, e.name), r);
      else if (e.isFile()) out.push(r);
      else problems.push(`not a regular file: ${r}`);
    }
  };
  walk(root, '');
  return { files: out.sort(), problems };
}

/**
 * Checks a built dist/ for the expected kind of build and commit.
 * @param {string} root
 * @param {{ expect: 'test'|'prod', commit: string, localIdentifiers?: string[] }} options
 */
export function inspectDist(root, { expect, commit, localIdentifiers = [] }) {
  const wanted = assertOptions(expect, commit);
  if (!existsSync(root) || !lstatSync(root).isDirectory()) return { problems: [`${root} is not a directory`], files: [] };
  const { files, problems } = listFiles(root);
  const read = (f) => readFileSync(join(root, f), 'utf8');

  for (const f of files) if (!ALLOWED_FILES.some((re) => re.test(f))) problems.push(`unexpected file: ${f}`);
  for (const f of REQUIRED_FILES) if (!files.includes(f)) problems.push(`missing file: ${f}`);

  // Build commit: both transparency pages, clean and exactly the expected commit.
  for (const f of ['transparenz/index.html', 'en/transparency/index.html'].filter((x) => files.includes(x))) {
    const b = readBuildState(read(f));
    if (b.state !== 'clean') problems.push(`${f}: build state is ${JSON.stringify(b.state)}, expected "clean"`);
    if (b.commit !== wanted) problems.push(`${f}: build commit ${JSON.stringify(b.commit)} does not match ${wanted}`);
  }

  // Indexing rules and the CSP meta tag on every page; internal links must resolve.
  const html = files.filter((f) => f.endsWith('.html'));
  for (const f of html) {
    const text = read(f);
    for (const p of robotsMetaProblems(text, expect)) problems.push(`${f}: ${p}`);
    const csp = /<meta http-equiv="content-security-policy" content="([^"]*)"/i.exec(text)?.[1];
    if (!csp || !/script-src/.test(csp) || /unsafe-inline|unsafe-eval/.test(csp)) problems.push(`${f}: missing or weak CSP meta tag`);
    for (const m of text.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = decodeURI(m[1]).replace(/^\//, '');
      const path = target === '' || target.endsWith('/') ? `${target}index.html` : target;
      if (!files.includes(path)) problems.push(`${f}: link to missing ${m[1]}`);
    }
  }

  if (files.includes('robots.txt')) for (const p of robotsTxtProblems(read('robots.txt'), expect)) problems.push(p);

  if (files.includes('_headers')) {
    const rules = parseHeadersFile(read('_headers'));
    const all = rules['/*'] ?? {};
    problems.push(...securityHeaderProblems((n) => (all[n] ? all[n].join(', ') : null), '_headers /*'));
    const robotsValues = Object.values(rules).flatMap((r) => r['x-robots-tag'] ?? []);
    if (expect === 'test') {
      if (!(all['x-robots-tag'] ?? []).some((v) => /noindex/i.test(v))) problems.push('_headers: test build without X-Robots-Tag: noindex for /*');
    } else if (robotsValues.some((v) => BLOCKS_INDEX.test(v))) {
      problems.push('_headers: production build carries X-Robots-Tag: noindex');
    }
    if (!(rules['/sw.js']?.['cache-control'] ?? []).some((v) => /no-cache/.test(v))) problems.push('_headers: /sw.js without Cache-Control: no-cache');
  }

  // Nothing from this machine.
  const needles = ['/Users/', '/home/', 'C:\\Users\\', ...localIdentifiers.filter((s) => s && s.length >= 4)];
  for (const f of files.filter((x) => /\.(html|js|css|txt|webmanifest|svg)$|^_headers$/.test(x))) {
    const text = read(f).toLowerCase();
    for (const n of needles) if (text.includes(n.toLowerCase())) problems.push(`${f}: contains a local path or identifier`);
  }

  return { problems, files };
}

/** File name of a deployment package. */
export function packageName(expect, commit) {
  const c = assertOptions(expect, commit);
  return `durchblick-${expect === 'test' ? 'TEST' : 'PRODUKTION'}-${c}.zip`;
}

/**
 * Inspects dist/, zips it into a temporary file, verifies the zip against
 * dist/ (file list, integrity, every byte) and only then moves it to
 * <outDir>/<packageName>. Never overwrites an existing file.
 * @returns {{ file: string, sha256: string, files: number }}
 */
export function packageDist({ dist, outDir, expect, commit, localIdentifiers = [] }) {
  const name = packageName(expect, commit);
  const target = join(outDir, name);
  if (existsSync(target)) throw new Error(`${target} already exists – not overwritten`);
  const { problems, files } = inspectDist(dist, { expect, commit, localIdentifiers });
  if (problems.length) {
    const error = new Error(`dist/ is not a valid ${expect} build of ${normalizeCommit(commit)}:\n  ${problems.slice(0, 30).join('\n  ')}`);
    error.problems = problems;
    throw error;
  }
  if (!existsSync(outDir) || !lstatSync(outDir).isDirectory()) throw new Error(`${outDir} is not a directory`);

  const work = mkdtempSync(join(tmpdir(), 'durchblick-package-'));
  try {
    const tmpZip = join(work, name);
    // -r recurse, -X no extra file attributes, -D no directory entries, -q quiet.
    execFileSync('zip', ['-r', '-X', '-D', '-q', '-9', tmpZip, '.'], { cwd: dist, stdio: ['ignore', 'ignore', 'pipe'] });
    execFileSync('unzip', ['-tq', tmpZip], { stdio: ['ignore', 'ignore', 'pipe'] });
    const listed = execFileSync('unzip', ['-Z1', tmpZip], { encoding: 'utf8' }).split('\n').filter(Boolean).sort();
    if (JSON.stringify(listed) !== JSON.stringify(files)) throw new Error('zip file list differs from dist/');
    const extracted = join(work, 'check');
    execFileSync('unzip', ['-q', tmpZip, '-d', extracted], { stdio: ['ignore', 'ignore', 'pipe'] });
    for (const f of files) {
      if (!readFileSync(join(extracted, f)).equals(readFileSync(join(dist, f)))) throw new Error(`zip content differs from dist/: ${f}`);
    }
    if (existsSync(target)) throw new Error(`${target} already exists – not overwritten`);
    renameSync(tmpZip, target);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  return { file: target, sha256: createHash('sha256').update(readFileSync(target)).digest('hex'), files: files.length };
}

// ------------------------------------------------------------------ network

const BLOCKED_NAMES = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|home\.arpa)$/i;

/** Loopback, private, link-local, shared, reserved or multicast address. */
export function isNonPublicAddress(address) {
  const v = isIP(address);
  if (v === 4) {
    const [a, b] = address.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && address.startsWith('192.0.0.')) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  if (v === 6) {
    const x = address.toLowerCase().replace(/^\[|\]$/g, '');
    // IPv4-mapped addresses, dotted (::ffff:10.0.0.1) or as URL normalises them (::ffff:a00:1).
    const dotted = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(x);
    if (dotted) return isNonPublicAddress(dotted[1]);
    const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(x);
    if (hex) {
      const [hi, lo] = [parseInt(hex[1], 16), parseInt(hex[2], 16)];
      return isNonPublicAddress(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
    }
    // Loopback, unspecified, unique local, link-local, multicast; IPv4-compatible
    // (::a.b.c.d) and NAT64 (64:ff9b::/96) are rejected as well rather than decoded.
    return x === '::' || x === '::1' || /^f[cd]/.test(x) || /^fe[89ab]/.test(x) || /^ff/.test(x) || /^::[0-9a-f]/.test(x) || /^64:ff9b:/.test(x);
  }
  return true;
}

/**
 * Accepts only the origin of a public https URL given by the user – nothing
 * internal, no credentials, no path. allowLocal (tests only, not reachable
 * from the command line) permits http on the loopback address.
 * @param {unknown} input
 * @param {{ allowLocal?: boolean, resolve?: (host: string) => Promise<Array<{ address: string }>> }} [options]
 * @returns {Promise<URL>} the origin as a URL
 */
export async function validateTarget(input, { allowLocal = false, resolve = (h) => lookup(h, { all: true }) } = {}) {
  let url;
  try {
    url = new URL(String(input));
  } catch {
    throw new Error(`not a valid URL: ${JSON.stringify(input)}`);
  }
  if (url.username || url.password) throw new Error('URLs with credentials are not accepted');
  if (url.pathname !== '/' || url.search || url.hash) throw new Error('give only the origin, e.g. https://example.org/');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (allowLocal) {
    if (url.protocol !== 'http:' || !['127.0.0.1', '::1'].includes(host)) throw new Error('allowLocal accepts only http on the loopback address');
    return new URL(url.origin);
  }
  if (url.protocol !== 'https:') throw new Error('only https URLs are checked');
  if (isIP(host)) {
    if (isNonPublicAddress(host)) throw new Error(`not a public address: ${host}`);
  } else {
    if (!host.includes('.') || BLOCKED_NAMES.test(host)) throw new Error(`not a public host name: ${host}`);
    let addresses;
    try {
      addresses = await resolve(host);
    } catch {
      throw new Error(`host name does not resolve: ${host}`);
    }
    if (!addresses.length || addresses.some((a) => isNonPublicAddress(a.address))) throw new Error(`${host} resolves to a non-public address`);
  }
  return new URL(url.origin);
}

const PAGES = ['/', '/en/', '/transparenz/', '/en/transparency/', '/datenschutz/', '/impressum/'];
const MAX_BODY = 5 * 1024 * 1024;

/**
 * Checks a live deployment. Requests go only to the given origin (and, for
 * https, once to http:// of the same host to check the upgrade); redirects
 * are never followed.
 * @param {string} input deployment origin
 * @param {{ expect: 'test'|'prod', commit: string, allowLocal?: boolean, fetchImpl?: typeof fetch, resolve?: (host: string) => Promise<Array<{ address: string }>>, timeoutMs?: number }} options
 */
export async function checkDeployment(input, { expect, commit, allowLocal = false, fetchImpl, resolve, timeoutMs = 15_000 }) {
  const wanted = assertOptions(expect, commit);
  const origin = await validateTarget(input, { allowLocal, resolve });
  // eslint-disable-next-line no-restricted-globals -- deliberate: deployment check script, never part of the app bundle
  const doFetch = fetchImpl ?? fetch;
  const problems = [];
  const passed = [];
  const ok = (msg) => passed.push(msg);

  const get = async (path, base = origin) => {
    const url = new URL(path, base);
    if (url.host !== origin.host) throw new Error(`refusing to contact ${url.host}`);
    const res = await doFetch(url, { redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    const length = Number(res.headers.get('content-length') ?? 0);
    if (length > MAX_BODY) throw new Error(`${path}: response too large`);
    const body = Buffer.from(await res.arrayBuffer());
    if (body.length > MAX_BODY) throw new Error(`${path}: response too large`);
    return { status: res.status, headers: res.headers, text: body.toString('utf8') };
  };

  // HTTPS: http:// of the same host must redirect to https://.
  if (origin.protocol === 'https:') {
    const plain = new URL(origin.href);
    plain.protocol = 'http:';
    const r = await get('/', plain).catch((e) => ({ error: e }));
    const location = r.headers?.get('location');
    if (r.error) problems.push(`http://${origin.host}/: ${r.error.message}`);
    else if (![301, 302, 307, 308].includes(r.status) || !location || new URL(location, plain).href !== origin.href) {
      problems.push(`http://${origin.host}/ does not redirect to ${origin.href} (status ${r.status}, location ${location})`);
    } else ok(`http → https (${r.status})`);
  }

  for (const path of PAGES) {
    let r;
    try {
      r = await get(path);
    } catch (e) {
      problems.push(`${path}: ${e.message}`);
      continue;
    }
    if (r.status !== 200) {
      problems.push(`${path}: HTTP ${r.status}${r.headers.get('location') ? ` → ${r.headers.get('location')}` : ''}`);
      continue;
    }
    if (!/^text\/html/.test(r.headers.get('content-type') ?? '')) problems.push(`${path}: not served as text/html`);
    problems.push(...securityHeaderProblems((n) => r.headers.get(n), path));
    for (const p of xRobotsProblems(r.headers.get('x-robots-tag'), expect)) problems.push(`${path}: ${p}`);
    for (const p of robotsMetaProblems(r.text, expect)) problems.push(`${path}: ${p}`);
    if (path === '/transparenz/' || path === '/en/transparency/') {
      const b = readBuildState(r.text);
      if (b.state !== 'clean') problems.push(`${path}: build state is ${JSON.stringify(b.state)}, expected "clean"`);
      if (b.commit !== wanted) problems.push(`${path}: build commit ${JSON.stringify(b.commit)} does not match ${wanted}`);
      else if (b.state === 'clean') ok(`${path}: build ${b.commit}`);
    }
    ok(`${path}: 200`);
  }

  const files = [
    ['/robots.txt', (r) => robotsTxtProblems(r.text, expect)],
    ['/sw.js', (r) => (/no-cache/.test(r.headers.get('cache-control') ?? '') ? [] : ['without Cache-Control: no-cache'])],
    ['/manifest.webmanifest', () => []],
    ['/.well-known/security.txt', (r) => (/^Contact:/m.test(r.text) ? [] : ['without Contact'])],
  ];
  for (const [path, check] of files) {
    try {
      const r = await get(path);
      if (r.status !== 200) problems.push(`${path}: HTTP ${r.status}`);
      else {
        const p = check(r);
        problems.push(...p.map((x) => `${path}: ${x}`));
        if (!p.length) ok(`${path}: 200`);
      }
    } catch (e) {
      problems.push(`${path}: ${e.message}`);
    }
  }

  // Redirect for a missing trailing slash stays on this origin; unknown pages answer 404.
  try {
    const r = await get('/plan');
    const location = r.headers.get('location');
    const to = location ? new URL(location, origin) : null;
    if (![301, 302, 307, 308].includes(r.status) || !to || to.origin !== origin.origin || to.pathname !== '/plan/') {
      problems.push(`/plan: expected a redirect to /plan/ on this origin (status ${r.status}, location ${location})`);
    } else ok(`/plan → /plan/ (${r.status})`);
    const missing = await get('/__durchblick-deploy-check-404/');
    if (missing.status !== 404) problems.push(`unknown page: HTTP ${missing.status}, expected 404`);
    else ok('unknown page: 404');
  } catch (e) {
    problems.push(e.message);
  }

  return { origin: origin.href, problems, passed };
}
