import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  NOINDEX_META,
  checkDeployment,
  inspectDist,
  isNonPublicAddress,
  packageDist,
  packageName,
  parseHeadersFile,
  validateTarget,
} from '../../scripts/lib/deploy-checks.mjs';

type Kind = 'test' | 'prod';
type Files = Record<string, string>;

const COMMIT = '0fea7d46c1bc9ee5468d9f5a8905c116e27fa5f2';
const C12 = COMMIT.slice(0, 12);
const OTHER = '000950f4b540e7c2ef9ea97abf463a1858512698';

const CSP_META = `<meta http-equiv="content-security-policy" content="default-src 'self'; script-src 'self' 'sha256-abc'">`;
const page = (kind: Kind, body = '') =>
  `<!doctype html><html lang="de"><head><meta charset="utf-8">${kind === 'test' ? NOINDEX_META : ''}${CSP_META}<title>t</title></head><body><a href="/">Start</a><a href="/en/">EN</a>${body}</body></html>`;
const transparency = (kind: Kind, state = 'clean', commit = C12) =>
  page(kind, `<dl data-build-state="${state}"><dd data-build-version>0.5.1</dd><dd><code data-build-commit="${commit}">${commit}</code></dd></dl>`);
const SECURITY = [
  '/*',
  '  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: no-referrer',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '  Cross-Origin-Opener-Policy: same-origin',
  '  Cross-Origin-Resource-Policy: same-origin',
  "  Content-Security-Policy: connect-src 'self'; frame-ancestors 'none'; object-src 'none'",
  '  X-Frame-Options: DENY',
  '',
  '/_astro/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/sw.js',
  '  Cache-Control: no-cache',
  '',
].join('\n');

function files(kind: Kind): Files {
  return {
    'index.html': page(kind),
    '404.html': page(kind),
    'en/index.html': page(kind),
    'plan/index.html': page(kind),
    'transparenz/index.html': transparency(kind),
    'en/transparency/index.html': transparency(kind),
    'datenschutz/index.html': page(kind),
    'impressum/index.html': page(kind),
    'robots.txt': kind === 'test' ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n',
    _headers: kind === 'test' ? `${SECURITY}\n/*\n  X-Robots-Tag: noindex, nofollow\n` : SECURITY,
    'sw.js': 'self.addEventListener("fetch", () => {});\n',
    'manifest.webmanifest': '{"name":"Durchblick"}\n',
    '.well-known/security.txt': 'Contact: https://github.com/0xetse/durchblick/security/advisories/new\n',
    '_astro/app.abc123.js': 'export {};\n',
  };
}

const temp: string[] = [];
function tempDir(prefix: string) {
  const d = mkdtempSync(join(tmpdir(), prefix));
  temp.push(d);
  return d;
}
function writeDist(content: Files) {
  const dir = tempDir('deploy-dist-');
  for (const [f, text] of Object.entries(content)) {
    mkdirSync(dirname(join(dir, f)), { recursive: true });
    writeFileSync(join(dir, f), text);
  }
  return dir;
}
const dist = (kind: Kind, edit?: (f: Files) => void) => {
  const f = files(kind);
  edit?.(f);
  return writeDist(f);
};
afterAll(() => {
  for (const d of temp) rmSync(d, { recursive: true, force: true });
});

// ------------------------------------------------------------------ offline

describe('deploy: inspecting dist/', () => {
  it('accepts a correct test build and a correct production build', () => {
    expect(inspectDist(dist('test'), { expect: 'test', commit: COMMIT }).problems).toEqual([]);
    expect(inspectDist(dist('prod'), { expect: 'prod', commit: COMMIT }).problems).toEqual([]);
  });

  it('never accepts a test build as production or the other way round', () => {
    const asProd = inspectDist(dist('test'), { expect: 'prod', commit: COMMIT }).problems.join('\n');
    expect(asProd).toMatch(/production page carries a noindex/);
    expect(asProd).toMatch(/production robots.txt disallows everything/);
    expect(asProd).toMatch(/production build carries X-Robots-Tag/);
    const asTest = inspectDist(dist('prod'), { expect: 'test', commit: COMMIT }).problems.join('\n');
    expect(asTest).toMatch(/test page without exactly one noindex/);
    expect(asTest).toMatch(/test robots.txt does not disallow/);
    expect(asTest).toMatch(/test build without X-Robots-Tag/);
  });

  it('finds a single test page without noindex', () => {
    const d = dist('test', (f) => (f['impressum/index.html'] = page('prod')));
    expect(inspectDist(d, { expect: 'test', commit: COMMIT }).problems).toEqual(['impressum/index.html: test page without exactly one noindex, nofollow tag in <head>']);
  });

  it('finds an unexpected noindex in a production build, also written differently', () => {
    const d = dist('prod', (f) => (f['plan/index.html'] = page('prod').replace('<title>', `<meta content="NOINDEX" name='robots'><title>`)));
    expect(inspectDist(d, { expect: 'prod', commit: COMMIT }).problems).toEqual(['plan/index.html: production page carries a noindex robots tag']);
    const h = dist('prod', (f) => (f._headers = `${SECURITY}\n/en/*\n  X-Robots-Tag: none\n`));
    expect(inspectDist(h, { expect: 'prod', commit: COMMIT }).problems).toEqual(['_headers: production build carries X-Robots-Tag: noindex']);
  });

  it('checks the build commit exactly, on both transparency pages', () => {
    const d = dist('test');
    expect(inspectDist(d, { expect: 'test', commit: OTHER }).problems).toEqual([
      `transparenz/index.html: build commit "${C12}" does not match 000950f4b540`,
      `en/transparency/index.html: build commit "${C12}" does not match 000950f4b540`,
    ]);
    const en = dist('test', (f) => (f['en/transparency/index.html'] = transparency('test', 'clean', OTHER.slice(0, 12))));
    expect(inspectDist(en, { expect: 'test', commit: COMMIT }).problems).toHaveLength(1);
  });

  it('rejects modified and unknown builds', () => {
    const modified = dist('test', (f) => (f['transparenz/index.html'] = transparency('test', 'modified')));
    expect(inspectDist(modified, { expect: 'test', commit: COMMIT }).problems.join()).toMatch(/build state is "modified"/);
    const unknown = dist('prod', (f) => (f['transparenz/index.html'] = transparency('prod', 'unknown', '')));
    expect(inspectDist(unknown, { expect: 'prod', commit: COMMIT }).problems.join()).toMatch(/"unknown".*\n?.*|build commit "" does not match/);
  });

  it.each([['.env'], ['_astro/app.abc123.js.map'], ['.DS_Store'], ['src/secret.ts'], ['notes.md'], ['node_modules/x/index.js'], ['.git/config']])(
    'rejects an unexpected file: %s',
    (name) => {
      const d = dist('prod', (f) => (f[name] = 'x'));
      expect(inspectDist(d, { expect: 'prod', commit: COMMIT }).problems).toContain(`unexpected file: ${name}`);
    },
  );

  it('rejects missing files, missing security headers, broken links and local paths', () => {
    const missing = dist('prod', (f) => delete f['impressum/index.html']);
    expect(inspectDist(missing, { expect: 'prod', commit: COMMIT }).problems).toContain('missing file: impressum/index.html');
    const headers = dist('prod', (f) => (f._headers = SECURITY.replace('  X-Frame-Options: DENY\n', '')));
    expect(inspectDist(headers, { expect: 'prod', commit: COMMIT }).problems).toEqual(['_headers /*: missing x-frame-options']);
    const link = dist('prod', (f) => (f['index.html'] = page('prod', '<a href="/gibt-es-nicht/">x</a>')));
    expect(inspectDist(link, { expect: 'prod', commit: COMMIT }).problems).toEqual(['index.html: link to missing /gibt-es-nicht/']);
    const local = dist('prod', (f) => (f['impressum/index.html'] = page('prod', '<p>/Users/someone/project</p>')));
    expect(inspectDist(local, { expect: 'prod', commit: COMMIT }).problems).toEqual(['impressum/index.html: contains a local path or identifier']);
    const host = dist('prod', (f) => (f['sw.js'] = '// built on build-box-7\n'));
    expect(inspectDist(host, { expect: 'prod', commit: COMMIT, localIdentifiers: ['build-box-7'] }).problems).toEqual(['sw.js: contains a local path or identifier']);
  });

  it('rejects invalid options', () => {
    expect(() => inspectDist(dist('prod'), { expect: 'staging' as Kind, commit: COMMIT })).toThrow(/--expect/);
    expect(() => inspectDist(dist('prod'), { expect: 'prod', commit: 'main' })).toThrow(/--commit/);
  });

  it('parses a _headers file', () => {
    expect(parseHeadersFile('/a\n  X: 1\n  x: 2\n# c\n/b\n  Y: z\n')).toEqual({ '/a': { x: ['1', '2'] }, '/b': { y: ['z'] } });
  });
});

describe('deploy: packaging', () => {
  const list = (zip: string) => execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).split('\n').filter(Boolean).sort();

  it('writes a uniquely named test zip with the files at the root', () => {
    const out = tempDir('deploy-out-');
    const src = dist('test');
    const r = packageDist({ dist: src, outDir: out, expect: 'test', commit: COMMIT });
    expect(r.file).toBe(join(out, `durchblick-TEST-${C12}.zip`));
    expect(r.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(list(r.file)).toEqual(Object.keys(files('test')).sort());
    expect(list(r.file).some((f) => f.startsWith('dist/'))).toBe(false);
  });

  it('names production packages PRODUKTION', () => {
    const out = tempDir('deploy-out-');
    const r = packageDist({ dist: dist('prod'), outDir: out, expect: 'prod', commit: COMMIT });
    expect(r.file.endsWith(`durchblick-PRODUKTION-${C12}.zip`)).toBe(true);
    expect(packageName('test', COMMIT)).toBe(`durchblick-TEST-${C12}.zip`);
  });

  it('writes no zip when the build is of the other kind or has unexpected files', () => {
    const out = tempDir('deploy-out-');
    expect(() => packageDist({ dist: dist('test'), outDir: out, expect: 'prod', commit: COMMIT })).toThrow(/not a valid prod build/);
    expect(() => packageDist({ dist: dist('prod'), outDir: out, expect: 'test', commit: COMMIT })).toThrow(/not a valid test build/);
    expect(() => packageDist({ dist: dist('prod', (f) => (f['.env'] = 'SECRET=1')), outDir: out, expect: 'prod', commit: COMMIT })).toThrow(/unexpected file: \.env/);
    expect(() => packageDist({ dist: dist('prod'), outDir: out, expect: 'prod', commit: OTHER })).toThrow(/does not match/);
    expect(readdirSync(out)).toEqual([]);
  });

  it('never overwrites an existing package', () => {
    const out = tempDir('deploy-out-');
    writeFileSync(join(out, `durchblick-PRODUKTION-${C12}.zip`), 'old');
    expect(() => packageDist({ dist: dist('prod'), outDir: out, expect: 'prod', commit: COMMIT })).toThrow(/already exists/);
  });
});

// ------------------------------------------------------------------ network

describe('deploy: target URL', () => {
  const publicDns = async () => [{ address: '203.0.113.10', family: 4 }];

  it('accepts only the origin of a public https URL', async () => {
    expect((await validateTarget('https://durchblick-test.statichost.page', { resolve: publicDns })).href).toBe('https://durchblick-test.statichost.page/');
  });

  it.each([
    'not a url',
    'ftp://example.org/',
    'http://example.org/',
    'https://user:secret@example.org/',
    'https://example.org/some/path',
    'https://example.org/?q=1',
    'https://example.org/#x',
    'https://localhost/',
    'https://app.localhost/',
    'https://127.0.0.1/',
    'https://10.0.0.1/',
    'https://172.16.5.4/',
    'https://192.168.1.10/',
    'https://169.254.169.254/',
    'https://100.64.0.1/',
    'https://[::1]/',
    'https://[fd00::1]/',
    'https://[fe80::1]/',
    'https://[::ffff:10.0.0.1]/',
    'https://printer.local/',
    'https://wiki.internal/',
    'https://intranet/',
  ])('rejects %s', async (input) => {
    await expect(validateTarget(input, { resolve: publicDns })).rejects.toThrow();
  });

  it('rejects a public-looking name that resolves to an internal address, or does not resolve', async () => {
    await expect(validateTarget('https://rebind.example.org/', { resolve: async () => [{ address: '203.0.113.10' }, { address: '10.0.0.5' }] })).rejects.toThrow(/non-public/);
    await expect(validateTarget('https://nx.example.org/', { resolve: async () => Promise.reject(new Error('ENOTFOUND')) })).rejects.toThrow(/does not resolve/);
  });

  it('allowLocal (tests only) permits nothing but http on the loopback address', async () => {
    expect((await validateTarget('http://127.0.0.1:8080/', { allowLocal: true })).href).toBe('http://127.0.0.1:8080/');
    await expect(validateTarget('http://10.0.0.1/', { allowLocal: true })).rejects.toThrow();
    await expect(validateTarget('https://example.org/', { allowLocal: true })).rejects.toThrow();
  });

  it('classifies addresses', () => {
    for (const a of ['127.0.0.1', '10.1.2.3', '172.31.0.1', '192.168.0.1', '169.254.1.1', '0.0.0.0', '224.0.0.1', '::1', 'fd12::1', 'fe80::1', '::ffff:192.168.1.1', '::ffff:a00:1', '::ffff:7f00:1', '64:ff9b::a00:1', '::a00:1', 'nonsense'])
      expect(isNonPublicAddress(a), a).toBe(true);
    for (const a of ['203.0.113.10', '172.32.0.1', '8.8.8.8', '::ffff:808:808', '2001:db8::1']) expect(isNonPublicAddress(a), a).toBe(false);
  });
});

describe('deploy: live check against a local mock server', () => {
  let server: Server;
  let base = '';
  let site: Files = {};
  let tweak: (path: string, headers: Record<string, string | string[]>) => void = () => {};
  const seen: string[] = [];

  beforeAll(async () => {
    server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
      if (path === '/plan') {
        res.writeHead(308, { location: '/plan/' }).end();
        return;
      }
      const file = path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1);
      const found = site[file] !== undefined;
      const headers: Record<string, string | string[]> = {};
      const rules = parseHeadersFile(site._headers ?? '');
      for (const [pattern, values] of Object.entries(rules)) {
        const match = pattern === '/*' || pattern === path || (pattern.endsWith('*') && path.startsWith(pattern.slice(0, -1)));
        if (match) for (const [k, v] of Object.entries(values)) headers[k] = headers[k] ? [...[headers[k]].flat(), ...v] : v.length === 1 ? v[0]! : v;
      }
      headers['content-type'] = (found ? file : '404.html').endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8';
      tweak(path, headers);
      res.writeHead(found ? 200 : 404, headers).end(found ? site[file] : site['404.html']);
    });
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address();
    base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/`;
  });
  afterAll(() => new Promise<void>((done) => server.close(() => done())));

  const run = (kind: Kind, expectKind: Kind, edit?: (f: Files) => void, commit = COMMIT) => {
    site = files(kind);
    edit?.(site);
    seen.length = 0;
    // eslint-disable-next-line no-restricted-globals -- test: wraps fetch to record every contacted URL
    const spy: typeof fetch = (input, init) => (seen.push(String(input)), fetch(input, init));
    return checkDeployment(base, { expect: expectKind, commit, allowLocal: true, fetchImpl: spy });
  };

  it('passes a correct test and a correct production deployment, contacting only that origin', async () => {
    tweak = () => {};
    expect((await run('test', 'test')).problems).toEqual([]);
    expect(seen.length).toBeGreaterThan(5);
    expect(seen.every((u) => u.startsWith(base))).toBe(true);
    expect((await run('prod', 'prod')).problems).toEqual([]);
  });

  it('fails when the deployments are swapped', async () => {
    tweak = () => {};
    const asProd = (await run('test', 'prod')).problems.join('\n');
    expect(asProd).toMatch(/X-Robots-Tag with noindex/);
    expect(asProd).toMatch(/production robots.txt disallows everything/);
    expect(asProd).toMatch(/production page carries a noindex/);
    const asTest = (await run('prod', 'test')).problems.join('\n');
    expect(asTest).toMatch(/without X-Robots-Tag: noindex/);
    expect(asTest).toMatch(/test robots.txt does not disallow/);
  });

  it('fails a test deployment whose host drops X-Robots-Tag', async () => {
    tweak = (_p, h) => delete h['x-robots-tag'];
    expect((await run('test', 'test')).problems.join()).toMatch(/test deployment without X-Robots-Tag/);
  });

  it('fails a production deployment with X-Robots-Tag: noindex from the host', async () => {
    tweak = (_p, h) => (h['x-robots-tag'] = 'noindex');
    expect((await run('prod', 'prod')).problems.join()).toMatch(/production deployment sends X-Robots-Tag/);
  });

  it('fails on a wrong commit', async () => {
    tweak = () => {};
    expect((await run('prod', 'prod', undefined, OTHER)).problems.join()).toMatch(/does not match 000950f4b540/);
  });

  it('fails on a missing or conflicting security header', async () => {
    tweak = (_p, h) => delete h['x-frame-options'];
    expect((await run('prod', 'prod')).problems.join()).toMatch(/missing x-frame-options/);
    tweak = (_p, h) => (h['x-frame-options'] = ['DENY', 'SAMEORIGIN']);
    expect((await run('prod', 'prod')).problems.join()).toMatch(/conflicting x-frame-options: DENY, SAMEORIGIN/);
    tweak = (_p, h) => (h['content-security-policy'] = "connect-src *; frame-ancestors 'none'");
    expect((await run('prod', 'prod')).problems.join()).toMatch(/content-security-policy/);
  });

  it('fails on a blanket Disallow in production robots.txt', async () => {
    tweak = () => {};
    expect((await run('prod', 'prod', (f) => (f['robots.txt'] = 'User-agent: *\nDisallow: /\n'))).problems).toEqual(['/robots.txt: production robots.txt disallows everything']);
  });

  it('does not follow a redirect to another host', async () => {
    tweak = () => {};
    site = files('prod');
    const original = server.listeners('request')[0] as (...a: unknown[]) => void;
    server.removeAllListeners('request');
    server.on('request', (req, res) => {
      if (req.url === '/impressum/') res.writeHead(302, { location: 'http://evil.example/' }).end();
      else original(req, res);
    });
    try {
      const r = await run('prod', 'prod');
      expect(r.problems.join()).toMatch(/\/impressum\/: HTTP 302/);
      expect(seen.every((u) => u.startsWith(base))).toBe(true);
    } finally {
      server.removeAllListeners('request');
      server.on('request', original);
    }
  });
});
