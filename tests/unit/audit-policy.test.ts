import { describe, expect, it } from 'vitest';
import { MAX_VALIDITY_DAYS, collectAdvisories, evaluate, parseIsoDate, validateExceptions } from '../../scripts/lib/audit-policy.mjs';
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
  added: '2026-11-17',
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

  // Checks the committed file on its own, independent of the picomatch fixture
  // above; an empty list is valid.
  it('the committed exceptions are well-formed', () => {
    expect(Array.isArray(exceptionsFile)).toBe(true);
    expect(() => validateExceptions(exceptionsFile)).not.toThrow();
  });

  it('the committed exceptions were not added in the future (UTC)', () => {
    const now = parseIsoDate(new Date().toISOString().slice(0, 10))!;
    for (const e of exceptionsFile as { id: string; added: string }[]) {
      expect(parseIsoDate(e.added)!, e.id).toBeLessThanOrEqual(now);
    }
  });

  it('passes a clean report without exceptions', () => {
    expect(evaluate(report(), [], { today })).toMatchObject({ ok: true, failures: [], accepted: [], stale: [] });
  });
});

describe('audit policy: strict dates', () => {
  it('accepts real calendar dates, including 29 February in leap years', () => {
    for (const d of ['2026-01-01', '2026-12-31', '2028-02-29', '2000-02-29', '1970-01-01']) {
      expect(parseIsoDate(d), d).not.toBeNull();
    }
    expect(parseIsoDate('1970-01-02')).toBe(1);
  });

  it('rejects impossible dates and malformed values', () => {
    for (const d of ['2026-02-29', '2026-02-30', '2026-04-31', '2100-02-29', '2026-13-01', '2026-00-10', '2026-12-32', '2026-1-5', '26-01-05', '2026-01-05T00:00:00Z', ' 2026-01-05', '']) {
      expect(parseIsoDate(d), d).toBeNull();
    }
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate(20260105)).toBeNull();
  });

  it('keeps the years 0–99 instead of mapping them to 1900–1999 like Date.UTC', () => {
    expect(parseIsoDate('0050-01-01')).toBe(Math.round(Date.parse('0050-01-01T00:00:00Z') / 86_400_000));
    expect(parseIsoDate('0050-01-01')).not.toBe(parseIsoDate('1950-01-01'));
    expect(parseIsoDate('0004-02-29')).not.toBeNull();
    expect(parseIsoDate('0001-02-29')).toBeNull();
  });

  it('rejects an exception with an impossible added or expires date', () => {
    for (const d of ['2026-02-30', '2026-04-31', '2026-02-29', '2026-13-01', '17.11.2026']) {
      expect(() => validateExceptions([exception({ expires: d })]), `expires ${d}`).toThrow(/expires must be a valid calendar date/);
      expect(() => validateExceptions([exception({ added: d })]), `added ${d}`).toThrow(/added must be a valid calendar date/);
    }
  });

  it('rejects an invalid "today"', () => {
    expect(() => evaluate(report(advisory()), [exception()], { today: '2026-02-30' })).toThrow(/today/);
    expect(() => evaluate(report(advisory()), [exception()], { today: 'yesterday' })).toThrow(/today/);
  });

  it('does not depend on the local time zone', () => {
    const before = process.env.TZ;
    try {
      const results = ['UTC', 'America/Los_Angeles', 'Europe/Berlin', 'Pacific/Kiritimati', 'Pacific/Pago_Pago'].map((tz) => {
        process.env.TZ = tz;
        return [parseIsoDate('2026-03-08'), parseIsoDate('2026-03-29'), parseIsoDate('2026-10-25'), parseIsoDate('2028-02-29')];
      });
      for (const r of results) expect(r).toEqual(results[0]);
    } finally {
      if (before === undefined) delete process.env.TZ;
      else process.env.TZ = before;
    }
  });
});

describe('audit policy: validity window (added → expires)', () => {
  // The exception is checked on its "added" day unless a test says otherwise.
  const run = (added: string, expires: string, on = added) =>
    evaluate(report(advisory()), [exception({ added, expires })], { today: on });

  it('allows at most 30 days', () => {
    expect(MAX_VALIDITY_DAYS).toBe(30);
  });

  it.each([
    ['exactly 30 days', '2026-11-17', '2026-12-17'],
    ['the same start and expiry day', '2026-11-17', '2026-11-17'],
    ['a month change', '2026-01-31', '2026-03-02'],
    ['a year change', '2026-12-15', '2027-01-14'],
    ['a leap year', '2028-02-15', '2028-03-16'],
    ['a year without leap day', '2027-02-15', '2027-03-17'],
    ['a DST change in Europe and the US', '2026-03-01', '2026-03-31'],
  ])('accepts %s (%s → %s)', (_name, added, expires) => {
    expect(run(added, expires).ok).toBe(true);
  });

  it.each([
    ['31 days', '2026-11-17', '2026-12-18'],
    ['a month change', '2026-01-31', '2026-03-03'],
    ['a year change', '2026-12-15', '2027-01-15'],
    ['a leap year', '2028-02-15', '2028-03-17'],
    ['a year without leap day', '2027-02-15', '2027-03-18'],
    ['the far future', '2026-11-17', '2099-01-01'],
  ])('rejects %s (%s → %s)', (_name, added, expires) => {
    expect(() => run(added, expires)).toThrow(/days after added .*at most 30 days are allowed/);
  });

  it('rejects an expiry date before the start date', () => {
    expect(() => run('2026-11-17', '2026-11-16')).toThrow(/must not be before added/);
  });

  it('rejects a start date in the future (UTC calendar day)', () => {
    expect(() => run('2026-11-18', '2026-12-01', '2026-11-17')).toThrow(/added \(2026-11-18\) lies in the future/);
    expect(run('2026-11-17', '2026-12-01', '2026-11-17').ok).toBe(true);
  });

  it('requires added', () => {
    const withoutAdded: Record<string, unknown> = exception();
    delete withoutAdded.added;
    expect(() => validateExceptions([withoutAdded])).toThrow(/added must be a valid calendar date/);
    // Deliberately incomplete: the cast lets the test pass what a typo in the JSON would produce.
    expect(() => evaluate(report(advisory()), [withoutAdded as ReturnType<typeof exception>], { today })).toThrow(/added/);
  });

  it('is valid on the expiry day and fails from the next day on', () => {
    expect(run('2026-11-17', '2026-12-17', '2026-12-17').ok).toBe(true);
    const next = run('2026-11-17', '2026-12-17', '2026-12-18');
    expect(next.ok).toBe(false);
    expect(next.failures[0].problem).toBe('exception expired on 2026-12-17');
  });

  it('fails an exception that expired yesterday, with a clear message', () => {
    const r = run('2026-11-01', '2026-11-16', '2026-11-17');
    expect(r.ok).toBe(false);
    expect(r.failures[0].problem).toBe('exception expired on 2026-11-16');
  });

  it('checks every exception, also one that matches no advisory', () => {
    const unused = exception({ id: 'GHSA-aaaa-bbbb-cccc', package: 'other', added: '2026-11-01', expires: '2027-06-01' });
    expect(() => evaluate(report(advisory()), [exception(), unused], { today })).toThrow(/exception #2: expires/);
  });

  it('gives the same results in every local time zone', () => {
    const before = process.env.TZ;
    const cases: [string, string, string][] = [
      ['2026-03-01', '2026-03-31', '2026-03-31'],
      ['2026-10-01', '2026-10-31', '2026-10-31'],
      ['2026-11-17', '2026-12-17', '2026-12-18'],
      ['2028-02-15', '2028-03-16', '2028-02-29'],
    ];
    const outcome = () => cases.map(([a, e, on]) => run(a, e, on).ok);
    try {
      const results = ['UTC', 'America/Los_Angeles', 'Europe/Berlin', 'Pacific/Kiritimati', 'Pacific/Pago_Pago'].map((tz) => {
        process.env.TZ = tz;
        return outcome();
      });
      expect(results[0]).toEqual([true, true, false, true]);
      for (const r of results) expect(r).toEqual(results[0]);
    } finally {
      if (before === undefined) delete process.env.TZ;
      else process.env.TZ = before;
    }
  });
});
