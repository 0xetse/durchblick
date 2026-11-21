// `npm run compare:builds`: builds the production and the test variant from
// the same working tree and checks that they differ ONLY where intended
// (scripts/mark-test-build.mjs):
//   1. every HTML page of the test build has exactly one
//      <meta name="robots" content="noindex, nofollow"> – nothing else differs;
//   2. robots.txt of the test build disallows everything;
//   3. _headers of the test build = production _headers + an X-Robots-Tag rule.
// Any other difference – an extra or missing file, a changed byte – fails.
//
// It also searches both builds for things that must never be published:
// local paths, the user, host and branch name of this machine, and e-mail
// addresses that do not occur in content/ (sources) or public/ (e.g.
// security.txt). An address that only appears in src/ is reported: it must be
// a deliberate part of the content or of public/, not a stray string in code.
//
// Afterwards dist/ holds the test build.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { homedir, hostname, tmpdir, userInfo } from 'node:os';
import { join, relative } from 'node:path';

const DIST = 'dist';
const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
const TEST_ROBOTS = 'User-agent: *\nDisallow: /\n';
const TEST_HEADERS_SUFFIX = '\n/*\n  X-Robots-Tag: noindex, nofollow\n';
const TEXT = /\.(html|js|css|txt|json|webmanifest|svg|xml)$|(^|\/)_headers$/;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const failures = [];
const fail = (msg) => failures.push(msg);

function run(script) {
  const r = spawnSync('npm', ['run', '-s', script], { stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });
  if (r.status !== 0) throw new Error(`npm run ${script} failed (exit ${r.status})`);
}

function files(root) {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else out.push(relative(root, p).split('\\').join('/'));
    }
  };
  walk(root);
  return out.sort();
}

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------- build both
const tmp = mkdtempSync(join(tmpdir(), 'durchblick-compare-'));
const prodDir = join(tmp, 'prod');
try {
  console.log('building production (npm run build) …');
  run('build');
  cpSync(DIST, prodDir, { recursive: true });
  console.log('building test variant (npm run build:test) …');
  run('build:test');

  // -------------------------------------------------------------- compare
  const prodFiles = files(prodDir);
  const testFiles = files(DIST);
  for (const f of prodFiles.filter((f) => !testFiles.includes(f))) fail(`only in production build: ${f}`);
  for (const f of testFiles.filter((f) => !prodFiles.includes(f))) fail(`only in test build: ${f}`);

  let html = 0;
  let noindex = 0;
  for (const f of testFiles.filter((f) => prodFiles.includes(f))) {
    const p = readFileSync(join(prodDir, f));
    const t = readFileSync(join(DIST, f));
    if (f.endsWith('.html')) {
      html++;
      const ps = p.toString('utf8');
      const ts = t.toString('utf8');
      if (ps.includes(NOINDEX)) fail(`production page carries noindex: ${f}`);
      if (ts.split(NOINDEX).length - 1 !== 1) fail(`test page without exactly one noindex tag: ${f}`);
      else if (ts.replace(NOINDEX, '') !== ps) fail(`test page differs beyond the noindex tag: ${f}`);
      else noindex++;
      continue;
    }
    if (f === 'robots.txt') {
      if (t.toString('utf8') !== TEST_ROBOTS) fail('test robots.txt does not disallow everything');
      if (p.toString('utf8') === TEST_ROBOTS) fail('production robots.txt disallows everything');
      continue;
    }
    if (f === '_headers') {
      if (t.toString('utf8') !== p.toString('utf8') + TEST_HEADERS_SUFFIX) fail('test _headers differs beyond the X-Robots-Tag rule');
      continue;
    }
    if (!p.equals(t)) fail(`differs: ${f}`);
  }

  // ------------------------------------------------------- personal data
  const needles = new Set(['/Users/', '/home/', 'C:\\Users\\', homedir()]);
  const user = userInfo().username;
  if (user && user.length >= 4) needles.add(user);
  const host = hostname().replace(/\.local$/, '');
  if (host && host.length >= 4 && host !== 'localhost') needles.add(host);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch && !['HEAD', 'main', 'master'].includes(branch)) needles.add(branch);

  const allowedEmails = new Set();
  for (const f of git(['ls-files', 'content', 'public']).split('\n').filter(Boolean)) {
    for (const m of readFileSync(f, 'utf8').matchAll(EMAIL)) allowedEmails.add(m[0]);
  }

  for (const [label, root] of [['production', prodDir], ['test', DIST]]) {
    for (const f of files(root).filter((f) => TEXT.test(f))) {
      const text = readFileSync(join(root, f), 'utf8');
      const lower = text.toLowerCase();
      for (const n of needles) if (lower.includes(n.toLowerCase())) fail(`${label} build, ${f}: contains a local identifier (${n === user || n === host || n === branch ? 'user/host/branch name' : n})`);
      for (const m of text.matchAll(EMAIL)) if (!allowedEmails.has(m[0])) fail(`${label} build, ${f}: unknown e-mail address ${m[0]}`);
    }
  }

  console.log(`files: ${prodFiles.length} production, ${testFiles.length} test; HTML pages: ${html}, with exactly the expected noindex difference: ${noindex}`);
  console.log(`checked for: local paths, user/host/branch name, e-mail addresses outside ${allowedEmails.size} known ones`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures.length) {
  for (const f of failures.slice(0, 50)) console.error(`FAIL ${f}`);
  if (failures.length > 50) console.error(`… and ${failures.length - 50} more`);
  process.exit(1);
}
console.log('compare:builds ok – the builds differ only in noindex, robots.txt and X-Robots-Tag; no local identifiers found (dist/ now holds the test build)');
