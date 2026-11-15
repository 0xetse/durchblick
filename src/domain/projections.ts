/** Server-side projections from the content bundle to island props. */
import type { CompanyCard, GuideCard, ServiceCard, SourceCard } from './client-types';
import { getContent, refId } from './content';
import type { SourceRefInput } from './schema';
import type { SimRule, SimSignal } from './simulator';
import type { DataCategory } from './schema';
import { localizeUrl, type Locale } from '~/i18n';

/** Resolves source references into serialisable cards (deduplicated). */
export function sourceCards(refs: readonly SourceRefInput[]): SourceCard[] {
  const { sources } = getContent();
  const ids = [...new Set(refs.map(refId))];
  return ids.flatMap((id) => {
    const s = sources.get(id);
    return s
      ? [{ title: s.title, publisher: s.publisher, url: s.url, tier: s.tier, type: s.type, retrievedAt: s.retrievedAt, language: s.language }]
      : [];
  });
}

export function serviceCards(locale: Locale = 'de'): ServiceCard[] {
  const { services, companies } = getContent(locale);
  return services.map((s) => ({
    id: s.id,
    name: s.name,
    company: s.company,
    companyName: companies.find((c) => c.id === s.company)?.name ?? s.company,
    category: s.category,
    shortName: s.shortName ?? s.name,
    summary: s.summary,
    surprise: s.surprise.text,
    surpriseSources: sourceCards(s.surprise.sources),
    surpriseAction: s.surprise.action,
    points: s.dataPoints.map((d) => ({ service: s.id, category: d.category, title: d.title, provenance: d.provenance })),
    categories: [...new Set(s.dataPoints.map((d) => d.category))] as DataCategory[],
    offplatform: s.dataPoints.some((d) => d.category === 'offplatform'),
    adFunded: s.assessment.adUse.level >= 3,
    linkedWith: s.linkedWith,
  }));
}

export function guideCards(locale: Locale = 'de'): GuideCard[] {
  const { guides, services } = getContent(locale);
  return guides.map((g) => ({
    id: g.id,
    service: g.service,
    serviceName: (() => {
      const s = services.find((x) => x.id === g.service);
      return s?.shortName ?? s?.name ?? g.service;
    })(),
    kind: g.kind,
    title: g.title,
    goal: g.goal,
    whyItMatters: g.whyItMatters,
    whatChanges: g.whatChanges,
    whatDoesNotChange: g.whatDoesNotChange,
    impact: g.impact,
    minutes: g.minutes,
    difficulty: g.difficulty,
    officialUrl: g.officialUrl ? localizeUrl(g.officialUrl, locale) : undefined,
    platforms: g.platforms,
    steps: g.steps,
    status: g.verification.status,
    checkedAt: g.verification.checkedAt,
    tradeOff: g.tradeOff,
    sources: sourceCards(g.sources),
  }));
}

export function companyCards(locale: Locale = 'de'): CompanyCard[] {
  return getContent(locale).companies.map((c) => ({ id: c.id, name: c.name, description: c.description }));
}

export function simulatorProps(locale: Locale = 'de'): { signals: SimSignal[]; rules: SimRule[] } {
  const { simulator, sources, guides } = getContent(locale);
  return {
    signals: simulator.signals,
    rules: simulator.inferences.map((r) => ({
      id: r.id,
      title: r.title,
      explanation: r.explanation,
      requires: r.requires,
      level: r.level,
      sensitive: r.sensitive,
      action: (() => {
        const g = r.action ? guides.find((x) => x.id === r.action) : undefined;
        return g ? { id: g.id, title: g.title } : undefined;
      })(),
      sources: r.sources.flatMap((ref) => {
        const s = sources.get(refId(ref));
        return s ? [{ title: s.title, publisher: s.publisher, url: s.url }] : [];
      }),
    })),
  };
}
