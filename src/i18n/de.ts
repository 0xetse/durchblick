/**
 * German UI strings and taxonomy labels. Content facts live in /content;
 * this file holds only interface language. A new locale adds a sibling file
 * with the same shape (enforced by the `Dictionary` type).
 */
import type {
  ControlDimension,
  DataCategory,
  Dimension,
  Evidence,
  ExposureDimension,
  InferenceLevel,
  Mechanism,
  Provenance,
  ServiceCategory,
} from '~/domain/schema';

export const de = {
  locale: 'de-DE',
  site: {
    name: 'Durchblick',
    tagline: 'Was Apps über dich erfahren – und was du tun kannst.',
    description:
      'Durchblick zeigt verständlich und mit Quellen, welche Daten Dienste wie Google, Instagram, TikTok oder ChatGPT erfassen, was sich daraus ableiten lässt und welche Einstellungen wirklich etwas ändern. Ohne Konto, ohne Mitverfolgen.',
  },
  nav: {
    settings: 'Einstellungen ändern',
    services: 'Apps',
    why: 'Warum wichtig?',
    check: 'Meine Apps im Detail',
    plan: 'Mein Plan',
    traces: 'Spuren',
    alternatives: 'Alternativen',
    methodology: 'Methodik',
    transparency: 'Transparenz',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    menu: 'Menü',
    skip: 'Zum Inhalt springen',
    trustBadge: 'Keine Tracker',
    trustBadgeLong: 'Diese Seite: keine Cookies, keine Tracker – prüf es nach',
    /** Language switch: label of the OTHER language, in that language. */
    switchTo: 'English',
    switchToLabel: 'This page in English',
    here: 'Du bist hier',
    start: 'Start',
    main: 'Hauptnavigation',
    homeLabel: 'Startseite',
  },
  footer: {
    about: 'Unabhängige, belegte Informationen zum Datenschutz im Alltag. Keine Rechtsberatung, keine Affiliate-Links, kein Tracking.',
    contentDate: 'Stand der Inhalte',
  },
  areas: {
    identity: { label: 'Identität', title: 'Wer du bist', hint: 'Name, Alter, E-Mail, Telefonnummer, Profil' },
    interests: { label: 'Interessen', title: 'Was dich interessiert', hint: 'Was du ansiehst, likest, wie lange du hinschaust' },
    questions: { label: 'Fragen', title: 'Was du suchst und fragst', hint: 'Suchanfragen und Eingaben an KI' },
    people: { label: 'Kontakte', title: 'Mit wem du zu tun hast', hint: 'Adressbuch, Freunde, Nachrichten' },
    places: { label: 'Orte', title: 'Wo du bist', hint: 'Ungefähr über deine Internet-Verbindung, genau über GPS' },
    purchases: { label: 'Käufe', title: 'Was du kaufst', hint: 'Bestellungen, Zahlungen, angesehene Produkte' },
    devices: { label: 'Geräte', title: 'Womit du online bist', hint: 'Handy, Browser, Netzwerk' },
    elsewhere: { label: 'Anderswo', title: 'Was du anderswo tust', hint: 'Informationen von fremden Websites und Apps' },
    shared: { label: 'Inhalte', title: 'Was du teilst', hint: 'Fotos, Beiträge, Sprachaufnahmen' },
  },
  /** Plain-language description of a source, by type. */
  sourceTypes: {
    'privacy-policy': 'Datenschutzerklärung des Anbieters',
    'help-center': 'Offizielle Hilfeseite des Anbieters',
    'official-docs': 'Offizielle Dokumentation des Anbieters',
    'transparency-report': 'Transparenzbericht des Anbieters',
    regulator: 'Datenschutz- oder Aufsichtsbehörde',
    law: 'Gesetzestext',
    court: 'Gericht',
    research: 'Wissenschaftliche Studie',
    journalism: 'Journalistische Recherche',
    secondary: 'Sekundärquelle',
  } as Record<string, string>,
  /** Compact source-type labels for citation rows. */
  sourceTypesShort: {
    'privacy-policy': 'Richtlinie',
    'help-center': 'Hilfeseite',
    'official-docs': 'Doku',
    'transparency-report': 'Transparenz',
    regulator: 'Behörde',
    law: 'Gesetz',
    court: 'Gericht',
    research: 'Studie',
    journalism: 'Recherche',
    secondary: 'Sekundär',
  } as Record<string, string>,
  questions: {
    what: 'Was erfahren sie?',
    how: 'Wie erfahren sie es?',
    meaning: 'Was bedeutet das?',
    action: 'Was kannst du tun?',
  },
  categories: {
    account: 'Konto & Profil',
    content: 'Deine Inhalte',
    communications: 'Nachrichten',
    activity: 'Nutzungsverhalten',
    searches: 'Suchanfragen',
    contacts: 'Kontakte & Beziehungen',
    device: 'Gerät & Verbindung',
    location: 'Standort',
    purchases: 'Käufe & Zahlungen',
    offplatform: 'Aktivität außerhalb des Dienstes',
    voice: 'Sprachaufnahmen',
    prompts: 'Eingaben an KI',
  } satisfies Record<DataCategory, string>,
  mechanisms: {
    provided: 'Du gibst es selbst ein',
    usage: 'Entsteht bei der Nutzung',
    device: 'Vom Gerät übermittelt',
    permissions: 'Über App-Berechtigungen',
    partners: 'Von Partnern und Werbekunden',
    'other-users': 'Von anderen Nutzern',
    derived: 'Vom Dienst berechnet',
  } satisfies Record<Mechanism, string>,
  mechanismsShort: {
    provided: 'Von dir selbst',
    usage: 'Aus deiner Nutzung',
    device: 'Von deinem Gerät',
    permissions: 'Über App-Freigaben',
    partners: 'Von anderen Firmen',
    'other-users': 'Von anderen Nutzern',
    derived: 'Selbst berechnet',
  } satisfies Record<Mechanism, string>,
  provenance: {
    provided: { label: 'Angegeben', hint: 'Du hast es selbst eingegeben.' },
    observed: { label: 'Beobachtet', hint: 'Wird aufgezeichnet, während du den Dienst nutzt.' },
    derived: { label: 'Berechnet', hint: 'Wird aus anderen Daten ermittelt, z. B. ungefährer Ort aus der IP-Adresse (der Internet-Adresse deines Anschlusses).' },
  } satisfies Record<Provenance, { label: string; hint: string }>,
  evidence: {
    stated: { label: 'Laut Anbieter', hint: 'Der Anbieter nennt das selbst in seiner Dokumentation.' },
    technical: { label: 'Technisch zwangsläufig', hint: 'Fällt technisch zwingend an, damit der Dienst funktioniert.' },
    research: { label: 'Laut Forschung', hint: 'Durch unabhängige Forschung belegt.' },
  } satisfies Record<Evidence, { label: string; hint: string }>,
  inference: {
    documented: { label: 'Vom Anbieter beschrieben', hint: 'Der Anbieter dokumentiert, dass er solche Merkmale einschätzt.' },
    possible: { label: 'Möglich, nicht belegt', hint: 'Technisch denkbar. Nicht dokumentiert, dass dieser Anbieter das tut.' },
    derived: { label: 'Direkt ableitbar', hint: 'Ergibt sich fast zwangsläufig aus den Daten.' },
  } satisfies Record<InferenceLevel | 'derived', { label: string; hint: string }>,
  /** Labels used by the simulator, where no single provider is meant. */
  simLevels: {
    derived: { label: 'Direkt ableitbar', hint: 'Ergibt sich fast zwangsläufig aus den Daten.' },
    documented: { label: 'Von Werbeplattformen dokumentiert', hint: 'Große Plattformen beschreiben selbst, dass sie solche Merkmale oder Zielgruppen einschätzen.' },
    possible: { label: 'Möglich, nicht belegt', hint: 'Technisch denkbar. Nicht als Praxis eines bestimmten Anbieters dokumentiert.' },
  },
  serviceCategories: {
    search: 'Suche',
    video: 'Video',
    social: 'Soziale Netzwerke',
    messaging: 'Messenger',
    shopping: 'Shopping',
    'ai-assistant': 'KI-Assistenten',
    browser: 'Browser',
    email: 'E-Mail',
    maps: 'Karten',
    cloud: 'Cloud-Speicher',
    music: 'Musik & Podcasts',
    payments: 'Bezahlen',
  } satisfies Record<ServiceCategory, string>,
  purposes: {
    'provide-service': 'Dienst bereitstellen',
    personalisation: 'Inhalte personalisieren',
    advertising: 'Werbung',
    measurement: 'Messung & Analyse',
    safety: 'Sicherheit & Missbrauchsschutz',
    'product-development': 'Produktentwicklung',
    'ai-training': 'KI-Training',
    legal: 'Rechtliche Pflichten',
  },
  dimensions: {
    breadth: { label: 'Umfang', question: 'Wie viele Arten von Daten fallen an?' },
    sensitivity: { label: 'Wie privat', question: 'Wie privat ist, was typischerweise anfällt?' },
    observation: { label: 'Aufzeichnung', question: 'Wie genau wird dein Verhalten aufgezeichnet?' },
    linkability: { label: 'Verknüpfung', question: 'Wie weit werden Daten über Dienste und Websites hinweg verbunden?' },
    adUse: { label: 'Nutzung für Werbung', question: 'Wie zentral sind Daten über dich für das Geschäftsmodell?' },
    sharing: { label: 'Weitergabe', question: 'Wer bekommt außerdem Zugriff?' },
    defaults: { label: 'Voreinstellungen', question: 'Wie wenig wird ab Werk gesammelt?' },
    controls: { label: 'Einstellungen', question: 'Lässt sich das Wichtigste abschalten oder begrenzen?' },
    deletion: { label: 'Löschen & Export', question: 'Kommst du an deine Daten – und wieder raus?' },
    reachability: { label: 'Auffindbarkeit', question: 'Wie leicht findest du die Einstellungen?' },
  } satisfies Record<Dimension, { label: string; question: string }>,
  exposureLevels: ['gering', 'mittel', 'hoch', 'sehr hoch'] as const,
  controlLevels: ['gering', 'eingeschränkt', 'gut', 'sehr gut'] as const,
  confidence: { high: 'gut belegt', medium: 'teilweise eingeordnet', low: 'vorläufig' },
  groups: {
    exposure: 'Wie viel gibst du preis?',
    control: 'Wie viel Kontrolle hast du?',
  },
  plan: {
    buckets: {
      quick: { title: '5 Minuten', subtitle: 'Schnelle Wirkung' },
      important: { title: '30 Minuten', subtitle: 'Wichtige Einstellungen' },
      cleanup: { title: '1 Stunde', subtitle: 'Aufräumen' },
      advanced: { title: 'Weitergehend', subtitle: 'Export, Löschen, Wechsel' },
    },
    impact: { high: 'große Wirkung', medium: 'mittlere Wirkung', low: 'kleine Wirkung' },
    impactShort: { high: 'hoch', medium: 'mittel', low: 'gering' },
    difficulty: { easy: 'einfach', medium: 'mittel', hard: 'aufwendig' },
    kinds: {
      setting: 'Einstellung',
      review: 'Nachsehen',
      deletion: 'Löschen',
      export: 'Export',
      permission: 'Berechtigung',
    },
  },
  freshness: {
    verified: 'Geprüft am',
    needsVerification: 'Schritte noch nicht geprüft',
    stale: 'Möglicherweise veraltet',
  },
} as const;

/** Same shape as `de`, with any string allowed (for other locales). */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;
export type Dictionary = Widen<typeof de>;
export type ExposureLevelLabel = (typeof de.exposureLevels)[number];
export type { ControlDimension, ExposureDimension };

/** Formats an ISO date (YYYY-MM-DD) for display. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString(de.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
