/**
 * "Was weiß Durchblick über dich?" – available on every page. Shows the
 * actual local state, measured live in the browser. The server-rendered
 * fallback only states facts that are true by construction.
 */
import { dict, href, type Locale } from '~/i18n';
import { useEffect, useRef, useState } from 'preact/hooks';
import { RESET_EVENT, SELECTION_EVENT, TAB_KEY, forgetEverything, listTab, readTabSelection } from '~/domain/selection';
import { CHANGE_EVENT, KEYS, listStored } from '~/domain/storage';

interface Props {
  services: { id: string; name: string }[];
  locale?: Locale;
}

const TXT_DE = {
  title: 'Was weiß Durchblick über dich?',
  inspection: 'Gerade eben auf dieser Seite gemessen',
  account: 'Konto',
  accountNone: 'keins',
  cookies: 'Cookies',
  trackers: 'Tracker',
  trackersNone: 'keine eingebunden',
  destinations: 'Verbindungen',
  destinationsValue: (_own: number, foreign: number) => (foreign ? `diese Website + ${foreign} andere` : 'nur diese Website'),
  storage: 'Lokaler Speicher',
  storageValue: (n: number) => (n ? `${n} Einträge` : 'leer'),
  inUrl: 'Auswahl in diesem Tab',
  knowsNothing: (
    <>
      Durchblick weiß gerade <strong>nichts</strong> über dich.
    </>
  ),
  knows: 'Durchblick weiß gerade:',
  selected: (names: string) =>
    `Ausgewählt: ${names} – nur in diesem Tab, nicht in der Adresse und nicht an uns gesendet. Schließt du den Tab, vergisst Durchblick sie; dein Browser kann sie aber für „Tabs wiederherstellen“ noch aufbewahren.`,
  storedApps: (names: string) => `Gespeichert: deine Apps (${names})`,
  storedDone: (n: number) => `Gespeichert: ${n} erledigte Schritte`,
  onlyHere: 'Alles nur in diesem Browser.',
  otherTabs: 'Gelöscht. Andere offene Tabs behalten ihre eigene Auswahl, bis du sie schließt oder dort löschst.',
  clear: 'Alles löschen',
  details: 'Genau nachsehen →',
  measured: 'Cookies, Verbindungen und Speicher misst dein Browser gerade selbst. Konto und Tracker: Durchblick hat keins und bindet keine ein.',
};
const TXT_EN: typeof TXT_DE = {
  title: 'What does Durchblick know about you?',
  inspection: 'Measured on this page just now',
  account: 'Account',
  accountNone: 'none',
  cookies: 'Cookies',
  trackers: 'Trackers',
  trackersNone: 'none included',
  destinations: 'Connections',
  destinationsValue: (_own, foreign) => (foreign ? `this website + ${foreign} other` : 'only this website'),
  storage: 'Local storage',
  storageValue: (n) => (n ? `${n} ${n === 1 ? 'entry' : 'entries'}` : 'empty'),
  inUrl: 'Selection in this tab',
  knowsNothing: (
    <>
      Right now, Durchblick knows <strong>nothing</strong> about you.
    </>
  ),
  knows: 'Right now, Durchblick knows:',
  selected: (names) =>
    `Selected: ${names} – in this tab only, not in the address and not sent to us. When you close the tab, Durchblick forgets it; your browser may still keep it to restore closed tabs.`,
  storedApps: (names) => `Saved: your apps (${names})`,
  storedDone: (n) => `Saved: ${n} ${n === 1 ? 'step' : 'steps'} done`,
  onlyHere: 'All of it only in this browser.',
  otherTabs: 'Deleted. Other open tabs keep their own selection until you close them or delete it there.',
  clear: 'Delete everything',
  details: 'Take a closer look →',
  measured: 'Your browser measures cookies, connections and storage itself, right now. Account and trackers: Durchblick has none and includes none.',
};

/** Distinct network destinations (origins) this page has contacted, measured by the browser. */
function destinations(): { own: number; foreign: string[] } {
  try {
    const entries = [
      ...performance.getEntriesByType('navigation'),
      ...performance.getEntriesByType('resource'),
    ] as PerformanceResourceTiming[];
    const origins = new Set(entries.map((e) => new URL(e.name, location.href).origin));
    const foreign = [...origins].filter((o) => o !== location.origin);
    return { own: origins.has(location.origin) ? 1 : 0, foreign };
  } catch {
    return { own: 1, foreign: [] };
  }
}

export default function TrustPanel({ services, locale = 'de' }: Props) {
  const t = dict(locale);
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const [live, setLive] = useState(false);
  const [dest, setDest] = useState<{ own: number; foreign: string[] }>({ own: 1, foreign: [] });
  const [cookies, setCookies] = useState(0);
  const [stored, setStored] = useState<ReturnType<typeof listStored>>([]);
  const [inUrl, setInUrl] = useState<string[]>([]);
  const known = useRef<HTMLParagraphElement>(null);
  const [cleared, setCleared] = useState(false);
  const ids = services.map((s) => s.id);
  const nameOf = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  useEffect(() => {
    const refresh = () => {
      setDest(destinations());
      setCookies(document.cookie ? document.cookie.split(';').length : 0);
      setStored([...listStored(locale), ...listTab(locale)]);
      setInUrl(readTabSelection(ids) ?? []);
    };
    refresh();
    setLive(true);
    const events = [CHANGE_EVENT, SELECTION_EVENT, RESET_EVENT, 'hashchange', 'storage', 'pageshow'];
    events.forEach((e) => addEventListener(e, refresh));
    return () => events.forEach((e) => removeEventListener(e, refresh));
  }, []);

  const storedServices = (() => {
    const e = stored.find((s) => s.key === KEYS.services);
    try {
      return e ? (JSON.parse(e.value) as string[]).filter((i) => ids.includes(i)) : [];
    } catch {
      return [];
    }
  })();
  const storedDone = (() => {
    const e = stored.find((s) => s.key === KEYS.done);
    try {
      return e ? (JSON.parse(e.value) as string[]).length : 0;
    } catch {
      return 0;
    }
  })();
  const knows = storedServices.length > 0 || storedDone > 0 || inUrl.length > 0;

  const row = (k: string, v: string, state: 'ok' | 'info' = 'info') => (
    <div class={`insp-row is-${state}`}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );

  return (
    <details class="trust-panel">
      <summary>
        <svg class="trust-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M8 1.2 2.5 3.3v4.2c0 3.3 2.3 6 5.5 7.3 3.2-1.3 5.5-4 5.5-7.3V3.3L8 1.2Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
          <path d="m5.4 8 1.8 1.8 3.5-3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="trust-label">{t.nav.trustBadge}</span>
        <span class="visually-hidden"> – {s.title}</span>
      </summary>
      <div class="trust-pop">
        <p class="label">{s.inspection}</p>
        <h2>{s.title}</h2>
        <dl class="insp">
          {row(s.account, s.accountNone, 'ok')}
          {row(s.cookies, live ? String(cookies) : '0', cookies === 0 ? 'ok' : 'info')}
          {row(s.trackers, s.trackersNone, 'ok')}
          {row(s.destinations, live ? s.destinationsValue(dest.own, dest.foreign.length) : '–', dest.foreign.length === 0 ? 'ok' : 'info')}
          {row(s.storage, live ? s.storageValue(stored.filter((e) => e.key !== TAB_KEY).length) : '–')}
          {row(s.inUrl, live ? (inUrl.length ? inUrl.map(nameOf).join(', ') : '–') : '–')}
        </dl>
        {live && (
          <div class="trust-known">
            {!knows && (
              <p class="trust-nothing" tabindex={-1} ref={known}>
                {s.knowsNothing}
                {cleared && <span class="trust-cleared">{s.otherTabs}</span>}
              </p>
            )}
            {knows && (
              <>
                <strong>{s.knows}</strong>
                <ul>
                  {inUrl.length > 0 && <li>{s.selected(inUrl.map(nameOf).join(', '))}</li>}
                  {storedServices.length > 0 && <li>{s.storedApps(storedServices.map(nameOf).join(', '))}</li>}
                  {storedDone > 0 && <li>{s.storedDone(storedDone)}</li>}
                </ul>
                <span class="meta">{s.onlyHere}</span>
              </>
            )}
          </div>
        )}
        <div class="cluster">
          {live && (stored.length > 0 || inUrl.length > 0) && (
            <button
              type="button"
              class="btn"
              onClick={() => {
                forgetEverything();
                setStored([...listStored(locale), ...listTab(locale)]);
                setInUrl([]);
                setCleared(true);
                // The button disappears: keep focus in the panel, on the new state.
                requestAnimationFrame(() => known.current?.focus());
              }}
            >
              {s.clear}
            </button>
          )}
          <a class="btn btn-quiet" href={href(locale, 'transparency')}>
            {s.details}
          </a>
        </div>
        <p class="meta">{s.measured}</p>
      </div>
    </details>
  );
}
