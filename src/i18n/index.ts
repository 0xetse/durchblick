/**
 * Locales, routes and locale-aware helpers. German is the source language and
 * lives at the root; English lives under /en/ with English path segments
 * (ADR-0004). Structure (ids, ratings, sources) exists once – only text differs.
 */
import { de, type Dictionary } from './de';
import { en } from './en';
import { parseCalendarDate, type CalendarDate } from '~/domain/dates';

export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'de';

const DICTS: Record<Locale, Dictionary> = { de, en };
export const dict = (locale: Locale): Dictionary => DICTS[locale];

/** Every route, per locale. Detail routes (app, guide) take an id. */
export const ROUTES = {
  home: { de: '/', en: '/en/' },
  settings: { de: '/einstellungen/', en: '/en/settings/' },
  plan: { de: '/plan/', en: '/en/plan/' },
  apps: { de: '/dienste/', en: '/en/apps/' },
  why: { de: '/warum/', en: '/en/why/' },
  check: { de: '/check/', en: '/en/my-apps/' },
  alternatives: { de: '/alternativen/', en: '/en/alternatives/' },
  traces: { de: '/spuren/', en: '/en/traces/' },
  methodology: { de: '/methodik/', en: '/en/methodology/' },
  transparency: { de: '/transparenz/', en: '/en/transparency/' },
  imprint: { de: '/impressum/', en: '/en/legal-notice/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/' },
  /** /dienste/<id>/ */
  app: { de: '/dienste/', en: '/en/apps/' },
  /** /anleitungen/<id>/ */
  guide: { de: '/anleitungen/', en: '/en/guides/' },
} as const satisfies Record<string, Record<Locale, string>>;
export type RouteKey = keyof typeof ROUTES;

/** Path of a route in a locale, e.g. href('en', 'app', 'google') → /en/apps/google/ */
export function href(locale: Locale, key: RouteKey, id?: string): string {
  const base = ROUTES[key][locale];
  return id ? `${base}${id}/` : base;
}

export function localeOf(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de';
}

/**
 * The same page in the other locale. Matches the longest known route prefix,
 * so /dienste/google/ ↔ /en/apps/google/. Unknown paths fall back to home.
 */
export function switchPath(pathname: string, to: Locale): string {
  const from = localeOf(pathname);
  if (from === to) return pathname;
  const candidates = Object.values(ROUTES)
    .map((r) => ({ from: r[from], to: r[to] }))
    .sort((a, b) => b.from.length - a.from.length);
  for (const c of candidates) {
    if (pathname === c.from) return c.to;
    if (c.from !== ROUTES.home[from] && pathname.startsWith(c.from)) return c.to + pathname.slice(c.from.length);
  }
  return ROUTES.home[to];
}

/**
 * Official provider links point to German help pages where that was checked.
 * For English, switch to the provider's English page where the pattern is
 * known and stable; everything else is returned unchanged.
 */
export function localizeUrl(url: string, locale: Locale): string {
  if (locale === 'de') return url;
  return url
    .replace('://help.snapchat.com/hc/de/', '://help.snapchat.com/hc/en-us/')
    .replace('://values.snap.com/de-DE/', '://values.snap.com/')
    .replace(/:\/\/telegram\.org\/faq\/de(#.*)?$/, '://telegram.org/faq')
    .replace(/([?&])hl=de\b/, '$1hl=en');
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The span of the documented reviews, e.g. "zwischen 07.10. und 11.11.2026" /
 * "between 7 Oct and 11 Nov 2026". The year is repeated only when it differs;
 * a single day reads "am 11.11.2026" / "on 11 Nov 2026". Fixed formats, so the
 * output does not depend on the ICU data of the build machine.
 */
export function formatReviewRange(range: { from: string; to: string }, locale: Locale = DEFAULT_LOCALE): string {
  const from = parseCalendarDate(range.from);
  const to = parseCalendarDate(range.to);
  if (!from || !to) throw new Error(`invalid review range: ${range.from} – ${range.to}`);
  if (range.from > range.to) throw new Error(`review range ends before it starts: ${range.from} – ${range.to}`);
  const pad = (n: number) => String(n).padStart(2, '0');
  const de = (d: CalendarDate, withYear: boolean) => `${pad(d.day)}.${pad(d.month)}.${withYear ? d.year : ''}`;
  const en = (d: CalendarDate, withYear: boolean) => `${d.day} ${MONTHS_EN[d.month - 1]}${withYear ? ` ${d.year}` : ''}`;
  const fmt = locale === 'en' ? en : de;
  if (range.from === range.to) return locale === 'en' ? `on ${fmt(to, true)}` : `am ${fmt(to, true)}`;
  const sameYear = from.year === to.year;
  return locale === 'en' ? `between ${fmt(from, !sameYear)} and ${fmt(to, true)}` : `zwischen ${fmt(from, !sameYear)} und ${fmt(to, true)}`;
}

/** Formats an ISO date (YYYY-MM-DD) for display. */
export function formatDate(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString(dict(locale).locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
