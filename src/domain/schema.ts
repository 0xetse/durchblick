/**
 * Content model for Durchblick.
 *
 * All privacy knowledge lives in /content as YAML and is validated against
 * these schemas at build time and in tests. Components never hard-code facts.
 *
 * Design rules (see docs/content/content-model.md):
 * - Every factual statement carries `sources` (ids into /content/sources).
 * - Provenance (how data is obtained) and certainty (how sure we are) are
 *   separate fields and must never be collapsed into one another.
 * - Structural fields are language-neutral ids; text fields are German for the
 *   MVP. Other locales will be added as overlay files keyed by the same ids
 *   (ADR-0004).
 */
import { z } from 'zod';

// No eval-based fast path: the CSP forbids eval, and zod's feature probe for it
// would otherwise log a CSP violation in every browser that loads the schemas.
z.config({ jitless: true });
import { AREAS, type AreaId } from './areas';

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids must be kebab-case');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
const text = z.string().trim().min(1);
/** https only, written out in full, without user name or password in it. */
const httpsUrl = z.url({ protocol: /^https$/ }).refine((u) => {
  const url = new URL(u);
  return u.startsWith('https://') && !url.username && !url.password;
}, 'Nur vollständige https://-Adressen ohne Zugangsdaten');

/** A reference to a source, optionally with a note on what exactly it supports. */
export const sourceRefSchema = z.union([
  id,
  z.object({ ref: id, note: text.optional() }).strict(),
]);
export type SourceRefInput = z.infer<typeof sourceRefSchema>;
const sources = z.array(sourceRefSchema).min(1);

// ---------------------------------------------------------------------------
// Taxonomies (labels live in src/i18n, never in content files)
// ---------------------------------------------------------------------------

export const DATA_CATEGORIES = [
  'account',
  'content',
  'communications',
  'activity',
  'searches',
  'contacts',
  'device',
  'location',
  'purchases',
  'offplatform',
  'voice',
  'prompts',
] as const;
export const dataCategorySchema = z.enum(DATA_CATEGORIES);
export type DataCategory = z.infer<typeof dataCategorySchema>;

/** How data reaches the service. */
export const MECHANISMS = [
  'provided',
  'usage',
  'device',
  'permissions',
  'partners',
  'other-users',
  'derived',
] as const;
export const mechanismSchema = z.enum(MECHANISMS);
export type Mechanism = z.infer<typeof mechanismSchema>;

/**
 * Provenance of a data point (what kind of data it is):
 * provided = you entered it; observed = recorded while you use the service;
 * derived = computed from other data in a near-deterministic way (e.g. rough
 * location from an IP address).
 */
export const PROVENANCE = ['provided', 'observed', 'derived'] as const;
export const provenanceSchema = z.enum(PROVENANCE);
export type Provenance = z.infer<typeof provenanceSchema>;

/**
 * Evidence for a data-point claim:
 * stated = the provider says so in its own documentation (Tier 1);
 * technical = unavoidable for the service to work (e.g. IP address), backed by
 *   technical documentation; research = shown by independent research.
 */
export const EVIDENCE = ['stated', 'technical', 'research'] as const;
export const evidenceSchema = z.enum(EVIDENCE);
export type Evidence = z.infer<typeof evidenceSchema>;

/**
 * Inference certainty:
 * documented = the provider documents that it estimates this kind of trait;
 * possible = technically plausible from the data, NOT documented for this
 *   provider. Must never be presented as fact.
 */
export const INFERENCE_LEVELS = ['documented', 'possible'] as const;
export const inferenceLevelSchema = z.enum(INFERENCE_LEVELS);
export type InferenceLevel = z.infer<typeof inferenceLevelSchema>;

export const PURPOSES = [
  'provide-service',
  'personalisation',
  'advertising',
  'measurement',
  'safety',
  'product-development',
  'ai-training',
  'legal',
] as const;
export const purposeSchema = z.enum(PURPOSES);

export const CATEGORIES = [
  'search',
  'video',
  'social',
  'messaging',
  'shopping',
  'ai-assistant',
  'browser',
  'email',
  'maps',
  'cloud',
  'music',
  'payments',
] as const;
export const serviceCategorySchema = z.enum(CATEGORIES);
export type ServiceCategory = z.infer<typeof serviceCategorySchema>;

// ---------------------------------------------------------------------------
// Assessment ("Datenprofil") — see docs/content/assessment-methodology.md
// ---------------------------------------------------------------------------

/** Exposure dimensions: higher level = more data exposure. */
export const EXPOSURE_DIMENSIONS = [
  'breadth',
  'sensitivity',
  'observation',
  'linkability',
  'adUse',
  'sharing',
] as const;
/** Control dimensions: higher level = more control for the user. */
export const CONTROL_DIMENSIONS = ['defaults', 'controls', 'deletion', 'reachability'] as const;
export const DIMENSIONS = [...EXPOSURE_DIMENSIONS, ...CONTROL_DIMENSIONS] as const;
export type ExposureDimension = (typeof EXPOSURE_DIMENSIONS)[number];
export type ControlDimension = (typeof CONTROL_DIMENSIONS)[number];
export type Dimension = (typeof DIMENSIONS)[number];

export const CONFIDENCE = ['high', 'medium', 'low'] as const;
export const confidenceSchema = z.enum(CONFIDENCE);
export type Confidence = z.infer<typeof confidenceSchema>;

export const ratingSchema = z
  .object({
    level: z.number().int().min(1).max(4),
    rationale: text,
    confidence: confidenceSchema,
    sources,
  })
  .strict();
export type Rating = z.infer<typeof ratingSchema>;

const assessmentShape = Object.fromEntries(DIMENSIONS.map((d) => [d, ratingSchema])) as Record<
  Dimension,
  typeof ratingSchema
>;
export const assessmentSchema = z.object(assessmentShape).strict();

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

export const sourceSchema = z
  .object({
    id,
    title: text,
    publisher: text,
    url: httpsUrl,
    /** 1 = official/regulator/law, 2 = research/major journalism, 3 = secondary */
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    type: z.enum([
      'privacy-policy',
      'help-center',
      'official-docs',
      'transparency-report',
      'regulator',
      'law',
      'court',
      'research',
      'journalism',
      'secondary',
    ]),
    retrievedAt: isoDate,
    region: z.enum(['EU', 'DE', 'global', 'US']).default('EU'),
    language: z.string().min(2).max(5).optional(),
    note: text.optional(),
  })
  .strict();
export type Source = z.infer<typeof sourceSchema>;

export const companySchema = z
  .object({
    id,
    name: text,
    legalEntityEU: text.optional(),
    headquarters: text,
    description: text,
    sources,
  })
  .strict();
export type Company = z.infer<typeof companySchema>;

export const dataPointSchema = z
  .object({
    id,
    category: dataCategorySchema,
    /** Level 1: one plain sentence. */
    title: text,
    /** Level 2: examples. */
    detail: text,
    /** Level 3: technical explanation (optional). */
    technical: text.optional(),
    provenance: provenanceSchema,
    mechanisms: z.array(mechanismSchema).min(1),
    evidence: evidenceSchema,
    /** e.g. "nur wenn du den Kontakt-Upload aktivierst" */
    condition: text.optional(),
    sources,
  })
  .strict();
export type DataPoint = z.infer<typeof dataPointSchema>;

export const inferenceSchema = z
  .object({
    id,
    title: text,
    detail: text,
    level: inferenceLevelSchema,
    /** ids of data points this could be based on */
    basedOn: z.array(id).min(1),
    sources,
  })
  .strict();
export type Inference = z.infer<typeof inferenceSchema>;

export const purposeEntrySchema = z
  .object({ purpose: purposeSchema, detail: text, sources })
  .strict();

export const sharingSchema = z
  .object({ id, recipient: text, detail: text, sources })
  .strict();

export const journeyStepSchema = z
  .object({
    id,
    title: text,
    detail: text,
    /** data point ids flowing through this step */
    dataPoints: z.array(id).default([]),
    sources: z.array(sourceRefSchema).default([]),
  })
  .strict();
export type JourneyStep = z.infer<typeof journeyStepSchema>;

export const serviceSchema = z
  .object({
    id,
    name: text,
    /** Short name for headings, e.g. "Google" for "Google Konto & Google Suche". */
    shortName: text.optional(),
    company: id,
    category: serviceCategorySchema,
    url: httpsUrl,
    /** Level 1 summary, max ~2 sentences. */
    summary: text.max(280),
    /** One surprising but defensible fact. */
    /** `action`: id of a guide of this service that addresses the fact. */
    surprise: z.object({ text, sources, action: id.optional() }).strict(),
    businessModel: z.object({ text, sources }).strict(),
    dataPoints: z.array(dataPointSchema).min(3),
    inferences: z.array(inferenceSchema).default([]),
    purposes: z.array(purposeEntrySchema).min(1),
    sharing: z.array(sharingSchema).default([]),
    retention: z.object({ text, sources }).strict(),
    journey: z.array(journeyStepSchema).min(3),
    assessment: assessmentSchema,
    /** id of the alternatives category, if any */
    alternatives: id.optional(),
    /** Ids of other services this one is commonly linked with (same account etc.). */
    linkedWith: z.array(id).default([]),
    region: z.enum(['EU', 'DE']).default('EU'),
    reviewedAt: isoDate,
  })
  .strict();
export type Service = z.infer<typeof serviceSchema>;

/**
 * setting = change a setting (incl. deleting a specific data set such as uploaded
 * contacts); review = look something up; deletion = delete the whole account or
 * channel; export = download your data; permission = app/OS permission.
 */
export const GUIDE_KINDS = ['setting', 'review', 'deletion', 'export', 'permission'] as const;

export const guideSchema = z
  .object({
    id,
    service: id,
    kind: z.enum(GUIDE_KINDS),
    title: text,
    /** One sentence: what you achieve. */
    goal: text,
    whyItMatters: text,
    whatChanges: text,
    whatDoesNotChange: text,
    impact: z.enum(['high', 'medium', 'low']),
    minutes: z.number().int().min(1).max(240),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    platforms: z.array(z.enum(['web', 'android', 'ios', 'desktop-app'])).min(1),
    /** Direct link to the official setting page, if one exists. */
    officialUrl: httpsUrl.optional(),
    /** Step-by-step instructions; only if confirmed by an official source. */
    steps: z.array(text).default([]),
    /** Data point ids this guide affects. */
    affects: z.array(id).default([]),
    /**
     * What you give up in convenience (e.g. "Keine Empfehlungen mehr auf der
     * Startseite"). Guides with a trade-off are never in "Start hier".
     */
    tradeOff: text.optional(),
    region: z.enum(['EU', 'DE', 'global']).default('EU'),
    verification: z
      .object({
        status: z.enum(['verified', 'needs-verification']),
        /** date the instructions were last checked against the official source */
        checkedAt: isoDate,
        method: text,
      })
      .strict(),
    sources,
  })
  .strict();
export type Guide = z.infer<typeof guideSchema>;

export const alternativeProductSchema = z
  .object({
    id,
    name: text,
    provider: text,
    jurisdiction: text,
    businessModel: text,
    price: text,
    openSource: z.enum(['yes', 'partial', 'no']),
    encryption: text,
    dataCollection: text,
    strengths: z.array(text).min(1),
    tradeOffs: z.array(text).min(1),
    switchingEffort: z.enum(['low', 'medium', 'high']),
    switchingNote: text,
    url: httpsUrl,
    sources,
    needsVerification: z.boolean().default(false),
  })
  .strict();
export type AlternativeProduct = z.infer<typeof alternativeProductSchema>;

export const alternativeCategorySchema = z
  .object({
    id,
    title: text,
    einordnung: text,
    /** What you can achieve without switching. */
    withoutSwitching: text,
    incumbent: alternativeProductSchema,
    alternatives: z.array(alternativeProductSchema).min(1),
    reviewedAt: isoDate,
  })
  .strict();
export type AlternativeCategory = z.infer<typeof alternativeCategorySchema>;

// Inference simulator ("Fünf harmlose Spuren") --------------------------------

export const signalSchema = z
  .object({
    id,
    label: text,
    /** what this looks like from the platform's perspective */
    observedAs: text,
    provenance: provenanceSchema,
    theme: id,
  })
  .strict();

export const simulatorInferenceSchema = z
  .object({
    id,
    title: text,
    explanation: text,
    /** inference fires when ALL of these signals are selected */
    requires: z.array(id).min(1),
    level: z.enum(['derived', 'documented', 'possible']),
    /** sensitive topics are shown with an extra note on legal limits */
    sensitive: z.boolean().default(false),
    /** guide id that limits the underlying data, shown as "Was du tun kannst" */
    action: id.optional(),
    sources,
  })
  .strict();

export const simulatorSchema = z
  .object({
    intro: text,
    signals: z.array(signalSchema).min(5),
    inferences: z.array(simulatorInferenceSchema).min(5),
    takeaways: z.array(z.object({ text, sources }).strict()).min(1),
    reviewedAt: isoDate,
  })
  .strict();
export type Simulator = z.infer<typeof simulatorSchema>;

// ---------------------------------------------------------------------------
// Real-world cases ("Warum das wichtig ist")
// ---------------------------------------------------------------------------

/** A documented case that shows what happens with app data in real life. */
export const exampleSchema = z
  .object({
    id,
    /** Plain-language headline: what happened, in one line. */
    title: text,
    year: z.number().int().min(2000).max(2100),
    /** Life area from "Dein Datenmuster" this case is about. */
    area: z.enum(AREAS.map((a) => a.id) as [AreaId, ...AreaId[]]),
    /** What happened – 2–3 short sentences, only sourced facts. */
    happened: text,
    /** What it means for you – one or two sentences, no alarmism. */
    meaning: text,
    /** Guide that addresses it, if one exists. */
    action: id.optional(),
    sources,
  })
  .strict();
export type Example = z.infer<typeof exampleSchema>;
