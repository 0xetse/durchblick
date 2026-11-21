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
// - every exception declares the day it was accepted ("added"). "added" must
//   not lie in the future, and "expires" must lie between "added" and at most
//   MAX_VALIDITY_DAYS calendar days after it. An exception is still valid on
//   its "expires" day and fails from the next day on;
// - "added" is a declared start date that is reviewed in the pull request
//   together with the exception. Nothing here protects it against being
//   edited later; renewing an exception means a new review with new dates;
// - both dates must be real calendar dates (no 2026-02-30, no 29 February
//   outside leap years). Dates are compared as whole UTC calendar days, so
//   the local time zone and daylight saving time play no role;
// - an exception that no longer matches anything fails, so it gets removed
//   once a fixed version is installed.
// Anything the policy cannot read (no JSON, npm error, unknown format) fails
// as well – the check never fails open.

export const SEVERITIES = ['info', 'low', 'moderate', 'high', 'critical'];

/** An exception may expire at most this many calendar days after its "added" day. */
export const MAX_VALIDITY_DAYS = 30;

const GHSA = /GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/**
 * Strict YYYY-MM-DD calendar date → day number (days since 1970-01-01, UTC),
 * or null. Date.parse would roll impossible dates over (2026-02-30 → March 2),
 * so the date is built and compared field by field. setUTCFullYear instead of
 * Date.UTC, because Date.UTC maps the years 0–99 to 1900–1999. Only UTC
 * methods are used, so the result does not depend on the local time zone.
 */
export function parseIsoDate(value) {
  if (typeof value !== 'string') return null;
  const m = ISO_DATE.exec(value);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return Math.round(date.getTime() / DAY_MS);
}

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
    const added = parseIsoDate(e.added);
    if (added === null) throw new Error(`${where}: added must be a valid calendar date (YYYY-MM-DD)`);
    const expires = parseIsoDate(e.expires);
    if (expires === null) throw new Error(`${where}: expires must be a valid calendar date (YYYY-MM-DD)`);
    if (expires < added) throw new Error(`${where}: expires (${e.expires}) must not be before added (${e.added})`);
    if (expires - added > MAX_VALIDITY_DAYS) {
      throw new Error(
        `${where}: expires (${e.expires}) is ${expires - added} days after added (${e.added}); at most ${MAX_VALIDITY_DAYS} days are allowed`,
      );
    }
    if (typeof e.reason !== 'string' || e.reason.trim().length < 20) throw new Error(`${where}: reason must explain the decision`);
  }
}

/**
 * @param {object} report parsed `npm audit --json`
 * @param {Array<{id:string,package:string,range:string,added:string,expires:string,reason:string}>} exceptions
 * @param {{ level?: string, today?: string }} [options] today as YYYY-MM-DD (UTC calendar day)
 */
export function evaluate(report, exceptions, { level = 'moderate', today = new Date().toISOString().slice(0, 10) } = {}) {
  validateExceptions(exceptions);
  const todayDay = parseIsoDate(today);
  if (todayDay === null) throw new Error(`today must be a valid calendar date (YYYY-MM-DD): ${today}`);
  for (const [i, e] of exceptions.entries()) {
    if (parseIsoDate(e.added) > todayDay) {
      throw new Error(`exception #${i + 1} (${e.id}): added (${e.added}) lies in the future (today is ${today})`);
    }
  }
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
    } else if (todayDay > parseIsoDate(ex.expires)) {
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
