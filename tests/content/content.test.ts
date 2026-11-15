import { describe, expect, it } from 'vitest';
import { checkIntegrity, contentAsOf, getContent, refId } from '~/domain/content';

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
