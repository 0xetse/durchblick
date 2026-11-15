/**
 * "Mein Fußabdruck": an educational assessment computed purely from the
 * services a person selects. Runs in the browser; nothing is sent anywhere.
 */
import type { CompanyCard, GuideCard, ServiceCard } from './client-types';
import { DATA_CATEGORIES, type DataCategory } from './schema';

export interface Theme {
  id: 'same-company' | 'ad-funded' | 'offplatform' | 'location' | 'prompts';
  serviceIds: string[];
  companyId?: string;
}

export interface Footprint {
  services: ServiceCard[];
  companies: { company: CompanyCard; services: ServiceCard[] }[];
  /** category -> ids of selected services that collect it, in DATA_CATEGORIES order */
  matrix: { category: DataCategory; serviceIds: string[] }[];
  themes: Theme[];
  levers: GuideCard[];
}

const impactRank = { high: 0, medium: 1, low: 2 } as const;

export function rankGuides(a: GuideCard, b: GuideCard): number {
  return impactRank[a.impact] - impactRank[b.impact] || a.minutes - b.minutes || a.title.localeCompare(b.title, 'de');
}

export function computeFootprint(
  selectedIds: readonly string[],
  allServices: readonly ServiceCard[],
  companies: readonly CompanyCard[],
  guides: readonly GuideCard[],
): Footprint {
  const selected = new Set(selectedIds);
  const services = allServices.filter((s) => selected.has(s.id));
  const byCompany = new Map<string, ServiceCard[]>();
  for (const s of services) byCompany.set(s.company, [...(byCompany.get(s.company) ?? []), s]);

  const companyList = [...byCompany.entries()]
    .map(([id, list]) => ({
      company: companies.find((c) => c.id === id) ?? { id, name: list[0]?.companyName ?? id, description: '' },
      services: list,
    }))
    .sort((a, b) => b.services.length - a.services.length || a.company.name.localeCompare(b.company.name, 'de'));

  const matrix = DATA_CATEGORIES.map((category) => ({
    category,
    serviceIds: services.filter((s) => s.categories.includes(category)).map((s) => s.id),
  })).filter((row) => row.serviceIds.length > 0);

  const themes: Theme[] = [];
  for (const { company, services: list } of companyList) {
    if (list.length >= 2) themes.push({ id: 'same-company', companyId: company.id, serviceIds: list.map((s) => s.id) });
  }
  const pick = (pred: (s: ServiceCard) => boolean) => services.filter(pred).map((s) => s.id);
  const adFunded = pick((s) => s.adFunded);
  if (adFunded.length >= 2) themes.push({ id: 'ad-funded', serviceIds: adFunded });
  const off = pick((s) => s.offplatform);
  if (off.length >= 1) themes.push({ id: 'offplatform', serviceIds: off });
  const loc = pick((s) => s.categories.includes('location'));
  if (loc.length >= 2) themes.push({ id: 'location', serviceIds: loc });
  // Only dedicated AI assistants: an AI feature inside a messenger is optional and
  // selecting the messenger does not mean the person uses it.
  const prompts = pick((s) => s.category === 'ai-assistant');
  if (prompts.length >= 1) themes.push({ id: 'prompts', serviceIds: prompts });

  // Biggest levers: the best-ranked guide per service first, then fill up.
  const relevant = guides.filter((g) => selected.has(g.service) && g.kind !== 'deletion').sort(rankGuides);
  const levers: GuideCard[] = [];
  const seenService = new Set<string>();
  for (const g of relevant) {
    if (levers.length >= 3) break;
    if (!seenService.has(g.service)) {
      levers.push(g);
      seenService.add(g.service);
    }
  }
  for (const g of relevant) {
    if (levers.length >= 3) break;
    if (!levers.includes(g)) levers.push(g);
  }

  return { services, companies: companyList, matrix, themes, levers };
}
