import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Evidence } from '~/components/Evidence';
import type { GuideCard, ServiceCard } from '~/domain/client-types';
import { freshness, todayIso } from '~/domain/freshness';
import { stagePlan, type Stage } from '~/domain/priority';
import {
  RESET_EVENT,
  cleanSelectionFromUrl,
  hasSelectionInHash,
  initialSelection,
  currentSelection,
  rememberSelection,
  selectionFromHash,
  shareLink,
} from '~/domain/selection';
import { CHANGE_EVENT, KEYS, hasConsent, isAvailable, read, setConsent, write } from '~/domain/storage';

import { dict, formatDate, href, type Locale } from '~/i18n';

interface Props {
  guides: GuideCard[];
  services: Pick<ServiceCard, 'id' | 'name' | 'shortName'>[];
  locale?: Locale;
}

type ConsentState = 'unknown' | 'asking' | 'local' | 'session';

const TXT_DE = {
  stages: {
    start: {
      title: 'Start hier',
      intro: 'Die Änderungen mit der größten Wirkung bei wenig Aufwand – ohne dass du auf etwas verzichten musst.',
    },
    next: { title: 'Danach', intro: 'Wichtig, aber etwas mehr Aufwand oder etwas weniger Wirkung.' },
    optional: {
      title: 'Optional – wenn du mehr willst',
      intro: 'Diese Schritte kosten Komfort, dauern länger oder sind endgültig (z. B. Konto löschen). Bei jedem steht, was du dafür aufgibst.',
    },
  } as Record<Stage, { title: string; intro: string }>,
  doneLabel: (title: string) => `Erledigt: ${title}`,
  impact: (level: string) => `Wirkung ${level}`,
  minutes: (m: number) => `${m} Min`,
  tradeOff: 'Kostet Komfort',
  verified: 'Schritte geprüft',
  unverified: 'noch nicht nachgeprüft',
  why: 'Warum das wichtig ist',
  changes: 'Was sich ändert',
  noChange: 'Was sich nicht ändert',
  freshVerified: (date: string) =>
    `Schritte am ${date} mit der offiziellen Hilfe abgeglichen – nicht in einem echten Konto ausprobiert.`,
  freshStale: (label: string, date: string) => `${label} – zuletzt geprüft am ${date}.`,
  freshNeeds:
    'Die Schritte konnten wir noch nicht an der offiziellen Hilfe prüfen. Nutze den offiziellen Link; Menüs können anders heißen.',
  openOfficial: 'Offizielle Einstellung öffnen',
  externalOf: (app: string) => ` (externe Seite von ${app})`,
  ownPage: 'Eigene Seite',
  noSelection: 'Ohne Auswahl',
  noSelectionRest: 'zeigen wir drei wirksame Schritte für verbreitete Apps.',
  chooseApps: 'Wähle deine Apps',
  chooseAppsRest: ', dann passt der Plan zu dir.',
  planFor: 'Plan für:',
  change: 'ändern',
  progress: 'Fortschritt',
  ofCount: (done: number, all: number) => `${done} von ${all}`,
  /** English needs the count for singular/plural; German does not. */
  firstDone: (() => 'ersten Schritten erledigt') as (all: number) => string,
  total: (done: number, all: number) => `insgesamt ${done} von ${all}`,
  startComplete: 'Start-Schritte vollständig',
  changedAt: (apps: string) => `Einstellungen angepasst bei: ${apps}`,
  storedLocal: 'Dein Fortschritt ist nur auf diesem Gerät gespeichert.',
  viewOrDelete: 'Ansehen oder löschen',
  storedSession: 'Dein Fortschritt wird nicht gespeichert und ist weg, wenn du die Seite verlässt.',
  storedNothing: 'Dein Fortschritt wird nicht gespeichert, bis du es erlaubst. Deine Auswahl merkt sich nur dieser Tab.',
  shareTitle: 'Link mit meiner Auswahl teilen',
  shareBody: (apps: string) =>
    `Dieser Link enthält deine Auswahl: ${apps}. Wer ihn öffnet, sieht sie, und die Browser von dir und von allen, die ihn öffnen, können ihn im Verlauf speichern. An Durchblick wird die Auswahl auch dabei nicht gesendet.`,
  shareLabel: 'Link mit deiner Auswahl',
  shareCopy: 'Link kopieren',
  shareCopied: 'Kopiert. Der Link enthält deine Auswahl.',
  shareCopyFailed: 'Kopieren hat nicht geklappt. Markiere den Link und kopiere ihn selbst.',
  storageBlocked:
    'Dein Browser erlaubt dieser Seite gerade keine Speicherung. Dein Fortschritt gilt deshalb nur, solange die Seite offen ist, und deine Auswahl geht nicht von Seite zu Seite mit. Ohne Auswahl zeigt der Plan Schritte für verbreitete Apps.',
  consentTitle: 'Soll sich Durchblick deinen Fortschritt auf diesem Gerät merken?',
  consentBody:
    'Gespeichert würden nur Kennungen für die erledigten Schritte und deine Apps – im Speicher deines Browsers, nicht auf einem Server. Du kannst das jederzeit ansehen und löschen.',
  consentYes: 'Ja, auf diesem Gerät merken',
  consentNo: 'Nein, nur für jetzt',
  methodTitle: 'Wie wir die Reihenfolge festlegen',
  /** [bold term, rest of the sentence (starts with its separator)] */
  method: [
    [
      'Wirkung',
      ' zählt am meisten: Wie viel gibt die App danach weniger über dich weiter? Das ist unsere Einschätzung (hoch, mittel, gering), bei jedem Schritt begründet.',
    ],
    ['Aufwand', ': Schritte unter 5 Minuten kommen vor längeren.'],
    ['Geprüft', ': Sonst gleich wichtige Schritte, die wir mit der offiziellen Hilfe abgeglichen haben, kommen zuerst.'],
    ['Komfort', ': Was Komfort kostet oder endgültig ist (Konto löschen), steht immer unter „Optional".'],
    ['', 'In „Start hier" kommt möglichst jede deiner Apps höchstens einmal vor.'],
    ['', 'Wir nennen keine Prozentzahlen wie „Risiko um 40 % gesenkt" – dafür gibt es keine belastbare Grundlage.'],
  ] as [string, string][],
};
const TXT_EN: typeof TXT_DE = {
  stages: {
    start: {
      title: 'Start here',
      intro: 'The changes with the biggest impact for little effort – without having to give anything up.',
    },
    next: { title: 'After that', intro: 'Important, but a bit more effort or a bit less impact.' },
    optional: {
      title: 'Optional – if you want more',
      intro: 'These steps cost convenience, take longer or are final (e.g. deleting your account). Each one says what you give up.',
    },
  },
  doneLabel: (title) => `Done: ${title}`,
  impact: (level) => `Impact ${level}`,
  minutes: (m) => `${m} min`,
  tradeOff: 'Costs convenience',
  verified: 'steps checked',
  unverified: 'not checked yet',
  why: 'Why it matters',
  changes: 'What changes',
  noChange: 'What does not change',
  freshVerified: (date) => `Steps compared with the official help on ${date} – not tried out in a real account.`,
  freshStale: (label, date) => `${label} – last checked on ${date}.`,
  freshNeeds:
    'We have not yet been able to check these steps against the official help pages. Use the official link; menus may have different names.',
  openOfficial: 'Open the official setting',
  externalOf: (app) => ` (external site from ${app})`,
  ownPage: 'Own page',
  noSelection: 'Without a selection',
  noSelectionRest: 'we show three effective steps for widely used apps.',
  chooseApps: 'Choose your apps',
  chooseAppsRest: ' and the plan will fit you.',
  planFor: 'Plan for:',
  change: 'change',
  progress: 'Progress',
  ofCount: (done, all) => `${done} of ${all}`,
  firstDone: (all) => (all === 1 ? 'first step done' : 'first steps done'),
  total: (done, all) => `${done} of ${all} in total`,
  startComplete: 'first steps complete',
  changedAt: (apps) => `Settings changed in: ${apps}`,
  storedLocal: 'Your progress is only saved on this device.',
  viewOrDelete: 'View or delete',
  storedSession: 'Your progress is not saved and will be gone when you leave the page.',
  storedNothing: 'Your progress is not saved until you allow it. Only this tab remembers your selection.',
  shareTitle: 'Share a link with my selection',
  shareBody: (apps) =>
    `This link contains your selection: ${apps}. Anyone who opens it sees it, and your browser and theirs may keep it in their history. Even then, the selection is not sent to Durchblick.`,
  shareLabel: 'Link with your selection',
  shareCopy: 'Copy link',
  shareCopied: 'Copied. The link contains your selection.',
  shareCopyFailed: 'Copying did not work. Select the link and copy it yourself.',
  storageBlocked:
    'Your browser does not let this page save anything right now, so your progress only lasts while the page is open and your selection does not carry over from page to page. Without a selection, the plan shows steps for widely used apps.',
  consentTitle: 'Should Durchblick remember your progress on this device?',
  consentBody:
    'Only short codes for the steps you have done and your apps would be saved – in your browser’s storage, not on a server. You can view and delete this at any time.',
  consentYes: 'Yes, remember on this device',
  consentNo: 'No, just for now',
  methodTitle: 'How we decide the order',
  method: [
    [
      'Impact',
      ' counts most: how much flow of information does the step stop or limit? This is an editorial assessment (big, medium, small), explained for each step.',
    ],
    ['Effort', ': steps under 5 minutes come before longer ones.'],
    ['Checked', ': steps we have checked against the official help pages come first when otherwise equal.'],
    ['Trade-offs', ': anything that costs convenience or is final (deleting your account) is always under “Optional”.'],
    ['', 'Where possible, each of your apps appears at most once in “Start here”.'],
    ['', 'We do not give percentages like “risk reduced by 40%” – there is no solid basis for them.'],
  ],
};

function ActionItem({
  g,
  done,
  onToggle,
  open = false,
  locale,
}: {
  g: GuideCard;
  done: boolean;
  onToggle: () => void;
  open?: boolean;
  locale: Locale;
}) {
  const f = freshness(g.status, g.checkedAt, todayIso());
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const t = dict(locale);
  return (
    <li class={`action ${done ? 'is-done' : ''}`}>
      <div class="action-row">
        <label class="done-toggle">
          {/* autocomplete=off: the browser should not keep ticks for tab restore without consent. */}
          <input type="checkbox" id={`done-${g.id}`} checked={done} onChange={onToggle} autocomplete="off" />
          <span class="visually-hidden">{s.doneLabel(g.title)}</span>
        </label>
        <details open={open}>
          <summary>
            <span class="action-title">{g.title}</span>
            <span class="action-meta meta">
              <span>{g.serviceName}</span>
              <span>{s.impact(t.plan.impactShort[g.impact])}</span>
              <span>{s.minutes(g.minutes)}</span>
              {g.tradeOff && <span class="warn">{s.tradeOff}</span>}
              <span class={g.status === 'verified' ? 'ok' : 'warn'}>{g.status === 'verified' ? s.verified : s.unverified}</span>
            </span>
          </summary>
          <div class="action-body">
            <p>{g.goal}</p>
            {g.tradeOff && (
              <p class="tradeoff small">
                <strong>{s.tradeOff}:</strong> {g.tradeOff}
              </p>
            )}
            <dl class="what">
              <dt>{s.why}</dt>
              <dd>{g.whyItMatters}</dd>
              <dt>{s.changes}</dt>
              <dd>{g.whatChanges}</dd>
              <dt>{s.noChange}</dt>
              <dd>{g.whatDoesNotChange}</dd>
            </dl>
            {g.steps.length > 0 && (
              <ol class="steps">
                {g.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
            <p class={`fresh small fresh-${f}`}>
              {f === 'verified' && s.freshVerified(formatDate(g.checkedAt, locale))}
              {f === 'stale' && s.freshStale(t.freshness.stale, formatDate(g.checkedAt, locale))}
              {f === 'needs-verification' && s.freshNeeds}
            </p>
            <div class="cluster">
              {g.officialUrl && (
                <a class="btn btn-primary" href={g.officialUrl} target="_blank" rel="noopener noreferrer">
                  {s.openOfficial}
                  <span class="visually-hidden">{s.externalOf(g.serviceName)}</span>
                </a>
              )}
              <a class="btn btn-quiet" href={href(locale, 'guide', g.id)}>
                {s.ownPage}
              </a>
            </div>
            <Evidence sources={g.sources} locale={locale} />
          </div>
        </details>
      </div>
    </li>
  );
}

export default function PlanView({ guides, services, locale = 'de' }: Props) {
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const ids = services.map((s) => s.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [consent, setConsentState] = useState<ConsentState>('unknown');
  const [canStore, setCanStore] = useState(true);
  const consentRef = useRef(consent);
  consentRef.current = consent;
  // The question appears above the list after the first tick: move focus (and
  // the view) to it – autofocus does not work on elements added later.
  const consentYes = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (consent !== 'asking') return;
    consentYes.current?.focus({ preventScroll: true });
    consentYes.current?.closest('.consent')?.scrollIntoView?.({ block: 'center' });
  }, [consent]);

  useEffect(() => {
    setCanStore(isAvailable());
    // A shared or older link (#d=…): take it over into this tab, then clean the address.
    const initial = initialSelection(ids, window.location.hash);
    if (initial.source === 'link') rememberSelection(initial.ids, { device: false });
    cleanSelectionFromUrl();
    setSelected(initial.ids);
    if (hasConsent()) {
      setConsentState('local');
      const stored = read<unknown>(KEYS.done, []);
      setDone(new Set(Array.isArray(stored) ? stored.filter((x): x is string => typeof x === 'string') : []));
    }
    // "Alles löschen" (here, in another tab or on /transparenz/): show the real
    // state instead of still claiming that progress is saved.
    const sync = () => {
      if (consentRef.current !== 'local' || hasConsent()) return;
      setConsentState('unknown');
      setDone(new Set());
    };
    const reset = () => {
      setSelected([]);
      setDone(new Set());
      setConsentState('unknown');
    };
    const onHash = () => {
      if (!hasSelectionInHash(window.location.hash)) return;
      const next = selectionFromHash(window.location.hash, ids);
      cleanSelectionFromUrl();
      if (!next.length) return;
      rememberSelection(next, { device: false });
      setSelected(next);
    };
    // Back/forward cache: the wizard in this tab may have changed the selection meanwhile.
    // Also after "Alles löschen" elsewhere: an empty tab means "Ohne Auswahl".
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setSelected(currentSelection(ids));
      sync();
      // Progress kept "nur für jetzt" is gone once the page was left – as the plan says.
      if (consentRef.current !== 'local') setDone(new Set());
    };
    addEventListener('pageshow', onShow);
    addEventListener('hashchange', onHash);
    addEventListener(CHANGE_EVENT, sync);
    addEventListener('storage', sync);
    addEventListener(RESET_EVENT, reset);
    return () => {
      removeEventListener('hashchange', onHash);
      removeEventListener('pageshow', onShow);
      removeEventListener(CHANGE_EVENT, sync);
      removeEventListener('storage', sync);
      removeEventListener(RESET_EVENT, reset);
    };
  }, []);

  const plan = useMemo(() => stagePlan(guides, selected), [selected]);
  const all = [...plan.start, ...plan.next, ...plan.optional];
  const doneCount = all.filter((g) => done.has(g.id)).length;
  const startDone = plan.start.filter((g) => done.has(g.id)).length;

  // The tick that raised the "merken?" question gets focus back after the answer.
  const askedBy = useRef('');
  const toggleDone = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDone(next);
    if (consent === 'unknown' && isAvailable()) {
      askedBy.current = id;
      setConsentState('asking');
      return;
    }
    write(KEYS.done, [...next]);
  };
  const answer = (allow: boolean) => {
    if (allow) {
      setConsent(true);
      write(KEYS.done, [...done]);
      write(KEYS.services, selected);
      setConsentState('local');
    } else {
      setConsentState('session');
    }
    // The question disappears: keep keyboard and screen reader where they were.
    requestAnimationFrame(() => document.getElementById(`done-${askedBy.current}`)?.focus());
  };

  const [copied, setCopied] = useState<'' | 'ok' | 'failed'>('');
  const names = selected.map((id) => services.find((x) => x.id === id)?.shortName ?? id).join(', ');
  useEffect(() => setCopied(''), [selected]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink(href(locale, 'plan'), selected));
      setCopied('ok');
    } catch {
      setCopied('failed');
    }
  };

  const changed = new Set(
    guides.filter((g) => done.has(g.id) && (g.kind === 'setting' || g.kind === 'permission')).map((g) => g.serviceName),
  );
  const stages = (['start', 'next', 'optional'] as const).filter((s) => plan[s].length > 0);

  return (
    <div class="plan">
      <div class="plan-head">
        {selected.length === 0 ? (
          <p>
            <strong>{s.noSelection}</strong> {s.noSelectionRest}{' '}
            <a href={href(locale, 'home')}>{s.chooseApps}</a>
            {s.chooseAppsRest}
          </p>
        ) : (
          <p>
            {s.planFor} <strong>{selected.map((id) => services.find((x) => x.id === id)?.shortName).join(', ')}</strong>{' '}
            <a href={href(locale, 'check')} class="small">
              {s.change}
            </a>
          </p>
        )}
        {/* Sharing is a deliberate step: the link with the selection only appears
            after opening this, next to what it contains and where it may end up. */}
        {selected.length > 0 && (
          <details class="share" onToggle={() => setCopied('')}>
            <summary class="small">{s.shareTitle}</summary>
            <p class="small">{s.shareBody(names)}</p>
            {/* Inside the closed <details> this is neither shown, focusable nor read out. */}
            <div class="share-row">
                <input
                  type="text"
                  readOnly
                  autocomplete="off"
                  class="share-url"
                  value={shareLink(href(locale, 'plan'), selected)}
                  aria-label={s.shareLabel}
                  onFocus={(e) => (e.currentTarget as HTMLInputElement).select()}
                />
                <button type="button" class="btn" onClick={copy}>
                  {s.shareCopy}
                </button>
            </div>
            <p class="small" role="status">
              {copied === 'ok' ? s.shareCopied : copied === 'failed' ? s.shareCopyFailed : ''}
            </p>
          </details>
        )}
        <div class="progress" role="group" aria-label={s.progress}>
          <progress class="progress-bar" value={doneCount} max={Math.max(all.length, 1)} aria-hidden="true" />
          <p class="small">
            <strong>{s.ofCount(startDone, plan.start.length)}</strong> {s.firstDone(plan.start.length)}
            {all.length > plan.start.length && <> · {s.total(doneCount, all.length)}</>}
            {plan.start.length > 0 && startDone === plan.start.length && <> · {s.startComplete}</>}
            {changed.size > 0 && <> · {s.changedAt([...changed].join(', '))}</>}
          </p>
        </div>
        <p class="small muted storage-note" role="status">
          {consent === 'local' && (
            <>
              {s.storedLocal} <a href={href(locale, 'transparency')}>{s.viewOrDelete}</a>
            </>
          )}
          {consent === 'session' && s.storedSession}
          {(consent === 'unknown' || consent === 'asking') && (canStore ? s.storedNothing : s.storageBlocked)}
        </p>
      </div>

      {consent === 'asking' && (
        <div class="consent panel" role="dialog" aria-labelledby="consent-title" aria-modal="false">
          <p id="consent-title">
            <strong>{s.consentTitle}</strong>
          </p>
          <p class="small">{s.consentBody}</p>
          <div class="cluster">
            <button type="button" class="btn btn-primary" onClick={() => answer(true)} ref={consentYes}>
              {s.consentYes}
            </button>
            <button type="button" class="btn" onClick={() => answer(false)}>
              {s.consentNo}
            </button>
          </div>
        </div>
      )}

      {stages.map((stage) => (
        <section class={`stage stage-${stage}`} key={stage} aria-labelledby={`st-${stage}`}>
          <h2 id={`st-${stage}`}>
            {s.stages[stage].title}
            <span class="meta bucket-sub"> {plan[stage].length}</span>
          </h2>
          <p class="stage-intro">{s.stages[stage].intro}</p>
          <ul class="actions">
            {plan[stage].map((g) => (
              <ActionItem key={g.id} g={g} done={done.has(g.id)} onToggle={() => toggleDone(g.id)} locale={locale} />
            ))}
          </ul>
        </section>
      ))}

      <details class="method-box">
        <summary>{s.methodTitle}</summary>
        <ul class="small">
          {s.method.map(([term, text], i) => (
            <li key={i}>
              {term && <strong>{term}</strong>}
              {text}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
