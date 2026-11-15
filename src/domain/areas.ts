/**
 * Life areas ("Lebensbereiche") – the everyday grouping of data categories
 * used by "Dein Datenmuster". Users think in parts of their life, not in data
 * categories. Every category maps to exactly one area.
 */
import type { DataCategory } from './schema';

export const AREAS = [
  { id: 'identity', categories: ['account'] },
  { id: 'interests', categories: ['activity'] },
  { id: 'questions', categories: ['searches', 'prompts'] },
  { id: 'people', categories: ['contacts', 'communications'] },
  { id: 'places', categories: ['location'] },
  { id: 'purchases', categories: ['purchases'] },
  { id: 'devices', categories: ['device'] },
  { id: 'elsewhere', categories: ['offplatform'] },
  { id: 'shared', categories: ['content', 'voice'] },
] as const satisfies readonly { id: string; categories: readonly DataCategory[] }[];

export type AreaId = (typeof AREAS)[number]['id'];

export function areaOf(category: DataCategory): AreaId {
  const area = AREAS.find((a) => (a.categories as readonly DataCategory[]).includes(category));
  if (!area) throw new Error(`no area for category ${category}`);
  return area.id;
}

export interface AreaPoint {
  service: string;
  category: DataCategory;
  title: string;
  provenance: 'provided' | 'observed' | 'derived';
}

export interface AreaResult {
  id: AreaId;
  /** selected service ids touching this area, in selection order */
  services: string[];
  points: AreaPoint[];
}

/** The touched areas most of the selection reaches: most apps first, then most data types, then AREAS order. */
export function topAreas(results: readonly AreaResult[], n: number): AreaResult[] {
  return results
    .filter((a) => a.services.length > 0)
    .map((a, i) => ({ a, i }))
    .sort((x, y) => y.a.services.length - x.a.services.length || y.a.points.length - x.a.points.length || x.i - y.i)
    .slice(0, n)
    .map(({ a }) => a);
}

/** Areas touched by the selected services, in AREAS order (untouched areas included, empty). */
export function mapAreas(selected: readonly string[], points: readonly AreaPoint[]): AreaResult[] {
  return AREAS.map((a) => {
    const inArea = points.filter(
      (p) => selected.includes(p.service) && (a.categories as readonly DataCategory[]).includes(p.category),
    );
    return {
      id: a.id,
      services: selected.filter((s) => inArea.some((p) => p.service === s)),
      points: inArea,
    };
  });
}
