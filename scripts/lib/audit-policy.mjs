// Evaluates an `npm audit --json` report (auditReportVersion 2) against a list
// of documented, expiring exceptions.
//
// npm audit can only ignore everything below a severity; it cannot accept one
// specific advisory. This policy keeps the threshold and fails on every
// advisory at or above it, except an exception that matches the advisory's
// GHSA id, package AND vulnerable range exactly and has not expired. So:
// - a new advisory, even for the same package, still fails;
// - a widened range of the accepted advisory fails (it needs a new review);
// - an expired exception fails;
// - an exception that no longer matches anything fails, so it gets removed
//   once a fixed version is installed.
// Anything the policy cannot read (no JSON, npm error, unknown format) fails
// as well – the check never fails open.

export const SEVERITIES = ['info', 'low', 'moderate', 'high', 'critical'];

const GHSA = /GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Every distinct advisory in the report (transitive entries point back to one of these). */
export function collectAdvisories(report) {
  if (!report || typeof report !== 'object') throw new Error('audit output is not a JSON object');
  if (report.error) throw new Error(`npm audit failed: ${JSON.stringify(report.error)}`);
  if (report.auditReportVersion !== 2) throw new Error(`unsupported auditReportVersion: ${report.auditReportVersion}`);
  if (!report.vulnerabilities || typeof report.vulnerabilities !== 'object') throw new Error('audit output has no vulnerabilities map');

  const advisories = new Map();
  for (const entry of Object.values(report.vulnerabilities)) {
    for (const via of entry.via ?? []) {
      if (typeof via === 'string') continue;
      const id = via.url?.match(GHSA)?.[0];
      if (!id) throw new Error(`advisory without GHSA id in ${entry.name}: ${JSON.stringify(via)}`);
      const key = `${id} ${via.name} ${via.range}`;
      if (!advisories.has(key)) {
        advisories.set(key, { id, package: via.name, range: via.range, severity: via.severity, title: via.title, url: via.url });
      }
    }
  }
  return [...advisories.values()];
}

/** Rejects malformed exceptions so a typo cannot silently widen what is accepted. */
export function validateExceptions(exceptions) {
  if (!Array.isArray(exceptions)) throw new Error('exceptions must be an array');
  for (const [i, e] of exceptions.entries()) {
    const where = `exception #${i + 1}`;
    if (typeof e.id !== 'string' || e.id.match(GHSA)?.[0] !== e.id) throw new Error(`${where}: id must be a single GHSA id`);
    if (typeof e.package !== 'string' || !e.package) throw new Error(`${where}: package is required`);
    if (typeof e.range !== 'string' || !e.range) throw new Error(`${where}: range is required`);
    if (typeof e.expires !== 'string' || !DATE.test(e.expires) || Number.isNaN(Date.parse(e.expires))) {
      throw new Error(`${where}: expires must be a date (YYYY-MM-DD)`);
    }
    if (typeof e.reason !== 'string' || e.reason.trim().length < 20) throw new Error(`${where}: reason must explain the decision`);
  }
}

/**
 * @param {object} report parsed `npm audit --json`
 * @param {Array<{id:string,package:string,range:string,expires:string,reason:string}>} exceptions
 * @param {{ level?: string, today?: string }} [options] today as YYYY-MM-DD (UTC)
 */
export function evaluate(report, exceptions, { level = 'moderate', today = new Date().toISOString().slice(0, 10) } = {}) {
  validateExceptions(exceptions);
  const threshold = SEVERITIES.indexOf(level);
  if (threshold < 0) throw new Error(`unknown audit level: ${level}`);

  const advisories = collectAdvisories(report);
  const failures = [];
  const accepted = [];
  const used = new Set();

  for (const a of advisories) {
    const rank = SEVERITIES.indexOf(a.severity);
    if (rank >= 0 && rank < threshold) continue;
    const ex = exceptions.find((e) => e.id === a.id && e.package === a.package && e.range === a.range);
    if (!ex) {
      failures.push({ ...a, problem: 'not accepted' });
    } else if (today > ex.expires) {
      used.add(ex);
      failures.push({ ...a, problem: `exception expired on ${ex.expires}` });
    } else {
      used.add(ex);
      accepted.push({ ...a, expires: ex.expires });
    }
  }

  const stale = exceptions.filter((e) => !used.has(e));
  return { ok: failures.length === 0 && stale.length === 0, failures, accepted, stale };
}
