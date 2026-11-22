// `npm run package:deploy -- --expect test|prod [--out <dir>] [--commit <sha>]`
//
// Builds the requested variant from the current, committed state and creates
//   durchblick-TEST-<commit>.zip       (npm run build:test)
//   durchblick-PRODUKTION-<commit>.zip (npm run build)
// in <dir> (default: release/, ignored by Git). The zip is written only after
// dist/ passed every check (scripts/lib/deploy-checks.mjs) and the zip itself
// was verified against dist/. It never overwrites an existing file and never
// uploads anything.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { hostname, homedir, userInfo } from 'node:os';
import { join } from 'node:path';
import { normalizeCommit, packageDist, packageName } from './lib/deploy-checks.mjs';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}
const git = (args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

try {
  const expect = arg('expect');
  if (expect !== 'test' && expect !== 'prod') throw new Error('usage: npm run package:deploy -- --expect test|prod [--out <dir>] [--commit <sha>]');
  const outDir = arg('out') ?? 'release';

  // Only a committed, unmodified state is packaged: the zip name and the build
  // commit shown on /transparenz/ must point to a published commit.
  if (git(['status', '--porcelain'])) throw new Error('the working tree has uncommitted changes – commit or stash them first');
  const head = git(['rev-parse', 'HEAD']);
  const wanted = arg('commit');
  if (wanted !== undefined && (!normalizeCommit(wanted) || !head.startsWith(wanted.trim().toLowerCase()))) {
    throw new Error(`--commit ${wanted} does not match HEAD ${head.slice(0, 12)}`);
  }
  const name = packageName(expect, head);
  if (existsSync(join(outDir, name))) throw new Error(`${join(outDir, name)} already exists – not overwritten`);
  console.log(`target: ${name}`);

  const script = expect === 'test' ? 'build:test' : 'build';
  console.log(`building (npm run ${script}) …`);
  const r = spawnSync('npm', ['run', '-s', script], { stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });
  if (r.status !== 0) throw new Error(`npm run ${script} failed`);

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const localIdentifiers = [homedir(), userInfo().username, hostname().replace(/\.local$/, ''), ['HEAD', 'main'].includes(branch) ? '' : branch];
  mkdirSync(outDir, { recursive: true });
  const result = packageDist({ dist: 'dist', outDir, expect, commit: head, localIdentifiers });
  console.log(`package:deploy ok – ${result.files} files checked and zipped`);
  console.log(`file:    ${result.file}`);
  console.log(`sha256:  ${result.sha256}`);
  console.log(`check after upload: npm run verify:deploy -- <url> --expect ${expect} --commit ${head.slice(0, 12)}`);
} catch (e) {
  console.error(`package:deploy failed – no zip was written.\n${e.message}`);
  process.exit(1);
}
