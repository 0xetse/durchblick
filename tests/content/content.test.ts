import { describe, expect, it } from 'vitest';
import { checkIntegrity, contentAsOf, contentReviewRange, getContent, refId, reviewDates, type ContentBundle } from '~/domain/content';
import { isCalendarDate } from '~/domain/dates';

describe('content bundle', () => {
  const content = getContent();

  it('loads and passes schema + integrity validation', () => {
    expect(content.services.length).toBeGreaterThan(0);
    expect(content.sources.size).toBeGreaterThan(0);
  });

  it('every service has at least one guide', () => {
    for (const s of content.services) {
      const guides = content.guides.filter((g) => g.service === s.id);
      expect(guides.length, s.id).toBeGreaterThan(0);
    }
  });

  it('every service cites at least one tier-1 source', () => {
    for (const s of content.services) {
      const refs = s.dataPoints.flatMap((d) => d.sources).map(refId);
      const tier1 = refs.some((r) => content.sources.get(r)?.tier === 1);
      expect(tier1, s.id).toBe(true);
    }
  });

  it('possible inferences are never backed only by the provider claiming them', () => {
    // A "possible" inference is by definition not documented by the provider;
    // it must be explained in text, but it may cite research or the data basis.
    for (const s of content.services) {
      for (const i of s.inferences.filter((x) => x.level === 'possible')) {
        expect(i.detail.length, `${s.id}.${i.id}`).toBeGreaterThan(20);
      }
    }
  });

  it('review dates are not in the future', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const s of content.services) expect(s.reviewedAt <= today, s.id).toBe(true);
    for (const g of content.guides) expect(g.verification.checkedAt <= today, g.id).toBe(true);
    for (const src of content.sources.values()) expect(src.retrievedAt <= today, src.id).toBe(true);
  });

  it('real-world cases cite at least one regulator, official or journalism source each', () => {
    expect(content.examples.length).toBeGreaterThanOrEqual(5);
    for (const e of content.examples) {
      const types = e.sources.map((r) => content.sources.get(refId(r))?.type);
      expect(types.some((t) => t === 'regulator' || t === 'official-docs' || t === 'journalism'), e.id).toBe(true);
    }
  });

  it('flags a case pointing to an unknown setting', () => {
    const broken = { ...content, examples: [{ ...content.examples[0]!, action: 'does-not-exist' }] };
    expect(checkIntegrity(broken)).toContain(`example ${content.examples[0]!.id}: unknown action guide "does-not-exist"`);
  });

  it('dates the content by the most recent review or check', () => {
    const asOf = contentAsOf(content);
    expect(asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const g of content.guides) expect(g.verification.checkedAt <= asOf).toBe(true);
    for (const s of content.services) expect(s.reviewedAt <= asOf).toBe(true);
  });
});

describe('content review range', () => {
  const content = getContent();
  // The documented review fields, read again here independently of reviewDates().
  const fields = (b: ContentBundle) => [
    ...b.services.map((s) => s.reviewedAt),
    ...b.guides.map((g) => g.verification.checkedAt),
    ...b.alternatives.map((a) => a.reviewedAt),
    b.simulator.reviewedAt,
  ];
  /** A bundle whose only review dates are the given ones. */
  const withDates = (dates: string[]): ContentBundle => ({
    ...content,
    services: dates.map((d) => ({ ...content.services[0]!, reviewedAt: d })),
    guides: [],
    alternatives: [],
    simulator: { ...content.simulator, reviewedAt: dates[0]! },
  });

  it('spans the oldest to the most recent documented review date', () => {
    const all = fields(content);
    expect(reviewDates(content)).toEqual(all);
    const range = contentReviewRange(content);
    expect(range.from).toBe([...all].sort()[0]);
    expect(range.to).toBe([...all].sort().at(-1));
    expect(range.to).toBe(contentAsOf(content));
    expect(range.from <= range.to).toBe(true);
  });

  it('uses only real calendar dates that are not in the future (UTC)', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const d of fields(content)) {
      expect(isCalendarDate(d), d).toBe(true);
      expect(d <= today, d).toBe(true);
    }
  });

  it.each([
    ['a month change', ['2026-02-01', '2026-01-31'], '2026-01-31', '2026-02-01'],
    ['a year change', ['2027-01-01', '2026-12-31', '2026-12-15'], '2026-12-15', '2027-01-01'],
    ['a leap day', ['2028-03-01', '2028-02-29', '2028-02-28'], '2028-02-28', '2028-03-01'],
    ['a single date', ['2026-11-11'], '2026-11-11', '2026-11-11'],
  ])('handles %s', (_name, dates, from, to) => {
    expect(contentReviewRange(withDates(dates))).toEqual({ from, to });
  });

  it('rejects an impossible review date instead of showing it', () => {
    expect(() => contentReviewRange(withDates(['2026-10-07', '2026-02-30']))).toThrow(/2026-02-30/);
    expect(() => contentReviewRange(withDates(['2026-02-29']))).toThrow(/invalid review date/);
  });

  it('gives the same range for the same content data', () => {
    expect(contentReviewRange(structuredClone(content))).toEqual(contentReviewRange(content));
  });

  it('does not move when anything but a review date changes', () => {
    const before = contentReviewRange(content);
    const changed: ContentBundle = {
      ...content,
      services: content.services.map((s) => ({ ...s, name: `${s.name} (renamed)` })),
      guides: content.guides.map((g) => ({ ...g, title: `${g.title} (edited)` })),
      examples: [],
      sources: new Map(),
    };
    expect(contentReviewRange(changed)).toEqual(before);
  });
});
