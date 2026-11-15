/**
 * The app selection (D-N24, decided 2026-11-13): it lives in this tab only.
 *
 * - Standard: sessionStorage of this tab. It survives reload, back/forward and
 *   moving between pages in the same tab, and is never written into an address
 *   – so it does not end up in the browser history, its address-bar
 *   suggestions or history sync.
 * - Not "traceless": browsers keep sessionStorage on disk to restore tabs
 *   (crash, "reopen closed tab") until they discard the session.
 * - After consent ("auf diesem Gerät merken") the selection is also kept in
 *   localStorage (storage.ts), as before.
 * - Shared links (#d=…) still work: the selection is taken over into this tab
 *   and removed from the address right away. A link with a selection only
 *   comes into being through the explicit "Link mit meiner Auswahl teilen".
 *
 * Measurements and the decision: docs/privacy/d-n24-entscheidungsvorlage.md
 */
import type { Locale } from '~/i18n';
import { KEYS, NS, clearAll, hasConsent, read, write } from './storage';

export const TAB_KEY = `${NS}selection`;

const TAB_DESCRIPTION = {
  de: 'Welche Apps du in diesem Tab ausgewählt hast (nur Kennungen wie „google“). Ohne Zustimmung, nur für diesen Tab: Schließt du ihn, vergisst Durchblick die Auswahl. Dein Browser kann sie aber noch aufbewahren, um geschlossene Tabs wiederherzustellen.',
  en: 'Which apps you selected in this tab (only identifiers such as “google”). Without consent, for this tab only: when you close it, Durchblick forgets the selection. Your browser may still keep it to restore closed tabs.',
} as const;

export function tabKeyDescription(locale: Locale = 'de'): string {
  return TAB_DESCRIPTION[locale];
}

/** Checked once per page (writing a probe on every access caused cross-tab ping-pong, see storage.ts). */
let tabUsable: boolean | undefined;

function tab(): Storage | undefined {
  try {
    const s = globalThis.sessionStorage;
    if (tabUsable === undefined) {
      s.setItem(`${NS}probe`, '1');
      s.removeItem(`${NS}probe`);
      tabUsable = true;
    }
    return tabUsable ? s : undefined;
  } catch {
    tabUsable = false;
    return undefined;
  }
}

/** For tests only. */
export function resetTabCheck(): void {
  tabUsable = undefined;
}

const known = (value: unknown, ids: readonly string[]): string[] =>
  Array.isArray(value) ? [...new Set(value.filter((i): i is string => typeof i === 'string' && ids.includes(i)))] : [];

/** The selection kept in this tab; undefined when this tab has none yet. */
export function readTabSelection(ids: readonly string[]): string[] | undefined {
  try {
    const raw = tab()?.getItem(TAB_KEY);
    return raw == null ? undefined : known(JSON.parse(raw), ids);
  } catch {
    return undefined;
  }
}

function writeTabSelection(selection: readonly string[]): void {
  try {
    tab()?.setItem(TAB_KEY, JSON.stringify(selection));
  } catch {
    /* blocked: the page still works, only page changes forget the selection */
  }
}

function clearTabSelection(): void {
  try {
    tab()?.removeItem(TAB_KEY);
  } catch {
    /* ignore */
  }
}

/** Entries this site keeps for this tab – for the transparency views. */
export function listTab(locale: Locale = 'de'): { key: string; value: string; description: string }[] {
  try {
    const raw = tab()?.getItem(TAB_KEY);
    return raw == null ? [] : [{ key: TAB_KEY, value: raw, description: tabKeyDescription(locale) }];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Links that carry a selection (#d=…) – only from "teilen" or older links.
// ---------------------------------------------------------------------------

const LINK = /(?:^#|&)d=([a-z0-9,-]*)/;

/** Parses the selection from a fragment like "#d=google,instagram". */
export function selectionFromHash(hash: string, ids: readonly string[]): string[] {
  const m = LINK.exec(hash);
  return m?.[1] ? known(m[1].split(','), ids) : [];
}

export function hasSelectionInHash(hash: string): boolean {
  return LINK.test(hash);
}

export function hashFromSelection(ids: readonly string[]): string {
  return ids.length ? `#d=${ids.join(',')}` : '';
}

/** Removes "#d=…" from the address without a new history entry; keeps history.state (wizard step). */
export function cleanSelectionFromUrl(): void {
  try {
    if (!hasSelectionInHash(location.hash)) return;
    history.replaceState(history.state, '', `${location.pathname}${location.search}`);
  } catch {
    /* history unavailable */
  }
}

/** The address of a page with this selection – only for the explicit "teilen". */
export function shareLink(path: string, selection: readonly string[]): string {
  return `${location.origin}${path}${hashFromSelection(selection)}`;
}

// ---------------------------------------------------------------------------
// Reading and remembering
// ---------------------------------------------------------------------------

export type SelectionSource = 'link' | 'tab' | 'device' | 'none';

/** The selection to start with: a shared link, else this tab, else the consented device copy. */
export function initialSelection(ids: readonly string[], hash: string): { ids: string[]; source: SelectionSource } {
  if (hasSelectionInHash(hash)) {
    const fromLink = selectionFromHash(hash, ids);
    if (fromLink.length) return { ids: fromLink, source: 'link' };
  }
  const inTab = readTabSelection(ids);
  if (inTab) return { ids: inTab, source: 'tab' };
  const onDevice = hasConsent() ? known(read<unknown>(KEYS.services, []), ids) : [];
  return onDevice.length ? { ids: onDevice, source: 'device' } : { ids: [], source: 'none' };
}

/**
 * Keeps the selection for this tab and – only with consent – on this device.
 * Never touches the address.
 */
export function rememberSelection(selection: readonly string[], options: { device?: boolean } = {}): void {
  // Nothing selected: keep nothing (so "Alles löschen" really leaves no entry).
  if (selection.length) writeTabSelection(selection);
  else clearTabSelection();
  // A link someone else shared fills this tab only; it never replaces what the
  // person saved on this device (that happens once they change the selection).
  if (options.device !== false) write(KEYS.services, selection);
  announceSelection();
}

/** What this tab knows right now (this tab, else the consented device copy) – e.g. after the back/forward cache. */
export function currentSelection(ids: readonly string[]): string[] {
  return initialSelection(ids, '').ids;
}

/** Fired when the selection changed (other islands and the trust panel follow). */
export const SELECTION_EVENT = 'durchblick:selection';
export function announceSelection(): void {
  try {
    globalThis.dispatchEvent?.(new Event(SELECTION_EVENT));
  } catch {
    /* ignore */
  }
}

/** Fired when "Alles löschen" also empties the selection on the open page. */
export const RESET_EVENT = 'durchblick:reset';

/**
 * "Alles löschen": everything Durchblick keeps in this browser – the device
 * copy (after consent), this tab's selection and a selection in the address.
 * What the browser itself keeps (history, tab restore) is outside our reach.
 */
export function forgetEverything(): void {
  clearAll();
  clearTabSelection();
  cleanSelectionFromUrl();
  try {
    globalThis.dispatchEvent?.(new Event(RESET_EVENT));
  } catch {
    /* ignore */
  }
  announceSelection();
}

/** "In meinen Plan übernehmen": adds one app to the selection of this tab. */
export function addToSelection(id: string, ids: readonly string[]): void {
  if (!ids.includes(id)) return;
  let current: string[] = [];
  try {
    const raw = tab()?.getItem(TAB_KEY);
    const value: unknown = raw == null ? (hasConsent() ? read<unknown>(KEYS.services, []) : []) : JSON.parse(raw);
    current = Array.isArray(value) ? value.filter((i): i is string => typeof i === 'string') : [];
  } catch {
    current = [];
  }
  rememberSelection([...new Set([...current.filter((i) => ids.includes(i)), id])]);
}

/**
 * A page without its own selection logic opened with a link carrying a
 * selection (older links, e.g. /dienste/google/#d=…): keep it for this tab
 * and clean the address. Unknown ids are dropped by every reader.
 */
export function takeOverLink(hash: string, ids: readonly string[]): void {
  if (!hasSelectionInHash(hash)) return;
  const fromLink = selectionFromHash(hash, ids);
  if (fromLink.length) rememberSelection(fromLink, { device: false });
  cleanSelectionFromUrl();
}
