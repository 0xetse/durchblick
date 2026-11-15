import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Badge, Glyph } from '~/components/Glyph';
import { evaluate, type SimRule, type SimSignal } from '~/domain/simulator';
import { dict, href, type Locale } from '~/i18n';

interface Props {
  signals: SimSignal[];
  rules: SimRule[];
  /** compact = homepage teaser (fewer details, link to full page) */
  compact?: boolean;
  initial?: string[];
  locale?: Locale;
  /** language of a source by its URL, e.g. { 'https://…': 'de' } – marks German sources for English readers */
  sourceLanguages?: Record<string, string>;
}

const TXT_DE = {
  step1: 'Tippe an, was auf dich zutreffen könnte. Alles bleibt in deinem Browser.',
  tapSome: 'Tippe ein paar Spuren an',
  latest: (title: string) => `Neu: ${title}`,
  traces: (n: number) => `${n} ${n === 1 ? 'Spur' : 'Spuren'}`,
  inferences: (n: number) => `${n} ${n === 1 ? 'Einschätzung' : 'Einschätzungen'}`,
  inferencesWord: (n: number): string => (n === 1 ? 'Einschätzung' : 'Einschätzungen'),
  reset: 'Zurücksetzen',
  emptyStep2: 'Hier erscheint, was ein Empfehlungs- oder Werbesystem daraus schließen könnte.',
  resultStep2: (traces: number, inferences: number) =>
    `Aus ${traces} ${traces === 1 ? 'Spur' : 'Spuren'} ${
      inferences === 1 ? 'ergibt sich 1 Einschätzung' : `ergeben sich ${inferences} Einschätzungen`
    }:`,
  from: 'aus:',
  sensitive:
    'Sensibles Thema: In der EU dürfen große Online-Plattformen Werbung nicht nach einem Profil auswählen, das auf solchen besonders geschützten Daten beruht. Technisch möglich bleibt der Schluss trotzdem.',
  action: 'Was du tun kannst:',
  source: 'Beleg:',
  external: ' (öffnet externe Seite)',
  inGerman: '',
  more: (n: number) => `… und ${n} weitere.`,
  near: (signal: string, rule: string) => `Kombiniert wird es stärker: Mit „${signal}“ käme „${rule}“ dazu.`,
};
const TXT_EN: typeof TXT_DE = {
  step1: 'Tap whatever might apply to you. Everything stays in your browser.',
  tapSome: 'Tap a few traces',
  latest: (title) => `New: ${title}`,
  traces: (n) => `${n} ${n === 1 ? 'trace' : 'traces'}`,
  inferences: (n) => `${n} ${n === 1 ? 'conclusion' : 'conclusions'}`,
  inferencesWord: (n) => (n === 1 ? 'conclusion' : 'conclusions'),
  reset: 'Reset',
  emptyStep2: 'This is where you will see what a recommendation or advertising system could conclude from them.',
  resultStep2: (traces, inferences) =>
    `${traces} ${traces === 1 ? 'trace leads' : 'traces lead'} to ${inferences} ${inferences === 1 ? 'conclusion' : 'conclusions'}:`,
  from: 'from:',
  sensitive:
    'Sensitive topic: in the EU, large online platforms may not choose adverts based on a profile that relies on such specially protected data. The conclusion is still technically possible.',
  action: 'What you can do:',
  source: 'Source:',
  external: ' (opens external site)',
  inGerman: ' (in German)',
  more: (n) => `… and ${n} more.`,
  near: (signal, rule) => `Combined, it gets stronger: with “${signal}”, “${rule}” would be added.`,
};

const levelGlyph = { derived: 'derived', documented: 'documented', possible: 'possible' } as const;

export default function Spuren({ signals, rules, compact = false, initial = [], locale = 'de', sourceLanguages = {} }: Props) {
  const t = dict(locale);
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  const result = useMemo(() => evaluate(selected, rules), [selected, rules]);
  // Announce the newest conclusion in the sticky bar, so phone users see the
  // effect of each tap without scrolling.
  const prevFired = useRef<Set<string>>(new Set());
  const [latest, setLatest] = useState<string | null>(null);
  useEffect(() => {
    const now = new Set(result.fired.map((r) => r.id));
    const added = result.fired.find((r) => !prevFired.current.has(r.id));
    setLatest((prev) => (added ? added.title : result.fired.some((r) => r.title === prev) ? prev : null));
    prevFired.current = now;
  }, [result]);
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Constellation geometry: signals on a ring, inferences as links between them.
  const n = signals.length;
  const pos = new Map(
    signals.map((s, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [s.id, { x: 100 + Math.cos(a) * 78, y: 100 + Math.sin(a) * 78 }] as const;
    }),
  );
  const labelOf = (id: string) => signals.find((s) => s.id === id)?.label ?? id;
  const shown = compact ? result.fired.slice(0, 3) : result.fired;

  return (
    <div class={`spuren ${compact ? 'is-compact' : ''}`}>
      <div class="spuren-pick">
        <p class="spuren-step" id="spuren-step-1">
          <strong>1.</strong> {s.step1}
        </p>
        <ul class="chips" aria-labelledby="spuren-step-1">
          {signals.map((sig) => {
            const on = selected.has(sig.id);
            return (
              <li key={sig.id}>
                <button
                  type="button"
                  class={`chip ${on ? 'is-on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(sig.id)}
                >
                  <span class="chip-dot" aria-hidden="true" />
                  {sig.label}
                </button>
              </li>
            );
          })}
        </ul>
        <div class="spuren-live">
          <a href="#spuren-results" class="spuren-live-count">
            {selected.size === 0
              ? s.tapSome
              : latest
                ? s.latest(latest)
                : `${s.traces(selected.size)} → ${s.inferences(result.fired.length)}`}
          </a>
          {selected.size > 0 && (
            <button type="button" class="btn btn-quiet small" onClick={() => setSelected(new Set())}>
              {s.reset}
            </button>
          )}
        </div>
      </div>

      <div class="spuren-out">
        <figure class="constellation" aria-hidden="true">
          <svg viewBox="0 0 200 200" role="presentation">
            <circle cx="100" cy="100" r="78" class="ring" />
            {result.fired.map((r) =>
              r.requires.length === 1 ? null : (
                <polyline
                  key={r.id}
                  class={`link link-${r.level}`}
                  points={[...r.requires, r.requires[0] as string]
                    .slice(0, r.requires.length === 2 ? 2 : undefined)
                    .map((id) => `${pos.get(id)?.x},${pos.get(id)?.y}`)
                    .join(' ')}
                />
              ),
            )}
            {signals.map((sig) => {
              const p = pos.get(sig.id);
              const on = selected.has(sig.id);
              const linked = result.fired.some((r) => r.requires.includes(sig.id));
              return (
                <circle
                  key={sig.id}
                  cx={p?.x}
                  cy={p?.y}
                  r={on ? (linked ? 7 : 5.5) : 3.2}
                  class={`node ${on ? 'on' : ''} ${linked ? 'linked' : ''}`}
                />
              );
            })}
            <text x="100" y="98" class="count" text-anchor="middle">
              {result.fired.length}
            </text>
            <text x="100" y="114" class="count-label" text-anchor="middle">
              {s.inferencesWord(result.fired.length)}
            </text>
          </svg>
        </figure>

        <div class="spuren-results" id="spuren-results" aria-live="polite">
          <p class="spuren-step">
            <strong>2.</strong>{' '}
            {selected.size === 0 ? s.emptyStep2 : s.resultStep2(selected.size, result.fired.length)}
          </p>
          {shown.length > 0 && (
            <ol class="inferences">
              {shown.map((r) => (
                <li key={r.id} class={`inference level-${r.level}`}>
                  <div class="inference-head">
                    <span class="inference-title">{r.title}</span>
                    <Badge kind={levelGlyph[r.level]} label={t.simLevels[r.level].label} hint={t.simLevels[r.level].hint} />
                  </div>
                  <p class="inference-basis small muted">
                    {s.from} {r.requires.map(labelOf).join(' + ')}
                  </p>
                  {!compact && <p class="small">{r.explanation}</p>}
                  {!compact && r.sensitive && (
                    <p class="small sensitive-note">{s.sensitive}</p>
                  )}
                  {!compact && r.action && (
                    <p class="small rule-action">
                      <strong>{s.action}</strong> <a href={href(locale, 'guide', r.action.id)}>{r.action.title}</a>
                    </p>
                  )}
                  {!compact && r.sources.length > 0 && (
                    <p class="small sources-inline">
                      {s.source}{' '}
                      {r.sources.map((src, i) => (
                        <>
                          {i > 0 && ' · '}
                          <a href={src.url} rel="noopener noreferrer" target="_blank">
                            {src.publisher}: {src.title}
                            {sourceLanguages[src.url] === 'de' && s.inGerman}
                            <span class="visually-hidden">{s.external}</span>
                          </a>
                        </>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
          {compact && result.fired.length > shown.length && (
            <p class="small">{s.more(result.fired.length - shown.length)}</p>
          )}
          {!compact && result.near.length > 0 && result.fired.length < 6 && (
            <p class="small muted near">
              {s.near(labelOf(result.near[0]!.missing), result.near[0]!.rule.title)}
            </p>
          )}
          <p class="legend small muted">
            <span><Glyph kind="derived" /> {t.simLevels.derived.label}</span>
            <span><Glyph kind="documented" /> {t.simLevels.documented.label}</span>
            <span><Glyph kind="possible" /> {t.simLevels.possible.label}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
