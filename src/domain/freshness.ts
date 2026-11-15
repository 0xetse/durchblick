/** Freshness rules for guides and reviews. */
export const STALE_AFTER_MONTHS = 6;

export function monthsBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split('-').map(Number) as [number, number, number];
  const [ty, tm, td] = toIso.split('-').map(Number) as [number, number, number];
  return (ty - fy) * 12 + (tm - fm) - (td < fd ? 1 : 0);
}

export type Freshness = 'verified' | 'stale' | 'needs-verification';

export function freshness(
  status: 'verified' | 'needs-verification',
  checkedAt: string,
  todayIso: string,
): Freshness {
  if (status === 'needs-verification') return 'needs-verification';
  return monthsBetween(checkedAt, todayIso) >= STALE_AFTER_MONTHS ? 'stale' : 'verified';
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
