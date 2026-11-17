// `npm run audit:deps`: npm audit for production dependencies at level
// "moderate", with the documented, expiring exceptions from
// scripts/audit-exceptions.json (see SECURITY.md, "Abhängigkeiten").
// Logic and rules: scripts/lib/audit-policy.mjs.
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { evaluate } from './lib/audit-policy.mjs';

const LEVEL = 'moderate';

const exceptions = JSON.parse(await readFile(new URL('./audit-exceptions.json', import.meta.url), 'utf8'));

// npm audit exits non-zero whenever it finds something; the JSON on stdout is
// what counts. A missing or unparsable report fails below.
const run = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
  shell: process.platform === 'win32',
});
if (run.error) throw run.error;

let report;
try {
  report = JSON.parse(run.stdout);
} catch {
  console.error(run.stderr || run.stdout);
  throw new Error('npm audit did not return JSON');
}

const result = evaluate(report, exceptions, { level: LEVEL });

for (const a of result.accepted) {
  console.log(`accepted until ${a.expires}: ${a.id} ${a.package} ${a.range} (${a.severity}) – ${a.title}`);
}
for (const f of result.failures) {
  console.error(`FAIL ${f.id} ${f.package} ${f.range} (${f.severity}): ${f.problem} – ${f.title} ${f.url}`);
}
for (const e of result.stale) {
  console.error(`FAIL exception ${e.id} (${e.package} ${e.range}) no longer matches the audit report – remove it from scripts/audit-exceptions.json`);
}

const total = report.metadata?.vulnerabilities?.total ?? '?';
if (!result.ok) {
  console.error(`audit:deps failed (${total} entries reported by npm audit, level ${LEVEL})`);
  process.exit(1);
}
console.log(`audit:deps ok (${total} entries reported by npm audit, all from ${result.accepted.length} accepted advisories)`);
