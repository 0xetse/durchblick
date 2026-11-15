/**
 * "Woher wissen wir das?" – evidence behind a statement, collapsed by default.
 * Each source is one compact citation row: type · publisher – title ↗ · date.
 * English readers get a "(in German)" marker for German-language sources.
 */
import type { SourceCard } from '~/domain/client-types';
import { dict, type Locale } from '~/i18n';

const TXT_DE = {
  summary: 'Woher wissen wir das?',
  count: (n: number) => (n === 1 ? '1 Quelle' : `${n} Quellen`),
  external: ' (externe Seite)',
  tier: { 1: 'Primärquelle', 2: 'Forschung/Recherche', 3: 'ergänzend' } as Record<1 | 2 | 3, string>,
  retrieved: 'abgerufen',
  checked: (d: string) => `Zuletzt geprüft ${d}. `,
  /** marker for sources in a language the reader may not read; empty in German */
  inGerman: '',
};
const TXT_EN: typeof TXT_DE = {
  summary: 'How do we know?',
  count: (n) => (n === 1 ? '1 source' : `${n} sources`),
  external: ' (external site)',
  tier: { 1: 'Primary source', 2: 'Research/investigation', 3: 'Supplementary' },
  retrieved: 'retrieved',
  checked: (d) => `Last checked ${d}. `,
  inGerman: '(in German)',
};

export function Evidence({
  sources,
  checkedAt,
  confidence,
  locale = 'de',
}: {
  sources: SourceCard[];
  checkedAt?: string;
  confidence?: string;
  locale?: Locale;
}) {
  if (sources.length === 0) return null;
  const t = dict(locale);
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  return (
    <details class="evidence">
      <summary>
        {s.summary} <span class="meta">{s.count(sources.length)}</span>
      </summary>
      <ul class="cites">
        {sources.map((src) => (
          <li key={src.url}>
            <span class="cite-type" title={t.sourceTypes[src.type] ?? src.type}>
              {t.sourceTypesShort[src.type] ?? src.type}
            </span>
            <a href={src.url} target="_blank" rel="noopener noreferrer">
              {src.publisher} – {src.title} ↗<span class="visually-hidden">{s.external}</span>
            </a>
            {src.language === 'de' && s.inGerman && <span class="meta">{s.inGerman}</span>}
            <span class="meta">
              {s.tier[src.tier]} · {s.retrieved} {src.retrievedAt}
            </span>
          </li>
        ))}
      </ul>
      {(checkedAt || confidence) && (
        <p class="meta">
          {checkedAt && <>{s.checked(checkedAt)}</>}
          {confidence}
        </p>
      )}
    </details>
  );
}
