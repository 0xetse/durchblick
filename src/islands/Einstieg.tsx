/**
 * Homepage entry: a four-step wizard for people new to the topic (see
 * docs/product/icp.md). One question per screen:
 * 1. Which apps do you use? 2. What they can learn (top areas, in words).
 * 3. One sourced fact about one of your apps. 4. One change you can make now.
 * The full instrument (matrix, all areas, all apps) stays on /check/.
 * Computed in the browser from the selection only.
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Evidence } from '~/components/Evidence';
import { mapAreas, topAreas } from '~/domain/areas';
import type { GuideCard, ServiceCard } from '~/domain/client-types';
import { byPriority, isOptional } from '~/domain/priority';
import { useSelection } from './useSelection';
import { dict, href, type Locale } from '~/i18n';

interface Props {
  services: ServiceCard[];
  guides: GuideCard[];
  locale?: Locale;
}

const TXT_DE = {
  step: (n: number, of: number) => `Schritt ${n} von ${of}`,
  /** Names of the four steps, shown under the progress bar. */
  stepNames: ['Apps', 'Was sie erfahren', 'Ein Fakt', 'Ändern'],
  pickTitle: 'Welche Apps nutzt du?',
  pickSub: 'Tippe alle an, die du nutzt.',
  more: (n: number) => `${n} weitere Apps zeigen`,
  next: 'Weiter',
  nextChosen: (n: number) => `Weiter · ${n === 1 ? '1 App' : `${n} Apps`} gewählt`,
  nudge: 'Tippe zuerst mindestens eine App an.',
  and: 'und',
  /** Step 2 heading, split around the highlighted part. */
  learnBefore: (n: number, first: string) => `${n === 1 ? `Deine App ${first}` : `Deine ${n} Apps`} ${n === 1 ? 'kann' : 'können'} etwas über`,
  learnAreas: (touched: number, all: number) => `${touched} von ${all} Bereichen`,
  learnAfter: 'deines Lebens erfahren.',
  topSub: 'Am meisten zusammen kommt hier:',
  at: (names: string) => `bei ${names}`,
  basis:
    'Grundlage sind die eigenen Angaben der Anbieter, die Einteilung in Bereiche ist von uns. Wie viel davon auf dich zutrifft, hängt davon ab, wie du die Apps nutzt.',
  allAreas: 'Alle Bereiche ansehen',
  back: 'Zurück',
  factTitle: 'Das wissen die wenigsten',
  factOf: (i: number, n: number) => `Fakt ${i} von ${n}`,
  anotherFact: 'Noch ein Fakt',
  whatCanIDo: 'Was kann ich tun?',
  actTitle: (m: number) => `Das kannst du in etwa ${m} ${m === 1 ? 'Minute' : 'Minuten'} ändern`,
  changes: 'Das ändert sich',
  stays: 'Das bleibt',
  goodToKnow: 'Gut zu wissen:',
  openSetting: (app: string) => `Einstellung bei ${app} öffnen ↗`,
  external: ' (externe Seite)',
  stepByStep: 'Schritt für Schritt',
  where: 'Wo das geht:',
  platforms: { web: 'Browser (auch am Handy)', android: 'Android-App', ios: 'iPhone-App', 'desktop-app': 'Programm am Computer' } as Record<
    GuideCard['platforms'][number],
    string
  >,
  unverified:
    'Diese Schritte haben wir noch nicht an der offiziellen Hilfe nachgeprüft. Menüs können anders heißen – oder in der EU anders aussehen.',
  firstSteps: 'Deine ersten Schritte',
  after: 'Und danach?',
  planLink: 'Mein Plan: deine wichtigsten Schritte →',
  fullGuide: 'Ganze Anleitung mit Quellen →',
  settingsLink: 'Alle Einstellungen für meine Apps →',
  otherApps: 'Andere Apps wählen',
};
const TXT_EN: typeof TXT_DE = {
  step: (n, of) => `Step ${n} of ${of}`,
  stepNames: ['Apps', 'What they learn', 'One fact', 'Change'],
  pickTitle: 'Which apps do you use?',
  pickSub: 'Tap all the ones you use.',
  more: (n) => `Show ${n} more ${n === 1 ? 'app' : 'apps'}`,
  next: 'Next',
  nextChosen: (n) => `Next · ${n === 1 ? '1 app' : `${n} apps`} selected`,
  nudge: 'Tap at least one app first.',
  and: 'and',
  learnBefore: (n, first) => `${n === 1 ? `Your app ${first}` : `Your ${n} apps`} can learn something about`,
  learnAreas: (touched, all) => `${touched} of ${all} areas`,
  learnAfter: 'of your life.',
  topSub: 'Most of it comes together here:',
  at: (names) => `with ${names}`,
  basis:
    'This is based on what the providers say themselves; the grouping into areas is ours. How much of it applies to you depends on how you use the apps.',
  allAreas: 'See all areas',
  back: 'Back',
  factTitle: 'Few people know this',
  factOf: (i, n) => `Fact ${i} of ${n}`,
  anotherFact: 'Another fact',
  whatCanIDo: 'What can I do?',
  actTitle: (m) => `You can change this in about ${m} ${m === 1 ? 'minute' : 'minutes'}`,
  changes: 'What changes',
  stays: 'What stays the same',
  goodToKnow: 'Good to know:',
  openSetting: (app) => `Open the setting in ${app} ↗`,
  external: ' (external site)',
  stepByStep: 'Step by step',
  where: 'Where this works:',
  platforms: { web: 'browser (also on your phone)', android: 'Android app', ios: 'iPhone app', 'desktop-app': 'computer program' },
  unverified:
    'We have not yet checked these steps against the official help. Menus may have different names – or look different in the EU.',
  firstSteps: 'Your first steps',
  after: 'And then?',
  planLink: 'My plan: your most important steps →',
  fullGuide: 'Full guide with sources →',
  settingsLink: 'All settings for my apps →',
  otherApps: 'Choose other apps',
};

/** Order in which facts are shown: most universally surprising first. */
const WOW_ORDER = ['google', 'whatsapp', 'instagram', 'facebook', 'chatgpt', 'youtube', 'tiktok', 'amazon', 'telegram', 'snapchat', 'spotify', 'linkedin', 'paypal', 'netflix'];
const PICK_ORDER = ['instagram', 'whatsapp', 'google', 'youtube', 'amazon', 'tiktok', 'facebook', 'chatgpt', 'spotify', 'netflix', 'paypal', 'telegram', 'snapchat', 'linkedin'];
/** Apps shown before "Weitere Apps": the most common ones. */
const FIRST = 8;
const STEPS = 4;
/** Key in history.state; same-tab only, never sent anywhere. */
const STEP_KEY = 'durchblickStep';
const asObject = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const stepOf = (state: unknown): number | undefined => {
  const n = asObject(state)[STEP_KEY];
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= STEPS ? n : undefined;
};

/** The given order first, then any app not listed there (e.g. a newly added one). */
const complete = (order: readonly string[], ids: readonly string[]) => [
  ...order.filter((id) => ids.includes(id)),
  ...ids.filter((id) => !order.includes(id)),
];

export default function Einstieg({ services, guides, locale = 'de' }: Props) {
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const t = dict(locale);
  const ids = services.map((s) => s.id);
  const pickOrder = complete(PICK_ORDER, ids);
  const wowOrder = complete(WOW_ORDER, ids);
  const [step, setStep] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [nudge, setNudge] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const moved = useRef(false);
  const expanded = useRef(false);

  const { selected, setSelected } = useSelection(ids, (initial) => {
    if (initial.ids.some((id) => pickOrder.indexOf(id) >= FIRST)) setShowAll(true);
    // The step lives in history.state: a reload or the browser's back button
    // returns to the same screen. A shared link (#d=…) already answers step 1.
    const saved = stepOf(history.state);
    const first = saved ?? (initial.source === 'link' ? 2 : 1);
    setStep(first);
    try {
      history.replaceState({ ...asObject(history.state), [STEP_KEY]: first }, '');
    } catch {
      /* history unavailable */
    }
  });

  useEffect(() => setFactIndex(0), [selected]);

  // Nothing selected (deselected, "Alles löschen", back to an empty entry):
  // the wizard is at step 1 for real, so the next tap does not jump ahead.
  useEffect(() => {
    if (selected.length > 0 || step === 1) return;
    setStep(1);
    try {
      history.replaceState({ ...asObject(history.state), [STEP_KEY]: 1 }, '');
    } catch {
      /* history unavailable */
    }
  }, [selected.length, step]);

  // Browser back/forward walks through the steps. The selection is not part of
  // the step history: going back to step 1 never undoes what was tapped.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const n = stepOf(e.state);
      if (n === undefined) return; // an anchor jump or a hand-edited address, not one of our steps
      moved.current = true;
      setStep(n);
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  // Move focus to the new step's heading so screen readers and keyboards follow along.
  useEffect(() => {
    if (!moved.current) return;
    const h = heading.current;
    if (!h) return;
    h.focus({ preventScroll: true });
    // Bring the new step into view when its heading is hidden under the sticky
    // header or below the first part of the screen (e.g. on phones).
    // Measured on the wizard's top edge (with "Schritt n von 4"), not the heading:
    // after scrolling a long step 1 the heading can be visible while the step
    // indicator above it is under the header (review 2, phase 4).
    const box = h.closest('.wiz') ?? h;
    const { top } = box.getBoundingClientRect();
    if (top < 64 || top > window.innerHeight * 0.5) box.scrollIntoView?.({ block: 'start' });
  }, [step]);

  // "Weitere Apps zeigen" removes itself: keep keyboard focus on the first newly shown app.
  useEffect(() => {
    if (!showAll || !expanded.current) return;
    grid.current?.querySelectorAll('button')[FIRST]?.focus();
  }, [showAll]);

  const go = (n: number) => {
    const next = Math.min(Math.max(n, 1), STEPS);
    moved.current = true;
    setStep(next);
    try {
      history.pushState({ ...asObject(history.state), [STEP_KEY]: next }, '');
    } catch {
      /* history unavailable: the buttons still work */
    }
  };

  const points = useMemo(() => services.flatMap((s) => s.points), [services]);
  const areas = useMemo(() => mapAreas(selected, points), [selected, points]);
  const touched = areas.filter((a) => a.services.length).length;
  const top = topAreas(areas, 3);

  const svc = (id: string) => services.find((s) => s.id === id);
  const nameOf = (id: string) => svc(id)?.shortName ?? id;
  const names = (list: string[]) =>
    list.length <= 1 ? list.map(nameOf).join('') : `${list.slice(0, -1).map(nameOf).join(', ')} ${s.and} ${nameOf(list.at(-1)!)}`;

  const factServices = wowOrder.filter((id) => selected.includes(id));
  const factService = svc(factServices[factIndex % Math.max(factServices.length, 1)] ?? '');
  // The one change to suggest: never something that costs convenience or deletes/exports an account.
  const surpriseGuide = factService ? guides.find((g) => g.id === factService.surpriseAction) : undefined;
  const action = factService
    ? ((surpriseGuide && !isOptional(surpriseGuide) ? surpriseGuide : undefined) ??
      guides.filter((g) => g.service === factService.id && !isOptional(g)).sort(byPriority)[0])
    : undefined;

  const hasSteps = Boolean(action && action.status === 'verified' && action.steps.length);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const ordered = pickOrder.map((id) => svc(id)).filter((s): s is ServiceCard => Boolean(s));
  const visible = showAll ? ordered : ordered.slice(0, FIRST);
  const n = selected.length;

  // Without a selection only step 1 makes sense (e.g. after "Zurück" and deselecting everything).
  const current = n === 0 ? 1 : step;

  return (
    <div class="wiz" data-step={current}>
      <div class="wiz-head">
        <p class="wiz-count" id="wiz-count">
          {s.step(current, STEPS)}
          <span class="visually-hidden">: {s.stepNames[current - 1]}</span>
        </p>
        {/* The route at a glance: where you are and what comes next. */}
        <ol class="wiz-progress" aria-hidden="true">
          {s.stepNames.map((name, i) => (
            <li key={name} class={`${i < current ? 'is-done' : ''} ${i === current - 1 ? 'is-current' : ''}`}>
              <span class="wiz-progress-name">{name}</span>
            </li>
          ))}
        </ol>
      </div>

      {current === 1 && (
        <section aria-labelledby="wiz-h">
          <h2 id="wiz-h" class="wiz-title" ref={heading} tabindex={-1} aria-describedby="wiz-count">
            {s.pickTitle}
          </h2>
          <p class="wiz-sub">{s.pickSub}</p>
          <ul class="app-grid wiz-grid" aria-labelledby="wiz-h" ref={grid}>
            {visible.map((app) => {
              const on = selected.includes(app.id);
              return (
                <li key={app.id}>
                  <button type="button" class={`app-tile ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(app.id)}>
                    <span class="app-check" aria-hidden="true" />
                    <span class="app-name">{app.shortName}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {!showAll && (
            <button type="button" class="btn btn-quiet wiz-more" onClick={() => {
                expanded.current = true;
                setShowAll(true);
              }}>
              {s.more(ordered.length - FIRST)}
            </button>
          )}
          <div class="wiz-nav">
            <button
              type="button"
              class="btn btn-primary"
              aria-disabled={n === 0}
              onClick={() => (n > 0 ? go(2) : setNudge(true))}
            >
              {n > 0 ? s.nextChosen(n) : s.next}
            </button>
            <p class="small muted" role="status">
              {n === 0 && nudge ? s.nudge : ''}
            </p>
          </div>
        </section>
      )}

      {current === 2 && (
        <section aria-labelledby="wiz-h">
          <h2 id="wiz-h" class="wiz-title" ref={heading} tabindex={-1} aria-describedby="wiz-count">
            {s.learnBefore(n, nameOf(selected[0] ?? ''))} <strong>{s.learnAreas(touched, areas.length)}</strong>{' '}
            {s.learnAfter}
          </h2>
          <p class="wiz-sub">{s.topSub}</p>
          <ol class="wiz-areas">
            {top.map((a) => (
              <li key={a.id}>
                <strong>{t.areas[a.id].title}</strong>
                <span class="small muted">
                  {t.areas[a.id].hint} · {s.at(names(a.services))}
                </span>
              </li>
            ))}
          </ol>
          <p class="small muted">
            {s.basis} <a href={href(locale, 'check')}>{s.allAreas}</a>
          </p>
          <div class="wiz-nav">
            <button type="button" class="btn" onClick={() => go(1)}>
              {s.back}
            </button>
            <button type="button" class="btn btn-primary" onClick={() => go(factService ? 3 : 4)}>
              {s.next}
            </button>
          </div>
        </section>
      )}

      {current === 3 && factService && (
        <section aria-labelledby="wiz-h">
          <h2 id="wiz-h" class="wiz-title" ref={heading} tabindex={-1} aria-describedby="wiz-count">
            {s.factTitle}
          </h2>
          <div class="wow-card" aria-live="polite">
            <p class="wow-meta">
              {factService.shortName}
              {factServices.length > 1 && ` · ${s.factOf((factIndex % factServices.length) + 1, factServices.length)}`}
            </p>
            <p class="wow-fact">{factService.surprise}</p>
            <Evidence sources={factService.surpriseSources} locale={locale} />
          </div>
          {factServices.length > 1 && (
            <button type="button" class="btn btn-quiet small" onClick={() => setFactIndex((i) => i + 1)}>
              {s.anotherFact}
            </button>
          )}
          <div class="wiz-nav">
            <button type="button" class="btn" onClick={() => go(2)}>
              {s.back}
            </button>
            <button type="button" class="btn btn-primary" onClick={() => go(4)}>
              {s.whatCanIDo}
            </button>
          </div>
        </section>
      )}

      {current === 4 && (
        <section aria-labelledby="wiz-h">
          {factService && action ? (
            <>
              <h2 id="wiz-h" class="wiz-title" ref={heading} tabindex={-1} aria-describedby="wiz-count">
                {s.actTitle(action.minutes)}
              </h2>
              <div class="act-card">
                <p class="act-app">{factService.shortName}</p>
                <p class="act-title">{action.title}</p>
                <dl class="act-what">
                  <div class="act-what-item is-change">
                    <dt>{s.changes}</dt>
                    <dd>{action.whatChanges}</dd>
                  </div>
                  <div class="act-what-item">
                    <dt>{s.stays}</dt>
                    <dd>{action.whatDoesNotChange}</dd>
                  </div>
                </dl>
                {action.tradeOff && <p class="tradeoff small">{s.goodToKnow} {action.tradeOff}</p>}
                <p class="act-where small">
                  {s.where} {action.platforms.map((p) => s.platforms[p]).join(' · ')}
                </p>
                {action.status !== 'verified' && <p class="act-unverified small">{s.unverified}</p>}
                <div class="cluster act-buttons">
                  {action.officialUrl ? (
                    <a class="btn btn-primary" href={action.officialUrl} target="_blank" rel="noopener noreferrer">
                      {s.openSetting(factService.shortName)}
                      <span class="visually-hidden">{s.external}</span>
                    </a>
                  ) : null}
                  {!hasSteps && (
                    <a class={`btn ${action.officialUrl ? '' : 'btn-primary'}`} href={href(locale, 'guide', action.id)}>
                      {s.stepByStep}
                    </a>
                  )}
                </div>
                {/* Checked steps open right here, so nobody has to leave the wizard to read them. */}
                {/* Without a direct link the steps are the way there: open them right away. */}
                {hasSteps && (
                  <details class="wiz-steps" open={!action.officialUrl}>
                    <summary>{s.stepByStep}</summary>
                    <ol class="steps">
                      {action.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    <p class="small">
                      <a href={href(locale, 'guide', action.id)}>{s.fullGuide}</a>
                    </p>
                  </details>
                )}
              </div>
            </>
          ) : (
            <h2 id="wiz-h" class="wiz-title" ref={heading} tabindex={-1} aria-describedby="wiz-count">
              {s.firstSteps}
            </h2>
          )}
          <div class="wiz-after">
            <p class="small muted">{s.after}</p>
            <ul class="wiz-links">
              <li>
                <a href={href(locale, 'plan')}>{s.planLink}</a>
              </li>
              <li>
                <a href={href(locale, 'settings')}>{s.settingsLink}</a>
              </li>
            </ul>
          </div>
          <div class="wiz-nav">
            <button type="button" class="btn" onClick={() => go(factService ? 3 : 2)}>
              {s.back}
            </button>
            <button type="button" class="btn btn-quiet" onClick={() => go(1)}>
              {s.otherApps}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
