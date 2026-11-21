/**
 * Build-time content loader. Reads YAML from /content, validates it against the
 * schemas and checks referential integrity. Imported ONLY from Astro pages and
 * tests (server side) — never from client islands, so no YAML parser ships to
 * the browser.
 */
import { parse } from 'yaml';
import type { Locale } from '~/i18n';
import { isCalendarDate } from './dates';
import { z } from 'zod';
import {
  alternativeCategorySchema,
  companySchema,
  exampleSchema,
  guideSchema,
  serviceSchema,
  simulatorSchema,
  sourceSchema,
  type AlternativeCategory,
  type Company,
  type Example,
  type Guide,
  type Service,
  type Simulator,
  type Source,
  type SourceRefInput,
} from './schema';

type RawFiles = Record<string, string>;

const serviceFiles = import.meta.glob<string>('/content/services/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const guideFiles = import.meta.glob<string>('/content/guides/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const sourceFiles = import.meta.glob<string>('/content/sources/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
});
/** English text overlays (ADR-0004): same structure as the German files, prose translated. */
const overlayFiles = import.meta.glob<string>('/content/i18n/*/**/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const singleFiles = import.meta.glob<string>(
  ['/content/companies.yaml', '/content/alternatives.yaml', '/content/simulator.yaml', '/content/examples.yaml'],
  { eager: true, query: '?raw', import: 'default' },
);

export class ContentError extends Error {
  override name = 'ContentError';
}

/**
 * Keys whose values are structure, not prose: never taken from an overlay.
 * `note` holds verbatim citations from the (often German) source.
 */
const FROZEN_KEYS = new Set([
  'id', 'ref', 'url', 'officialUrl', 'service', 'company', 'category', 'kind', 'impact', 'difficulty',
  'provenance', 'evidence', 'status', 'region', 'area', 'action', 'level', 'checkedAt', 'reviewedAt',
  'retrievedAt', 'note', 'theme', 'requires', 'basedOn', 'dataPoints', 'mechanisms', 'platforms', 'affects',
  'linkedWith', 'alternatives', 'purpose', 'sources', 'year', 'minutes', 'tier', 'type', 'language',
  'certainty', 'confidence', 'rating', 'adUse', 'shortName', 'publisher',
]);
const STRUCTURAL = /^([a-z0-9][a-z0-9._/-]*|https?:\/\/\S+|\d{4}-\d{2}-\d{2})$/;

/**
 * Differences between a German file and its overlay that are not translations:
 * other keys, list lengths, types, or a changed id/enum/URL/date/citation.
 */
export function overlayProblems(base: unknown, overlay: unknown, path = '$', key?: string): string[] {
  if (typeof base !== typeof overlay || Array.isArray(base) !== Array.isArray(overlay)) return [`${path}: type differs`];
  if (Array.isArray(base)) {
    const o = overlay as unknown[];
    if (base.length !== o.length) return [`${path}: ${base.length} vs ${o.length} entries`];
    return base.flatMap((b, i) => overlayProblems(b, o[i], `${path}[${i}]`, key));
  }
  if (base && typeof base === 'object') {
    const a = Object.keys(base);
    const b = Object.keys(overlay as object);
    if (a.join('|') !== b.join('|')) return [`${path}: keys differ`];
    return a.flatMap((k) => overlayProblems((base as Record<string, unknown>)[k], (overlay as Record<string, unknown>)[k], `${path}.${k}`, k));
  }
  if (typeof base === 'string') {
    const frozen = (key && FROZEN_KEYS.has(key)) || STRUCTURAL.test(base);
    return frozen && base !== overlay ? [`${path}: "${base}" must not change`] : [];
  }
  return base === overlay ? [] : [`${path}: value differs`];
}

/** German structure with prose from the overlay (only where overlayProblems allows it). */
function applyOverlay(base: unknown, overlay: unknown, key?: string): unknown {
  if (Array.isArray(base)) return base.map((b, i) => applyOverlay(b, (overlay as unknown[])[i], key));
  if (base && typeof base === 'object') {
    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, applyOverlay(v, (overlay as Record<string, unknown>)[k], k)]),
    );
  }
  if (typeof base === 'string' && typeof overlay === 'string' && !(key && FROZEN_KEYS.has(key)) && !STRUCTURAL.test(base)) {
    return overlay;
  }
  return base;
}

function parseFile<T>(path: string, raw: string, schema: z.ZodType<T>, overlayRaw?: string): T {
  let data: unknown;
  try {
    data = parse(raw);
  } catch (error) {
    throw new ContentError(`${path}: invalid YAML – ${(error as Error).message}`);
  }
  if (overlayRaw !== undefined) {
    let overlay: unknown;
    try {
      overlay = parse(overlayRaw);
    } catch (error) {
      throw new ContentError(`overlay for ${path}: invalid YAML – ${(error as Error).message}`);
    }
    const problems = overlayProblems(data, overlay);
    if (problems.length) throw new ContentError(`overlay for ${path}:\n- ${problems.slice(0, 10).join('\n- ')}`);
    data = applyOverlay(data, overlay);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentError(`${path}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export interface ContentBundle {
  services: Service[];
  guides: Guide[];
  sources: Map<string, Source>;
  companies: Company[];
  alternatives: AlternativeCategory[];
  simulator: Simulator;
  examples: Example[];
}

/**
 * Every documented review or check date in the content: apps (`reviewedAt`),
 * guides (`verification.checkedAt`), alternatives (`reviewedAt`) and the
 * traces experiment (`simulator.reviewedAt`). Only these fields – nothing
 * from the build – so technical changes never move them.
 */
export function reviewDates(b: ContentBundle): string[] {
  return [
    ...b.services.map((s) => s.reviewedAt),
    ...b.guides.map((g) => g.verification.checkedAt),
    ...b.alternatives.map((a) => a.reviewedAt),
    b.simulator.reviewedAt,
  ];
}

export interface ReviewRange {
  /** Oldest documented review date (YYYY-MM-DD). */
  from: string;
  /** Most recent documented review date (YYYY-MM-DD). */
  to: string;
}

/**
 * Oldest and most recent documented review date. This is the span of the
 * individual reviews, not the date of a full editorial review of everything.
 * Fails on an impossible date so a typo cannot reach the footer.
 */
export function contentReviewRange(b: ContentBundle): ReviewRange {
  const dates = reviewDates(b);
  if (dates.length === 0) throw new Error('content has no review dates');
  const invalid = dates.filter((d) => !isCalendarDate(d));
  if (invalid.length) throw new Error(`invalid review date(s): ${[...new Set(invalid)].join(', ')}`);
  // Valid ISO dates sort correctly as strings.
  const sorted = [...dates].sort();
  return { from: sorted[0]!, to: sorted[sorted.length - 1]! };
}

/** Most recent date anything was reviewed or checked: apps, guides, alternatives, simulator. */
export function contentAsOf(b: ContentBundle): string {
  return contentReviewRange(b).to;
}

export function refId(ref: SourceRefInput): string {
  return typeof ref === 'string' ? ref : ref.ref;
}

/** Loads and validates the given raw files. Exposed for tests. */
export function buildBundle(files: {
  services: RawFiles;
  guides: RawFiles;
  sources: RawFiles;
  single: RawFiles;
  /** Overlay per German path (e.g. "/content/services/google.yaml"), if a locale is wanted. */
  overlays?: RawFiles;
}): ContentBundle {
  const ov = (p: string) => files.overlays?.[p];
  const services = Object.entries(files.services).map(([p, raw]) => {
    const service = parseFile(p, raw, serviceSchema, ov(p));
    const expected = p.split('/').pop()?.replace(/\.yaml$/, '');
    if (service.id !== expected) {
      throw new ContentError(`${p}: id "${service.id}" must match file name "${expected}"`);
    }
    return service;
  });
  const guides = Object.entries(files.guides).flatMap(([p, raw]) =>
    parseFile(p, raw, z.array(guideSchema), ov(p)),
  );
  const sourceList = Object.entries(files.sources).flatMap(([p, raw]) =>
    parseFile(p, raw, z.array(sourceSchema)),
  );
  const single = (name: string) => {
    const entry = Object.entries(files.single).find(([p]) => p.endsWith(name));
    if (!entry) throw new ContentError(`missing /content/${name}`);
    return entry;
  };
  const [cp, craw] = single('companies.yaml');
  const [ap, araw] = single('alternatives.yaml');
  const [sp, sraw] = single('simulator.yaml');
  const companies = parseFile(cp, craw, z.array(companySchema), ov(cp));
  const alternatives = parseFile(ap, araw, z.array(alternativeCategorySchema), ov(ap));
  const simulator = parseFile(sp, sraw, simulatorSchema, ov(sp));
  const [ep, eraw] = single('examples.yaml');
  const examples = parseFile(ep, eraw, z.array(exampleSchema), ov(ep));

  const sources = new Map<string, Source>();
  for (const s of sourceList) {
    if (sources.has(s.id)) throw new ContentError(`duplicate source id "${s.id}"`);
    sources.set(s.id, s);
  }

  const bundle: ContentBundle = {
    services: services.sort((a, b) => a.name.localeCompare(b.name, 'de')),
    guides,
    sources,
    companies,
    alternatives,
    simulator,
    examples,
  };
  const problems = checkIntegrity(bundle);
  if (problems.length > 0) {
    throw new ContentError(`content integrity:\n- ${problems.join('\n- ')}`);
  }
  return bundle;
}

/** Cross-reference checks that a schema alone cannot express. */
export function checkIntegrity(b: ContentBundle): string[] {
  const problems: string[] = [];
  const serviceIds = new Set(b.services.map((s) => s.id));
  const companyIds = new Set(b.companies.map((c) => c.id));
  const altIds = new Set(b.alternatives.map((a) => a.id));
  const unique = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const i of ids) {
      if (seen.has(i)) problems.push(`duplicate ${label} id "${i}"`);
      seen.add(i);
    }
  };
  unique('guide', b.guides.map((g) => g.id));
  unique('company', b.companies.map((c) => c.id));
  unique('alternative category', b.alternatives.map((a) => a.id));

  const checkRefs = (where: string, refs: readonly SourceRefInput[]) => {
    for (const r of refs) {
      if (!b.sources.has(refId(r))) problems.push(`${where}: unknown source "${refId(r)}"`);
    }
  };

  for (const c of b.companies) checkRefs(`company ${c.id}`, c.sources);

  for (const s of b.services) {
    const where = `service ${s.id}`;
    if (!companyIds.has(s.company)) problems.push(`${where}: unknown company "${s.company}"`);
    if (s.alternatives && !altIds.has(s.alternatives)) {
      problems.push(`${where}: unknown alternatives category "${s.alternatives}"`);
    }
    for (const l of s.linkedWith) {
      if (!serviceIds.has(l)) problems.push(`${where}: linkedWith unknown service "${l}"`);
    }
    const dp = new Set<string>();
    for (const d of s.dataPoints) {
      if (dp.has(d.id)) problems.push(`${where}: duplicate data point "${d.id}"`);
      dp.add(d.id);
      checkRefs(`${where}.${d.id}`, d.sources);
    }
    for (const i of s.inferences) {
      checkRefs(`${where}.inference ${i.id}`, i.sources);
      for (const x of i.basedOn) {
        if (!dp.has(x)) problems.push(`${where}.inference ${i.id}: unknown data point "${x}"`);
      }
    }
    for (const j of s.journey) {
      checkRefs(`${where}.journey ${j.id}`, j.sources);
      for (const x of j.dataPoints) {
        if (!dp.has(x)) problems.push(`${where}.journey ${j.id}: unknown data point "${x}"`);
      }
    }
    checkRefs(`${where}.surprise`, s.surprise.sources);
    if (s.surprise.action && !b.guides.some((g) => g.id === s.surprise.action && g.service === s.id)) {
      problems.push(`${where}.surprise: action "${s.surprise.action}" is not a guide of this service`);
    }
    checkRefs(`${where}.businessModel`, s.businessModel.sources);
    checkRefs(`${where}.retention`, s.retention.sources);
    for (const p of s.purposes) checkRefs(`${where}.purpose ${p.purpose}`, p.sources);
    for (const sh of s.sharing) checkRefs(`${where}.sharing ${sh.id}`, sh.sources);
    for (const [dim, r] of Object.entries(s.assessment)) checkRefs(`${where}.assessment.${dim}`, r.sources);
  }

  for (const g of b.guides) {
    const where = `guide ${g.id}`;
    const service = b.services.find((s) => s.id === g.service);
    if (!service) {
      problems.push(`${where}: unknown service "${g.service}"`);
    } else {
      for (const a of g.affects) {
        if (!service.dataPoints.some((d) => d.id === a)) {
          problems.push(`${where}: affects unknown data point "${a}"`);
        }
      }
    }
    checkRefs(where, g.sources);
    if (g.verification.status === 'verified') {
      const tier1 = g.sources.some((r) => b.sources.get(refId(r))?.tier === 1);
      if (!tier1) problems.push(`${where}: verified guides need at least one tier-1 source`);
    }
  }

  for (const a of b.alternatives) {
    for (const p of [a.incumbent, ...a.alternatives]) checkRefs(`alternative ${a.id}.${p.id}`, p.sources);
  }

  const signalIds = new Set(b.simulator.signals.map((s) => s.id));
  for (const i of b.simulator.inferences) {
    checkRefs(`simulator.${i.id}`, i.sources);
    for (const r of i.requires) {
      if (!signalIds.has(r)) problems.push(`simulator.${i.id}: unknown signal "${r}"`);
    }
    if (i.action && !b.guides.some((g) => g.id === i.action)) {
      problems.push(`simulator.${i.id}: unknown action guide "${i.action}"`);
    }
  }
  for (const t of b.simulator.takeaways) checkRefs('simulator.takeaways', t.sources);

  unique('example', b.examples.map((e) => e.id));
  for (const e of b.examples) {
    checkRefs(`example ${e.id}`, e.sources);
    if (e.action && !b.guides.some((g) => g.id === e.action)) {
      problems.push(`example ${e.id}: unknown action guide "${e.action}"`);
    }
  }
  return problems;
}

const cached = new Map<Locale, ContentBundle>();

/** Overlay files of a locale, keyed by the German path they translate. */
export function overlaysFor(locale: Locale): RawFiles {
  const prefix = `/content/i18n/${locale}/`;
  return Object.fromEntries(
    Object.entries(overlayFiles)
      .filter(([p]) => p.startsWith(prefix))
      .map(([p, raw]) => [`/content/${p.slice(prefix.length)}`, raw]),
  );
}

/** The validated content bundle for a locale (cached per build). German is the source. */
export function getContent(locale: Locale = 'de'): ContentBundle {
  let bundle = cached.get(locale);
  if (!bundle) {
    bundle = buildBundle({
      services: serviceFiles,
      guides: guideFiles,
      sources: sourceFiles,
      single: singleFiles,
      ...(locale === 'de' ? {} : { overlays: overlaysFor(locale) }),
    });
    cached.set(locale, bundle);
  }
  return bundle;
}
