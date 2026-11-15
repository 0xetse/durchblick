import { useState } from 'preact/hooks';
import type { Locale } from '~/i18n';

interface Step {
  id: string;
  title: string;
  detail: string;
  dataPoints: string[];
}
interface Point {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
}

const TXT_DE = {
  filter: 'Wähle eine Art von Daten und sieh, wo sie überall vorkommt:',
  hits: (label: string, hits: number, total: number) => `„${label}“ kommt bei ${hits} von ${total} Stationen vor.`,
  journey: (service: string) => `Datenreise bei ${service}`,
  you: 'Du',
  youDetail: 'Mit deinem Gerät, deinem Konto und deinem Verhalten.',
  contains: ' (enthält die gewählte Datenart)',
};
const TXT_EN: typeof TXT_DE = {
  filter: 'Choose a kind of data and see everywhere it appears:',
  hits: (label, hits, total) => `“${label}” appears at ${hits} of ${total} ${total === 1 ? 'stage' : 'stages'}.`,
  journey: (service) => `Data journey at ${service}`,
  you: 'You',
  youDetail: 'With your device, your account and your behaviour.',
  contains: ' (contains the selected kind of data)',
};

/**
 * The "Datenreise": how data moves from you through the service's systems.
 * Server-rendered as a complete ordered list; JS only adds the filter.
 */
export default function DataJourney({
  steps,
  points,
  serviceName,
  locale = 'de',
}: {
  steps: Step[];
  points: Point[];
  serviceName: string;
  locale?: Locale;
}) {
  const txt = locale === 'en' ? TXT_EN : TXT_DE;
  // Filter by data category (few, short chips) rather than by single data point.
  const [active, setActive] = useState<string | null>(null);
  const used = points.filter((p) => steps.some((s) => s.dataPoints.includes(p.id)));
  const categories = [...new Map(used.map((p) => [p.category, p.categoryLabel])).entries()];
  const idsOf = (cat: string) => used.filter((p) => p.category === cat).map((p) => p.id);
  const carries = (s: Step, cat: string) => idsOf(cat).some((id) => s.dataPoints.includes(id));
  const activeLabel = categories.find(([c]) => c === active)?.[1];
  const hits = active ? steps.filter((s) => carries(s, active)).length : 0;

  return (
    <div class="journey">
      {used.length > 0 && (
        <div class="journey-filter">
          <p class="small" id="journey-filter-label">
            {txt.filter}
          </p>
          <ul class="chips" aria-labelledby="journey-filter-label">
            {categories.map(([cat, label]) => (
              <li key={cat}>
                <button
                  type="button"
                  class={`chip chip-small ${active === cat ? 'is-on' : ''}`}
                  aria-pressed={active === cat}
                  onClick={() => setActive(active === cat ? null : cat)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <p class="small muted" role="status">
            {activeLabel ? txt.hits(activeLabel, hits, steps.length) : ''}
          </p>
        </div>
      )}
      <ol class="journey-steps" aria-label={txt.journey(serviceName)}>
        <li class="journey-step journey-you">
          <span class="journey-node" aria-hidden="true" />
          <div>
            <strong>{txt.you}</strong>
            <p class="small muted">{txt.youDetail}</p>
          </div>
        </li>
        {steps.map((s, i) => {
          const on = active ? carries(s, active) : false;
          return (
            <li key={s.id} class={`journey-step ${active ? (on ? 'is-hit' : 'is-dim') : ''}`}>
              <span class="journey-node" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <strong>{s.title}</strong>
                {on && <span class="visually-hidden">{txt.contains}</span>}
                <p class="small">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
