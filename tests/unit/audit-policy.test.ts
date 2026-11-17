import { describe, expect, it } from 'vitest';
import { collectAdvisories, evaluate } from '../../scripts/lib/audit-policy.mjs';
import exceptionsFile from '../../scripts/audit-exceptions.json';

const advisory = (over: Record<string, unknown> = {}) => ({
  source: 1,
  name: 'picomatch',
  dependency: 'picomatch',
  title: 'ReDoS',
  url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
  severity: 'high',
  range: '<=4.0.7',
  ...over,
});

// Shape of `npm audit --json` (auditReportVersion 2): the advisory object sits
// on the vulnerable package, dependents only name it as a string.
const report = (...advisories: ReturnType<typeof advisory>[]) => ({
  auditReportVersion: 2,
  vulnerabilities: Object.fromEntries([
    ...advisories.map((a) => [a.name, { name: a.name, severity: a.severity, via: [a] }]),
    ['astro', { name: 'astro', severity: 'high', via: advisories.map((a) => a.name) }],
  ]),
  metadata: { vulnerabilities: { total: advisories.length + 1 } },
});

const exception = (over: Record<string, unknown> = {}) => ({
  id: 'GHSA-fc5q-39xc-vjpf',
  package: 'picomatch',
  range: '<=4.0.7',
  expires: '2026-12-17',
  reason: 'No fixed release; not reachable in the static site.',
  ...over,
});

const today = '2026-11-17';

describe('audit policy', () => {
  it('passes an accepted advisory and its transitive entries', () => {
    const r = evaluate(report(advisory()), [exception()], { today });
    expect(r.ok).toBe(true);
    expect(r.accepted).toHaveLength(1);
  });

  it('still accepts on the expiry day and fails the day after', () => {
    expect(evaluate(report(advisory()), [exception()], { today: '2026-12-17' }).ok).toBe(true);
    const r = evaluate(report(advisory()), [exception()], { today: '2026-12-18' });
    expect(r.ok).toBe(false);
    expect(r.failures[0].problem).toMatch(/expired/);
  });

  it('fails without any exception', () => {
    expect(evaluate(report(advisory()), [], { today }).ok).toBe(false);
  });

  it('fails a different advisory for the same package', () => {
    const other = advisory({ url: 'https://github.com/advisories/GHSA-aaaa-bbbb-cccc' });
    const r = evaluate(report(advisory(), other), [exception()], { today });
    expect(r.ok).toBe(false);
    expect(r.failures.map((f) => f.id)).toEqual(['GHSA-aaaa-bbbb-cccc']);
  });

  it('fails when the advisory range is widened', () => {
    const r = evaluate(report(advisory({ range: '<=4.0.8' })), [exception()], { today });
    expect(r.ok).toBe(false);
  });

  it('fails a stale exception once the advisory is gone', () => {
    const r = evaluate(report(), [exception()], { today });
    expect(r.ok).toBe(false);
    expect(r.stale).toHaveLength(1);
  });

  it('ignores advisories below the threshold', () => {
    expect(evaluate(report(advisory({ severity: 'low' })), [], { today }).ok).toBe(true);
    expect(evaluate(report(advisory({ severity: 'moderate' })), [], { today }).ok).toBe(false);
  });

  it('never fails open on unreadable reports', () => {
    expect(() => evaluate({ error: { code: 'ENOTFOUND' } }, [], { today })).toThrow(/npm audit failed/);
    expect(() => evaluate({ auditReportVersion: 1 }, [], { today })).toThrow(/auditReportVersion/);
    expect(() => collectAdvisories(null)).toThrow();
  });

  it('rejects malformed exceptions', () => {
    expect(() => evaluate(report(), [exception({ id: 'GHSA-*' })], { today })).toThrow(/GHSA/);
    expect(() => evaluate(report(), [exception({ expires: 'never' })], { today })).toThrow(/expires/);
    expect(() => evaluate(report(), [exception({ reason: '' })], { today })).toThrow(/reason/);
  });

  it('the committed exceptions are well-formed', () => {
    expect(() => evaluate(report(advisory()), exceptionsFile, { today })).not.toThrow();
  });
});
