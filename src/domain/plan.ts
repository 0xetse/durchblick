/**
 * Time buckets for guides (shown on the service pages). The prioritised
 * "Mein Plan" lives in priority.ts (stagePlan).
 */
import type { GuideCard } from './client-types';

export const BUCKETS = ['quick', 'important', 'cleanup', 'advanced'] as const;
export type Bucket = (typeof BUCKETS)[number];

export function bucketOf(g: Pick<GuideCard, 'minutes' | 'kind'>): Bucket {
  if (g.kind === 'deletion' || g.kind === 'export') return 'advanced';
  if (g.minutes <= 5) return 'quick';
  if (g.minutes <= 30) return 'important';
  if (g.minutes <= 60) return 'cleanup';
  return 'advanced';
}
