import { describe, expect, it } from 'vitest';
import { AREAS, areaOf, mapAreas, topAreas, type AreaPoint } from '~/domain/areas';
import type { GuideCard } from '~/domain/client-types';
import { isOptional, priority, stagePlan } from '~/domain/priority';
import { DATA_CATEGORIES } from '~/domain/schema';

const guide = (id: string, service: string, extra: Partial<GuideCard> = {}): GuideCard => ({
  id,
  service,
  serviceName: service,
  platforms: ['web'],
  kind: 'setting',
  title: id,
  goal: '',
  whyItMatters: '',
  whatChanges: '',
  whatDoesNotChange: '',
  impact: 'medium',
  minutes: 5,
  difficulty: 'easy',
  steps: [],
  status: 'verified',
  checkedAt: '2026-10-07',
  sources: [],
  ...extra,
});

describe('life areas', () => {
  it('maps every data category to exactly one area', () => {
    for (const c of DATA_CATEGORIES) {
      expect(AREAS.filter((a) => (a.categories as readonly string[]).includes(c)), c).toHaveLength(1);
      expect(areaOf(c)).toBeTruthy();
    }
  });

  it('counts only selected services, keeps untouched areas empty', () => {
    const points: AreaPoint[] = [
      { service: 'a', category: 'location', title: 'x', provenance: 'observed' },
      { service: 'b', category: 'location', title: 'y', provenance: 'derived' },
      { service: 'b', category: 'purchases', title: 'z', provenance: 'provided' },
    ];
    const areas = mapAreas(['a'], points);
    expect(areas).toHaveLength(AREAS.length);
    expect(areas.find((a) => a.id === 'places')?.services).toEqual(['a']);
    expect(areas.find((a) => a.id === 'purchases')?.services).toEqual([]);
    expect(mapAreas(['a', 'b'], points).find((a) => a.id === 'places')?.services).toEqual(['a', 'b']);
  });

  it('ranks top areas by apps, then data types, and skips untouched ones', () => {
    const points: AreaPoint[] = [
      { service: 'a', category: 'purchases', title: 'p1', provenance: 'provided' },
      { service: 'a', category: 'purchases', title: 'p2', provenance: 'provided' },
      { service: 'a', category: 'location', title: 'l1', provenance: 'observed' },
      { service: 'b', category: 'location', title: 'l2', provenance: 'observed' },
      { service: 'b', category: 'device', title: 'd1', provenance: 'observed' },
    ];
    const top = topAreas(mapAreas(['a', 'b'], points), 5);
    expect(top.map((a) => a.id)).toEqual(['places', 'purchases', 'devices']);
    expect(topAreas(mapAreas(['a', 'b'], points), 1).map((a) => a.id)).toEqual(['places']);
  });
});

describe('plan prioritisation', () => {
  it('ranks impact over effort over verification', () => {
    expect(priority(guide('a', 's', { impact: 'high', minutes: 30 }))).toBeGreaterThan(
      priority(guide('b', 's', { impact: 'medium', minutes: 2 })),
    );
    expect(priority(guide('a', 's', { minutes: 2 }))).toBeGreaterThan(priority(guide('b', 's', { minutes: 20 })));
    expect(priority(guide('a', 's'))).toBeGreaterThan(priority(guide('b', 's', { status: 'needs-verification' })));
  });

  it('never puts convenience trade-offs or account deletion into "Start hier"', () => {
    const gs = [
      guide('pause-history', 'yt', { impact: 'high', tradeOff: 'Keine Empfehlungen mehr' }),
      guide('delete', 'yt', { impact: 'high', kind: 'deletion' }),
      guide('ads', 'yt', { impact: 'high' }),
    ];
    expect(isOptional(gs[0]!)).toBe(true);
    const plan = stagePlan(gs, ['yt']);
    expect(plan.start.map((g) => g.id)).toEqual(['ads']);
    expect(plan.optional.map((g) => g.id).sort()).toEqual(['delete', 'pause-history']);
  });

  it('spreads "Start hier" across services and caps it at three', () => {
    const gs = [
      guide('a1', 'a', { impact: 'high' }),
      guide('a2', 'a', { impact: 'high' }),
      guide('b1', 'b', { impact: 'medium' }),
      guide('c1', 'c', { impact: 'medium', minutes: 10 }),
      guide('d1', 'd', { impact: 'low' }),
    ];
    const plan = stagePlan(gs, ['a', 'b', 'c', 'd']);
    expect(plan.start.map((g) => g.id)).toEqual(['a1', 'b1', 'c1']);
    expect(plan.next.map((g) => g.id)).toContain('a2');
    expect(plan.total).toBe(5);
  });

  it('without a selection offers only a starter set', () => {
    const plan = stagePlan([guide('a', 'google', { impact: 'high' }), guide('b', 'whatsapp', { impact: 'high' })], []);
    expect(plan.start).toHaveLength(2);
    expect(plan.next).toEqual([]);
    expect(plan.optional).toEqual([]);
  });

  it('without a selection draws the starter set from widely used apps only', () => {
    const plan = stagePlan([guide('a', 'google', { impact: 'medium' }), guide('b', 'spotify', { impact: 'high' })], []);
    expect(plan.start.map((g) => g.id)).toEqual(['a']);
  });
});
