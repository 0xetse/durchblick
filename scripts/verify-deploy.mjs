// `npm run verify:deploy -- <url> --expect test|prod --commit <sha>`
//
// Read-only check of a live deployment (scripts/lib/deploy-checks.mjs):
// HTTPS and redirects, status of the main pages, security headers, robots.txt,
// X-Robots-Tag, robots meta tags and the build commit on /transparenz/.
// "test" must block indexing everywhere, "prod" must not block it anywhere.
// Contacts only the given origin (https, public address); redirects are not
// followed. Exit code 1 on any problem.
import { checkDeployment } from './lib/deploy-checks.mjs';

const USAGE = 'usage: npm run verify:deploy -- <https-url> --expect test|prod --commit <sha>';
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const url = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

try {
  if (!url) throw new Error(USAGE);
  const expect = opt('expect');
  const commit = opt('commit');
  if (!expect || !commit) throw new Error(USAGE);
  const result = await checkDeployment(url, { expect, commit });
  for (const p of result.passed) console.log(`ok    ${p}`);
  for (const p of result.problems) console.error(`FAIL  ${p}`);
  if (result.problems.length) {
    console.error(`verify:deploy failed – ${result.origin} is not a valid ${expect} deployment of ${commit.slice(0, 12)} (${result.problems.length} problems)`);
    process.exit(1);
  }
  console.log(`verify:deploy ok – ${result.origin} is a ${expect} deployment of ${commit.slice(0, 12)}`);
} catch (e) {
  console.error(`verify:deploy failed – ${e.message}`);
  process.exit(1);
}
