import { describe, expect, it } from 'vitest';
import { medianLevel, summarise } from '~/domain/assessment';
import type { GuideCard, ServiceCard } from '~/domain/client-types';
import { computeFootprint } from '~/domain/footprint';
import { freshness, monthsBetween } from '~/domain/freshness';
import { bucketOf } from '~/domain/plan';
import { evaluate, type SimRule } from '~/domain/simulator';
import { hashFromSelection, selectionFromHash } from '~/domain/selection';
import { DIMENSIONS, type Rating } from '~/domain/schema';

const rating = (level: number, confidence: Rating['confidence'] = 'high'): Rating => ({
  level,
  rationale: 'x',
  confidence,
  sources: ['s'],
});

const svc = (id: string, company: string, extra: Partial<ServiceCard> = {}): ServiceCard => ({
  id,
  name: id.toUpperCase(),
  company,
  companyName: company,
  category: 'social',
  shortName: id,
  summary: '',
  surprise: '',
  surpriseSources: [],
  points: [],
  categories: ['account', 'activity'],
  offplatform: false,
  adFunded: false,
  linkedWith: [],
  ...extra,
});

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

describe('assessment', () => {
  it('uses an ordinal median, never an average', () => {
    expect(medianLevel([1, 1, 4])).toBe(1);
    expect(medianLevel([1, 4])).toBe(4);
    expect(medianLevel([2, 3, 3, 4, 4, 4])).toBe(4);
  });

  it('summarises groups separately and flags provisional ratings', () => {
    const a = Object.fromEntries(DIMENSIONS.map((d) => [d, rating(2)])) as Record<(typeof DIMENSIONS)[number], Rating>;
    a.linkability = rating(4);
    a.deletion = rating(1, 'low');
    const s = summarise(a);
    expect(s.topExposure).toEqual(['linkability']);
    expect(s.weakControls).toContain('deletion');
    expect(s.provisional).toBe(true);
    expect(s).not.toHaveProperty('score');
  });
});

describe('footprint', () => {
  const services = [
    svc('instagram', 'meta', { adFunded: true, offplatform: true, categories: ['activity', 'location'] }),
    svc('facebook', 'meta', { adFunded: true, categories: ['activity', 'contacts', 'location'] }),
    svc('chatgpt', 'openai', { category: 'ai-assistant', categories: ['prompts'] }),
  ];
  const companies = [
    { id: 'meta', name: 'Meta', description: '' },
    { id: 'openai', name: 'OpenAI', description: '' },
  ];
  const guides = [
    guide('ig-ads', 'instagram', { impact: 'high' }),
    guide('fb-ads', 'facebook', { impact: 'high', minutes: 10 }),
    guide('fb-delete', 'facebook', { kind: 'deletion', impact: 'high' }),
    guide('gpt-train', 'chatgpt', { impact: 'medium' }),
  ];

  it('only reflects the selected services', () => {
    const fp = computeFootprint(['chatgpt'], services, companies, guides);
    expect(fp.services.map((s) => s.id)).toEqual(['chatgpt']);
    expect(fp.matrix).toEqual([{ category: 'prompts', serviceIds: ['chatgpt'] }]);
  });

  it('detects cross-service themes', () => {
    const fp = computeFootprint(['instagram', 'facebook', 'chatgpt'], services, companies, guides);
    const ids = fp.themes.map((t) => t.id);
    expect(ids).toContain('same-company');
    expect(ids).toContain('ad-funded');
    expect(ids).toContain('offplatform');
    expect(ids).toContain('location');
    expect(ids).toContain('prompts');
    expect(fp.companies[0]?.company.id).toBe('meta');
  });

  it('picks levers across services and never suggests deletion as a lever', () => {
    const fp = computeFootprint(['instagram', 'facebook', 'chatgpt'], services, companies, guides);
    expect(fp.levers.map((g) => g.id)).toEqual(['ig-ads', 'fb-ads', 'gpt-train']);
  });

  it('is empty for no selection', () => {
    const fp = computeFootprint([], services, companies, guides);
    expect(fp.services).toHaveLength(0);
    expect(fp.themes).toHaveLength(0);
  });
});

describe('plan', () => {
  it('buckets by time, deletion/export always advanced', () => {
    expect(bucketOf({ minutes: 3, kind: 'setting' })).toBe('quick');
    expect(bucketOf({ minutes: 20, kind: 'setting' })).toBe('important');
    expect(bucketOf({ minutes: 45, kind: 'review' })).toBe('cleanup');
    expect(bucketOf({ minutes: 90, kind: 'setting' })).toBe('advanced');
    expect(bucketOf({ minutes: 2, kind: 'deletion' })).toBe('advanced');
    expect(bucketOf({ minutes: 2, kind: 'export' })).toBe('advanced');
  });

});

describe('simulator', () => {
  const rules: SimRule[] = [
    { id: 'r1', title: 'one', explanation: '', requires: ['a'], level: 'documented', sensitive: false, sources: [] },
    { id: 'r2', title: 'two', explanation: '', requires: ['a', 'b'], level: 'possible', sensitive: false, sources: [] },
    { id: 'r3', title: 'three', explanation: '', requires: ['a', 'b', 'c'], level: 'derived', sensitive: false, sources: [] },
  ];
  it('fires rules only when all signals are present, strongest first', () => {
    expect(evaluate(new Set(), rules).fired).toEqual([]);
    expect(evaluate(new Set(['a', 'b']), rules).fired.map((r) => r.id)).toEqual(['r2', 'r1']);
    expect(evaluate(new Set(['a', 'b', 'c']), rules).fired.map((r) => r.id)).toEqual(['r3', 'r2', 'r1']);
  });
  it('suggests rules that miss exactly one signal', () => {
    const near = evaluate(new Set(['a']), rules).near;
    expect(near.map((n) => [n.rule.id, n.missing])).toEqual([['r2', 'b']]);
  });
});

describe('freshness', () => {
  it('computes whole months', () => {
    expect(monthsBetween('2026-01-15', '2026-07-14')).toBe(5);
    expect(monthsBetween('2026-01-15', '2026-07-15')).toBe(6);
  });
  it('marks old checks as stale and keeps unverified as unverified', () => {
    expect(freshness('verified', '2026-01-01', '2026-10-07')).toBe('stale');
    expect(freshness('verified', '2026-09-01', '2026-10-07')).toBe('verified');
    expect(freshness('needs-verification', '2026-10-07', '2026-10-07')).toBe('needs-verification');
  });
});

describe('selection hash', () => {
  it('round-trips and ignores unknown or malicious ids', () => {
    expect(selectionFromHash(hashFromSelection(['google', 'tiktok']), ['google', 'tiktok'])).toEqual(['google', 'tiktok']);
    expect(selectionFromHash('#d=google,evil<script>,google', ['google'])).toEqual(['google']);
    expect(selectionFromHash('#x=1', ['google'])).toEqual([]);
  });
});
