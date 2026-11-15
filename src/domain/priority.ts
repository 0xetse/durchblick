/**
 * "Mein Plan" prioritisation (V2). Deliberately simple and explainable – it is
 * shown to users on /plan/ and documented in docs/product/action-plan-methodology.md.
 * No "risk reduction" percentages: we have no scientific basis for them.
 */
import type { GuideCard } from './client-types';

export const STAGES = ['start', 'next', 'optional'] as const;
export type Stage = (typeof STAGES)[number];

const impactPoints = { high: 3, medium: 2, low: 1 } as const;

/** Higher = earlier. Impact counts most, then low effort, then verified steps. */
export function priority(g: GuideCard): number {
  const effort = g.minutes <= 5 ? 2 : g.minutes <= 15 ? 1 : 0;
  // Impact ×4 so that effort (max 2) and verification (1) only break ties within an impact level.
  return impactPoints[g.impact] * 4 + effort + (g.status === 'verified' ? 1 : 0);
}

/** Changes that cost convenience or are drastic are always optional. */
export function isOptional(g: GuideCard): boolean {
  return Boolean(g.tradeOff) || g.kind === 'deletion' || g.kind === 'export';
}

export function byPriority(a: GuideCard, b: GuideCard): number {
  return priority(b) - priority(a) || a.minutes - b.minutes || a.title.localeCompare(b.title, 'de');
}

export interface StagedPlan {
  start: GuideCard[];
  next: GuideCard[];
  optional: GuideCard[];
  total: number;
}

/** Widely used apps the starter set draws from when nothing is selected. */
export const COMMON_SERVICES = ['google', 'whatsapp', 'instagram', 'youtube', 'amazon', 'facebook', 'tiktok', 'chatgpt'];

/**
 * Start hier: up to three high-priority, convenience-neutral changes, spread
 * across services. Without a selection, the starter set comes from widely used apps.
 */
export function stagePlan(guides: readonly GuideCard[], selected: readonly string[], startSize = 3): StagedPlan {
  const scope = selected.length ? selected : COMMON_SERVICES;
  const pool = guides.filter((g) => scope.includes(g.service)).sort(byPriority);
  const candidates = pool.filter((g) => !isOptional(g) && g.impact !== 'low');
  const start: GuideCard[] = [];
  const used = new Set<string>();
  for (const g of candidates) {
    if (start.length >= startSize) break;
    if (!used.has(g.service)) {
      start.push(g);
      used.add(g.service);
    }
  }
  for (const g of candidates) {
    if (start.length >= startSize) break;
    if (!start.includes(g)) start.push(g);
  }
  if (!selected.length) return { start, next: [], optional: [], total: start.length };
  const next = pool.filter((g) => !isOptional(g) && !start.includes(g));
  const optional = pool.filter((g) => isOptional(g));
  return { start, next, optional, total: pool.length };
}
