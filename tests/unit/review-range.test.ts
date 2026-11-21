import { describe, expect, it } from 'vitest';
import { isCalendarDate, parseCalendarDate } from '~/domain/dates';
import { formatReviewRange } from '~/i18n';

describe('calendar dates', () => {
  it('accepts real dates, including 29 February in leap years', () => {
    for (const d of ['2026-01-01', '2026-12-31', '2028-02-29', '2000-02-29', '0050-01-01']) expect(isCalendarDate(d), d).toBe(true);
    expect(parseCalendarDate('2028-02-29')).toEqual({ year: 2028, month: 2, day: 29 });
  });

  it('rejects impossible and malformed dates', () => {
    for (const d of ['2026-02-29', '2100-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-00-10', '2026-1-5', '11.11.2026', '', ' 2026-11-11']) {
      expect(isCalendarDate(d), d).toBe(false);
    }
    expect(isCalendarDate(undefined)).toBe(false);
  });
});

describe('review range for display', () => {
  it.each([
    ['same year', '2026-10-07', '2026-11-11', 'zwischen 07.10. und 11.11.2026', 'between 7 Oct and 11 Nov 2026'],
    ['month change', '2026-01-31', '2026-02-01', 'zwischen 31.01. und 01.02.2026', 'between 31 Jan and 1 Feb 2026'],
    ['year change', '2026-12-31', '2027-01-01', 'zwischen 31.12.2026 und 01.01.2027', 'between 31 Dec 2026 and 1 Jan 2027'],
    ['leap day', '2028-02-29', '2028-03-01', 'zwischen 29.02. und 01.03.2028', 'between 29 Feb and 1 Mar 2028'],
    ['one day', '2026-11-11', '2026-11-11', 'am 11.11.2026', 'on 11 Nov 2026'],
  ])('%s', (_name, from, to, de, en) => {
    expect(formatReviewRange({ from, to }, 'de')).toBe(de);
    expect(formatReviewRange({ from, to }, 'en')).toBe(en);
  });

  it('does not depend on the local time zone', () => {
    const before = process.env.TZ;
    try {
      const out = ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati'].map((tz) => {
        process.env.TZ = tz;
        return [formatReviewRange({ from: '2026-03-28', to: '2026-03-29' }, 'de'), formatReviewRange({ from: '2026-12-31', to: '2027-01-01' }, 'en')];
      });
      for (const o of out) expect(o).toEqual(out[0]);
    } finally {
      if (before === undefined) delete process.env.TZ;
      else process.env.TZ = before;
    }
  });

  it('rejects impossible or reversed ranges', () => {
    expect(() => formatReviewRange({ from: '2026-02-30', to: '2026-03-01' })).toThrow(/invalid/);
    expect(() => formatReviewRange({ from: '2026-11-11', to: '2026-10-07' })).toThrow(/ends before/);
  });
});
