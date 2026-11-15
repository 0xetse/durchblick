/**
 * Signature experience: "Dein Datenmuster" (V3: matrix instrument).
 * 1. Select the apps you use. 2. A matrix shows which areas of life each app
 * can involve (life area × app, intensity = number of documented data types).
 * 3. One sourced finding about one of your apps. 4. One change with its
 * trade-offs. Computed in the browser from the selection only.
 */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Evidence } from '~/components/Evidence';
import { Glyph } from '~/components/Glyph';
import { mapAreas } from '~/domain/areas';
import type { CompanyCard, GuideCard, ServiceCard } from '~/domain/client-types';
import { computeFootprint, type Theme } from '~/domain/footprint';
import { byPriority, isOptional } from '~/domain/priority';
import { useSelection } from './useSelection';
import { dict, href, type Locale } from '~/i18n';

interface Props {
  services: ServiceCard[];
  guides: GuideCard[];
  companies: CompanyCard[];
  /** full = /check/ page with cross-service themes and the detailed table */
  full?: boolean;
  locale?: Locale;
}

/** Order in which facts are shown: most universally surprising first. */
const WOW_ORDER = ['google', 'whatsapp', 'instagram', 'facebook', 'chatgpt', 'youtube', 'tiktok', 'amazon', 'telegram', 'snapchat', 'spotify', 'linkedin', 'paypal', 'netflix'];
const PICK_ORDER = ['instagram', 'whatsapp', 'google', 'youtube', 'amazon', 'tiktok', 'facebook', 'chatgpt', 'spotify', 'netflix', 'paypal', 'telegram', 'snapchat', 'linkedin'];
/** Two-letter column codes for the matrix (legend shows full names). */
const CODES: Record<string, string> = {
  instagram: 'IG',
  whatsapp: 'WA',
  google: 'GO',
  youtube: 'YT',
  amazon: 'AM',
  tiktok: 'TT',
  facebook: 'FB',
  chatgpt: 'CG',
  spotify: 'SP',
  linkedin: 'LI',
  telegram: 'TG',
  snapchat: 'SC',
  paypal: 'PP',
  netflix: 'NF',
};
const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3);

type ThemeTextFn = (
  t: Theme,
  names: (ids: string[]) => string,
  companyName: (id?: string) => string,
) => { title: string; body: string };

/** Texts for cross-app themes, one function per language (grammar differs, so no shared fragments). */
const themeTextDe: ThemeTextFn = (t, names, companyName) => {
  const n = t.serviceIds.length;
  switch (t.id) {
    case 'same-company':
      return {
        title: `${n} deiner Apps gehören zu ${companyName(t.companyId)}`,
        body: `${names(t.serviceIds)} können über ein gemeinsames Konto oder eine Kontenübersicht verbunden sein. Dann fließen Informationen leichter zusammen – auch für Werbung.`,
      };
    case 'ad-funded':
      return {
        title: `${n} deiner Apps verdienen vor allem mit Werbung, die auf dich zugeschnitten ist`,
        body: `Bei ${names(t.serviceIds)} sind Informationen über dein Verhalten wichtig fürs Geschäft. Hier bringen Werbe-Einstellungen am meisten.`,
      };
    case 'offplatform':
      return {
        title: `${n === 1 ? 'Eine App erfährt' : `${n} Apps erfahren`} auch etwas, wenn du gar nicht dort bist`,
        body: `${names(t.serviceIds)} ${n === 1 ? 'kann' : 'können'} laut eigener Angabe Informationen von anderen Firmen bekommen – etwa von Websites, die Werkzeuge des Anbieters eingebaut haben.`,
      };
    case 'location':
      return {
        title: `${n} deiner Apps können wissen, wo du ungefähr bist`,
        body: 'Mindestens grob über deine Internet-Verbindung, genauer über die Standortfreigabe. Wo du regelmäßig bist, verrät viel über Wohnort, Arbeit und Gewohnheiten.',
      };
    case 'prompts':
      return {
        title: 'Du schreibst einer KI',
        body: `Bei ${names(t.serviceIds)} landen deine Eingaben beim Anbieter. Was man einer KI schreibt, ist oft persönlicher als eine Suchanfrage.`,
      };
  }
};

const themeTextEn: ThemeTextFn = (t, names, companyName) => {
  const n = t.serviceIds.length;
  const yourApps = n === 1 ? 'One of your apps' : `${n} of your apps`;
  switch (t.id) {
    case 'same-company':
      return {
        title: `${yourApps} ${n === 1 ? 'belongs' : 'belong'} to ${companyName(t.companyId)}`,
        body: `${names(t.serviceIds)} can be connected through a shared account or an accounts overview. Information then flows together more easily – including for advertising.`,
      };
    case 'ad-funded':
      return {
        title: `${yourApps} ${n === 1 ? 'makes' : 'make'} money mainly from advertising tailored to you`,
        body: `For ${names(t.serviceIds)}, information about your behaviour matters to the business. This is where advertising settings make the biggest difference.`,
      };
    case 'offplatform':
      return {
        title: `${n === 1 ? 'One app learns' : `${n} apps learn`} things even when you are not using ${n === 1 ? 'it' : 'them'}`,
        body: `According to ${n === 1 ? 'its provider' : 'their providers'}, ${names(t.serviceIds)} can receive information from other companies – for example from websites that have built in the provider’s tools.`,
      };
    case 'location':
      return {
        title: `${yourApps} can know roughly where you are`,
        body: 'At least roughly via your internet connection, more precisely via location sharing. Where you go regularly says a lot about where you live, where you work and your habits.',
      };
    case 'prompts':
      return {
        title: 'You are writing to an AI',
        body: `With ${names(t.serviceIds)}, what you type ends up with the provider. What people write to an AI is often more personal than a search.`,
      };
  }
};

const TXT_DE = {
  pickLabel: 'Schritt 1 · Welche Apps nutzt du?',
  promise: 'Deine Auswahl bleibt in diesem Browser. Wir haben keine Konten gescannt.',
  jump: (apps: number, touched: number, all: number) =>
    `Ergebnis: ${apps === 1 ? '1 App' : `${apps} Apps`} · ${touched} von ${all} Lebensbereichen ↓`,
  resultLabel: 'Was deine Apps erfahren können',
  empty: 'Sobald du Apps wählst, zeigt die Matrix, aus welchen Bereichen deines Lebens sie Informationen erhalten können.',
  headBefore: (n: number) => `${n === 1 ? 'Diese App kann' : `Diese ${n} Apps können`} Informationen aus`,
  headAreas: (touched: number, all: number) => `${touched} von ${all} Bereichen`,
  headAfter: 'deines Lebens erhalten.',
  stats: (apps: number, touched: number, all: number, points: number) =>
    `${apps} Apps · ${touched}/${all} Bereiche · ${points} dokumentierte Angaben`,
  matrixLabel: 'Datenmuster: Lebensbereiche je App',
  matrixCaption: 'Wie viele Arten von Informationen jede gewählte App laut Anbieter je Lebensbereich erhalten kann',
  areaHead: 'Lebensbereich',
  appsHead: 'Apps',
  cell: (n: number) => `${n === 0 ? 'keine' : n} ${n === 1 ? 'Angabe' : 'Angaben'}`,
  legend3: '3+ Angaben',
  legend0: 'keine',
  basis:
    'Grundlage sind Angaben der Anbieter und technisch zwangsläufige Daten – keine Messung bei dir. Wie viel davon bei dir anfällt, hängt von Nutzung und Einstellungen ab. Bereich antippen für Details.',
  factLabel: 'Das wissen die wenigsten',
  anotherFact: (i: number, n: number) => `Noch ein Fakt (${i}/${n}) →`,
  actAgainst: 'Schritt 4 · Das kannst du dagegen tun',
  actAt: (app: string) => `Schritt 4 · Das kannst du bei ${app} ändern`,
  effort: 'Aufwand',
  minutes: (m: number) => `ca. ${m} Min`,
  impact: 'Wirkung',
  tradeOff: 'Kostet Komfort',
  tradeOffYes: 'ja',
  tradeOffNo: 'keiner',
  changes: 'Was sich ändert',
  noChange: 'Was sich nicht ändert',
  openSetting: (app: string) => `Einstellung bei ${app} öffnen ↗`,
  external: ' (externe Seite)',
  stepByStep: 'Schritt für Schritt',
  firstSteps: 'Meine ersten Schritte',
  allDetails: 'Alle Details zu meinen Apps',
  themesTitle: 'Was bei deinen Apps auffällt',
  eachApp: 'Jede App einzeln',
  tableSummary: 'Als Tabelle: alle Arten von Informationen je App',
  tableLabel: 'Arten von Informationen je App',
  tableCaption: 'Welche Arten von Informationen deine Apps laut Anbieter erfassen',
  kindHead: 'Art',
  yes: 'ja',
  no: 'nein',
  and: 'und',
  themeText: themeTextDe,
};
const TXT_EN: typeof TXT_DE = {
  pickLabel: 'Step 1 · Which apps do you use?',
  promise: 'Your selection stays in this browser. We have not scanned any accounts.',
  jump: (apps, touched, all) => `Result: ${apps === 1 ? '1 app' : `${apps} apps`} · ${touched} of ${all} areas of your life ↓`,
  resultLabel: 'What your apps can learn',
  empty: 'As soon as you choose apps, the matrix shows which areas of your life they can get information from.',
  headBefore: (n) => `${n === 1 ? 'This app' : `These ${n} apps`} can get information from`,
  headAreas: (touched, all) => `${touched} of ${all} areas`,
  headAfter: 'of your life.',
  stats: (apps, touched, all, points) =>
    `${apps === 1 ? '1 app' : `${apps} apps`} · ${touched}/${all} areas · ${points} documented ${points === 1 ? 'item' : 'items'}`,
  matrixLabel: 'Data pattern: areas of life per app',
  matrixCaption: 'How many kinds of information each selected app can get per area of life, according to the provider',
  areaHead: 'Area of life',
  appsHead: 'Apps',
  cell: (n) => `${n === 0 ? 'no' : n} ${n === 1 ? 'item' : 'items'}`,
  legend3: '3+ items',
  legend0: 'none',
  basis:
    'Based on what the providers say and on data that is technically unavoidable – nothing was measured on your devices. How much of it applies to you depends on your usage and settings. Tap an area for details.',
  factLabel: 'Few people know this',
  anotherFact: (i, n) => `Another fact (${i}/${n}) →`,
  actAgainst: 'Step 4 · What you can do about it',
  actAt: (app) => `Step 4 · What you can change in ${app}`,
  effort: 'Effort',
  minutes: (m) => `approx. ${m} min`,
  impact: 'Impact',
  tradeOff: 'Costs convenience',
  tradeOffYes: 'yes',
  tradeOffNo: 'none',
  changes: 'What changes',
  noChange: 'What does not change',
  openSetting: (app) => `Open the setting in ${app} ↗`,
  external: ' (external site)',
  stepByStep: 'Step by step',
  firstSteps: 'My first steps',
  allDetails: 'All details on my apps',
  themesTitle: 'What stands out about your apps',
  eachApp: 'Each app on its own',
  tableSummary: 'As a table: all kinds of information per app',
  tableLabel: 'Kinds of information per app',
  tableCaption: 'Which kinds of information your apps collect, according to the providers',
  kindHead: 'Kind',
  yes: 'yes',
  no: 'no',
  and: 'and',
  themeText: themeTextEn,
};

export default function Datenmuster({ services, guides, companies, full = false, locale = 'de' }: Props) {
  const tx = locale === 'en' ? TXT_EN : TXT_DE;
  const t = dict(locale);
  const ids = services.map((s) => s.id);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  const { selected, setSelected } = useSelection(ids);
  useEffect(() => setFactIndex(0), [selected]);

  const points = useMemo(() => services.flatMap((s) => s.points), [services]);
  const areas = useMemo(() => mapAreas(selected, points), [selected, points]);
  const touched = areas.filter((a) => a.services.length);
  const pointCount = points.filter((p) => selected.includes(p.service)).length;
  const fp = useMemo(() => (full ? computeFootprint(selected, services, companies, guides) : null), [selected, full]);

  const svc = (id: string) => services.find((s) => s.id === id);
  const nameOf = (id: string) => svc(id)?.shortName ?? id;
  const names = (list: string[]) =>
    list.length <= 1 ? list.map(nameOf).join('') : `${list.slice(0, -1).map(nameOf).join(', ')} ${tx.and} ${nameOf(list.at(-1)!)}`;
  const companyName = (id?: string) => companies.find((c) => c.id === id)?.name ?? id ?? '';

  const factServices = WOW_ORDER.filter((id) => selected.includes(id));
  const factService = svc(factServices[factIndex % Math.max(factServices.length, 1)] ?? '');
  const action = factService
    ? (guides.find((g) => g.id === factService.surpriseAction) ??
      guides.filter((g) => g.service === factService.id && !isOptional(g)).sort(byPriority)[0])
    : undefined;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const ordered = PICK_ORDER.map((id) => svc(id)).filter((s): s is ServiceCard => Boolean(s));

  const cols = PICK_ORDER.filter((id) => selected.includes(id));
  const count = (area: string, service: string) =>
    areas.find((a) => a.id === area)?.points.filter((p) => p.service === service).length ?? 0;

  return (
    <div class={`muster ${full ? 'is-full' : ''}`}>
      <div class="muster-pick">
        <p class="label" id="muster-pick-label">
          {tx.pickLabel}
        </p>
        <ul class="app-grid" aria-labelledby="muster-pick-label">
          {ordered.map((s) => {
            const on = selected.includes(s.id);
            return (
              <li key={s.id}>
                <button type="button" class={`app-tile ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(s.id)}>
                  <span class="app-check" aria-hidden="true" />
                  <span class="app-name">{s.shortName}</span>
                  <span class="app-code" aria-hidden="true">
                    {CODES[s.id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p class="muster-promise small muted">{tx.promise}</p>
        {selected.length > 0 && (
          <a class="muster-jump" href="#muster-result">
            {tx.jump(selected.length, touched.length, areas.length)}
          </a>
        )}
      </div>

      <div class="muster-result" id="muster-result" aria-live="polite">
        <p class="label">{tx.resultLabel}</p>
        {selected.length === 0 ? (
          <p class="muster-headline is-empty">{tx.empty}</p>
        ) : (
          <p class="muster-headline">
            {tx.headBefore(selected.length)} <strong>{tx.headAreas(touched.length, areas.length)}</strong>{' '}
            {tx.headAfter}
          </p>
        )}
        {selected.length > 0 && (
          <p class="meta muster-stats">
            {tx.stats(selected.length, touched.length, areas.length, pointCount)}
          </p>
        )}

        {/* Scrollable region must be keyboard-focusable (WCAG 2.1.1). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div class="matrix-wrap" tabindex={0} role="region" aria-label={tx.matrixLabel}>
          <table class="dm">
            <caption class="visually-hidden">{tx.matrixCaption}</caption>
            <thead>
              <tr>
                <th scope="col" class="dm-area-h">
                  {tx.areaHead}
                </th>
                {cols.map((id) => (
                  <th scope="col" key={id} class="dm-col">
                    <abbr title={nameOf(id)}>{CODES[id]}</abbr>
                  </th>
                ))}
                <th scope="col" class="dm-sum">
                  {tx.appsHead}
                </th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => {
                const open = openArea === a.id;
                return [
                  <tr key={a.id} class={a.services.length ? 'is-on' : 'is-off'}>
                    <th scope="row" class="dm-area">
                      <button
                        type="button"
                        class="dm-toggle"
                        aria-expanded={open}
                        disabled={a.points.length === 0}
                        onClick={() => setOpenArea(open ? null : a.id)}
                      >
                        {t.areas[a.id].title}
                      </button>
                    </th>
                    {cols.map((id) => {
                      const n = count(a.id, id);
                      return (
                        <td key={id} class={`dm-cell l${level(n)}`}>
                          <span class="dm-sq" aria-hidden="true" />
                          <span class="visually-hidden">
                            {nameOf(id)}: {tx.cell(n)}
                          </span>
                        </td>
                      );
                    })}
                    <td class="dm-sum">{a.services.length || '–'}</td>
                  </tr>,
                  open ? (
                    <tr key={`${a.id}-d`} class="dm-detail">
                      <td colSpan={cols.length + 2}>
                        <p class="small muted">{t.areas[a.id].hint}</p>
                        <ul>
                          {a.points.map((p) => (
                            <li key={p.service + p.title}>
                              <span class="meta">{CODES[p.service]}</span> <Glyph kind={p.provenance} size={10} />{' '}
                              {p.title}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ) : null,
                ];
              })}
            </tbody>
          </table>
        </div>
        <p class="meta dm-legend">
          <span>
            <span class="dm-sq l3" aria-hidden="true" /> {tx.legend3}
          </span>
          <span>
            <span class="dm-sq l2" aria-hidden="true" /> 2
          </span>
          <span>
            <span class="dm-sq l1" aria-hidden="true" /> 1
          </span>
          <span>
            <span class="dm-sq l0" aria-hidden="true" /> {tx.legend0}
          </span>
          {cols.length > 0 && <span>{cols.map((id) => `${CODES[id]} = ${nameOf(id)}`).join(' · ')}</span>}
        </p>
        {selected.length > 0 && (
          <p class="small muted muster-basis">{tx.basis}</p>
        )}

        {factService && (
          <section class="wow" aria-labelledby="wow-title">
            <p class="label">{tx.factLabel}</p>
            <div class="wow-card">
              <p class="meta" id="wow-title">
                {factService.shortName}
              </p>
              <p class="wow-fact">{factService.surprise}</p>
              <Evidence sources={factService.surpriseSources} locale={locale} />
              {factServices.length > 1 && (
                <button type="button" class="btn btn-quiet small" onClick={() => setFactIndex((i) => i + 1)}>
                  {tx.anotherFact((factIndex % factServices.length) + 1, factServices.length)}
                </button>
              )}
            </div>
            {action && (
              <div class="act-card">
                <p class="label">
                  {action.id === factService.surpriseAction ? tx.actAgainst : tx.actAt(factService.shortName)}
                </p>
                <p class="act-title">{action.title}</p>
                <dl class="kv kv-inline">
                  <div>
                    <dt>{tx.effort}</dt>
                    <dd>{tx.minutes(action.minutes)}</dd>
                  </div>
                  <div>
                    <dt>{tx.impact}</dt>
                    <dd>{t.plan.impactShort[action.impact]}</dd>
                  </div>
                  <div>
                    <dt>{tx.tradeOff}</dt>
                    <dd>{action.tradeOff ? tx.tradeOffYes : tx.tradeOffNo}</dd>
                  </div>
                </dl>
                {action.tradeOff && <p class="tradeoff small">{action.tradeOff}</p>}
                <dl class="act-what small">
                  <dt>{tx.changes}</dt>
                  <dd>{action.whatChanges}</dd>
                  <dt>{tx.noChange}</dt>
                  <dd>{action.whatDoesNotChange}</dd>
                </dl>
                <div class="cluster">
                  {action.officialUrl ? (
                    <a class="btn btn-primary" href={action.officialUrl} target="_blank" rel="noopener noreferrer">
                      {tx.openSetting(factService.shortName)}
                      <span class="visually-hidden">{tx.external}</span>
                    </a>
                  ) : null}
                  <a class={`btn ${action.officialUrl ? '' : 'btn-primary'}`} href={href(locale, 'guide', action.id)}>
                    {tx.stepByStep}
                  </a>
                </div>
              </div>
            )}
          </section>
        )}

        {selected.length > 0 && (
          <div class="muster-next">
            <a class="btn btn-primary" href={href(locale, 'plan')}>
              {tx.firstSteps}
            </a>
            {!full && (
              <a class="btn" href={href(locale, 'check')}>
                {tx.allDetails}
              </a>
            )}
          </div>
        )}

        {full && fp && fp.services.length > 0 && (
          <div class="muster-details">
            {fp.themes.length > 0 && (
              <>
                <h2>{tx.themesTitle}</h2>
                <ul class="rows themes">
                  {fp.themes.map((theme) => {
                    const text = tx.themeText(theme, names, companyName);
                    return (
                      <li key={`${theme.id}-${theme.companyId ?? ''}`} class="theme">
                        <strong>{text.title}</strong>
                        <p class="small muted">{text.body}</p>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            <h2>{tx.eachApp}</h2>
            <ul class="rows index-list">
              {fp.services.map((s) => (
                <li key={s.id}>
                  <a href={href(locale, 'app', s.id)}>{s.shortName}</a>
                  <span class="small muted">{s.summary}</span>
                </li>
              ))}
            </ul>
            <details class="matrix-details">
              <summary>{tx.tableSummary}</summary>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
              <div class="matrix-wrap" tabindex={0} role="region" aria-label={tx.tableLabel}>
                <table class="dm dm-cat">
                  <caption class="visually-hidden">{tx.tableCaption}</caption>
                  <thead>
                    <tr>
                      <th scope="col" class="dm-area-h">
                        {tx.kindHead}
                      </th>
                      {fp.services.map((s) => (
                        <th scope="col" key={s.id} class="dm-col">
                          <abbr title={s.shortName}>{CODES[s.id]}</abbr>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fp.matrix.map((row) => (
                      <tr key={row.category}>
                        <th scope="row" class="dm-area">
                          {t.categories[row.category]}
                        </th>
                        {fp.services.map((s) => {
                          const has = row.serviceIds.includes(s.id);
                          return (
                            <td key={s.id} class={`dm-cell ${has ? 'l3' : 'l0'}`}>
                              <span aria-hidden="true" class="dm-sq" />
                              <span class="visually-hidden">{has ? tx.yes : tx.no}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
