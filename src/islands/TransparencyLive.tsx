import { useEffect, useState } from 'preact/hooks';
import { SELECTION_EVENT, TAB_KEY, forgetEverything, listTab } from '~/domain/selection';
import { CHANGE_EVENT, isAvailable, listStored } from '~/domain/storage';

/** Everything this site keeps in this browser: on this device (after consent) and in this tab. */
const everything = (locale: Locale) => [...listStored(locale), ...listTab(locale)];
import type { Locale } from '~/i18n';

const TXT_DE = {
  page: 'Seite',
  noStorage: 'Dein Browser erlaubt keinen lokalen Speicher – Durchblick kann sich gar nichts merken.',
  nothing:
    'Durchblick weiß gerade nichts über dich: nichts gespeichert, keine Cookies, keine Verbindung zu fremden Servern.',
  stored: (device: number, tab: number) =>
    [
      device ? `${device} ${device === 1 ? 'Eintrag' : 'Einträge'} auf diesem Gerät – weil du es erlaubt hast` : '',
      tab ? 'deine Auswahl nur für diesen Tab, ohne Zustimmung (schließt du den Tab, vergisst Durchblick sie)' : '',
    ]
      .filter(Boolean)
      .join('; ') + '. Sonst nichts.',
  inShort: 'Kurz gesagt:',
  netTitle: 'Verbindungen dieser Seite',
  foreign: 'zu fremden Servern',
  files: (n: number) => ` · ${n} Dateien von dieser Website geladen`,
  showFiles: 'Alle geladenen Dateien anzeigen',
  external: ' – extern',
  netNote:
    'Das misst dein eigener Browser, seit diese Seite geladen wurde. Wer es genau wissen will: Entwicklerwerkzeuge des Browsers öffnen, Reiter „Netzwerk“.',
  cookiesTitle: 'Cookies',
  cookiesHint: 'Kleine Dateien, mit denen Websites deinen Browser wiedererkennen.',
  // German uses "Cookies" for any number; English needs singular/plural.
  cookiesCount: ((): string => 'Cookies') as (n: number) => string,
  cookiesNote: 'Durchblick setzt keine Cookies. Deshalb gibt es auch keinen Cookie-Banner.',
  storageTitle: 'In deinem Browser gespeichert',
  storageBlocked: 'Dein Browser erlaubt dieser Seite keinen lokalen Speicher. Es wird nichts gespeichert.',
  storageEmpty: 'Nichts.',
  export: 'Als Datei exportieren',
  exportFile: 'durchblick-daten.json',
  clear: 'Alles löschen',
  cleared: 'Alles gelöscht: auf diesem Gerät und in diesem Tab. Andere offene Tabs behalten ihre eigene Auswahl, bis du sie schließt oder dort löschst.',
};
const TXT_EN: typeof TXT_DE = {
  page: 'page',
  noStorage: 'Your browser does not allow local storage – Durchblick cannot remember anything at all.',
  nothing: 'Right now, Durchblick knows nothing about you: nothing saved, no cookies, no connection to other servers.',
  stored: (device, tab) =>
    [
      device ? `${device} ${device === 1 ? 'entry' : 'entries'} on this device – because you allowed it` : '',
      tab ? 'your selection for this tab only, without consent (when you close the tab, Durchblick forgets it)' : '',
    ]
      .filter(Boolean)
      .join('; ') + '. Nothing else.',
  inShort: 'In short:',
  netTitle: 'Connections of this page',
  foreign: 'to other servers',
  files: (n) => ` · ${n} ${n === 1 ? 'file' : 'files'} loaded from this website`,
  showFiles: 'Show all loaded files',
  external: ' – external',
  netNote:
    'Your own browser measures this from the moment this page loaded. If you want to know exactly: open your browser’s developer tools, “Network” tab.',
  cookiesTitle: 'Cookies',
  cookiesHint: 'Small files that websites use to recognise your browser.',
  cookiesCount: (n) => (n === 1 ? 'cookie' : 'cookies'),
  cookiesNote: 'Durchblick does not set any cookies. That is why there is no cookie banner either.',
  storageTitle: 'Saved in your browser',
  storageBlocked: 'Your browser does not allow this page to use local storage. Nothing is saved.',
  storageEmpty: 'Nothing.',
  export: 'Export as a file',
  exportFile: 'durchblick-data.json',
  clear: 'Delete everything',
  cleared: 'Everything deleted: on this device and in this tab. Other open tabs keep their own selection until you close them or delete it there.',
};

interface Req {
  url: string;
  type: string;
  sameOrigin: boolean;
}

function collectRequests(pageLabel: string): Req[] {
  const entries = [
    ...performance.getEntriesByType('navigation'),
    ...performance.getEntriesByType('resource'),
  ] as PerformanceResourceTiming[];
  return entries.map((e) => {
    const u = new URL(e.name, location.href);
    return {
      url: u.origin === location.origin ? u.pathname : u.href,
      type: e.entryType === 'navigation' ? pageLabel : e.initiatorType,
      sameOrigin: u.origin === location.origin,
    };
  });
}

export default function TransparencyLive({ locale = 'de' }: { locale?: Locale }) {
  const s = locale === 'en' ? TXT_EN : TXT_DE;
  const [requests, setRequests] = useState<Req[]>([]);
  // Start empty and fill after mount: Preact does not patch attributes during hydration.
  const [stored, setStored] = useState<ReturnType<typeof listStored>>([]);
  const [cookies, setCookies] = useState<string>('');
  const [available, setAvailable] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRequests(collectRequests(s.page));
    setStored(everything(locale));
    setCookies(document.cookie);
    setAvailable(isAvailable());
    const obs = new PerformanceObserver(() => setRequests(collectRequests(s.page)));
    try {
      obs.observe({ type: 'resource', buffered: true });
    } catch {
      /* older browsers */
    }
    const refresh = () => setStored(everything(locale));
    addEventListener(CHANGE_EVENT, refresh);
    addEventListener(SELECTION_EVENT, refresh);
    addEventListener('storage', refresh);
    return () => {
      obs.disconnect();
      removeEventListener(CHANGE_EVENT, refresh);
      removeEventListener('storage', refresh);
      removeEventListener(SELECTION_EVENT, refresh);
    };
  }, []);

  const cookieCount = cookies ? cookies.split(';').length : 0;
  const foreign = requests.filter((r) => !r.sameOrigin);
  const download = () => {
    const data = Object.fromEntries(
      everything(locale).map((e) => {
        try {
          return [e.key, JSON.parse(e.value)];
        } catch {
          return [e.key, e.value];
        }
      }),
    );
    const blob = new Blob([JSON.stringify({ app: 'durchblick', exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = s.exportFile;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const inTab = stored.filter((e) => e.key === TAB_KEY).length;
  const summary = !available ? s.noStorage : stored.length === 0 ? s.nothing : s.stored(stored.length - inTab, inTab);

  return (
    <div class="live">
      <p class="live-summary" role="status">
        <strong>{s.inShort}</strong> {summary}
      </p>
      <div class="live-grid">
        <section class="panel live-card" aria-labelledby="live-net">
          <h2 id="live-net">{s.netTitle}</h2>
          <p class="live-big">
            <strong>{foreign.length}</strong> {s.foreign}
            <span class="small muted">{s.files(requests.length)}</span>
          </p>
          <details>
            <summary>{s.showFiles}</summary>
            <ul class="req-list small">
              {requests.map((r, i) => (
                <li key={i}>
                  <code>{r.url}</code> <span class="muted">({r.type})</span>
                  {!r.sameOrigin && <strong>{s.external}</strong>}
                </li>
              ))}
            </ul>
          </details>
          <p class="small muted">{s.netNote}</p>
        </section>

        <section class="panel live-card" aria-labelledby="live-cookies">
          <h2 id="live-cookies">{s.cookiesTitle}</h2>
          <p class="small muted">{s.cookiesHint}</p>
          <p class="live-big">
            <strong>{cookieCount}</strong> {s.cookiesCount(cookieCount)}
          </p>
          <p class="small muted">{s.cookiesNote}</p>
        </section>

        <section class="panel live-card" aria-labelledby="live-storage">
          <h2 id="live-storage" tabindex={-1}>
            {s.storageTitle}
          </h2>
          {!available && <p class="small">{s.storageBlocked}</p>}
          {available && stored.length === 0 && (
            <p class="live-big">
              <strong>{s.storageEmpty}</strong>
            </p>
          )}
          {stored.length > 0 && (
            <ul class="stored small">
              {stored.map((e) => (
                <li key={e.key}>
                  <code>{e.key}</code>
                  <span>{e.description}</span>
                  <code class="value">{e.value}</code>
                </li>
              ))}
            </ul>
          )}
          <div class="cluster">
            <button type="button" class="btn" onClick={download} disabled={stored.length === 0}>
              {s.export}
            </button>
            <button
              type="button"
              class="btn"
              disabled={stored.length === 0}
              onClick={() => {
                forgetEverything();
                setStored(everything(locale));
                setMessage(s.cleared);
                // The buttons disable themselves: keep focus in this card.
                requestAnimationFrame(() => document.getElementById('live-storage')?.focus());
              }}
            >
              {s.clear}
            </button>
          </div>
          <p class="small" role="status">
            {message}
          </p>
        </section>
      </div>
    </div>
  );
}
