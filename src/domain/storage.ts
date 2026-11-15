/**
 * Consent-gated local storage. Nothing is persisted unless the person
 * explicitly chose "auf diesem Gerät merken". Every access is wrapped because
 * storage can be unavailable (private mode, blocked site data).
 * Data never leaves the device: there is no sync and no server.
 */
import type { Locale } from '~/i18n';

export const NS = 'durchblick:';
export const KEYS = {
  consent: `${NS}consent`,
  done: `${NS}plan-done`,
  services: `${NS}services`,
} as const;

/** Human-readable description of every key we may ever write (shown on /transparenz/). */
export const KEY_DESCRIPTIONS: Record<string, string> = {
  [KEYS.consent]: 'Deine Entscheidung, dass Durchblick sich etwas auf diesem Gerät merken darf.',
  [KEYS.done]: 'Welche Maßnahmen in deinem Plan du als erledigt markiert hast (nur IDs der Anleitungen).',
  [KEYS.services]: 'Welche Apps du ausgewählt hast (nur Kennungen wie „google“).',
};
const KEY_DESCRIPTIONS_EN: Record<string, string> = {
  [KEYS.consent]: 'Your decision that Durchblick may remember something on this device.',
  [KEYS.done]: 'Which steps in your plan you have marked as done (only the IDs of the guides).',
  [KEYS.services]: 'Which apps you have selected (only identifiers such as “google”).',
};
const UNKNOWN = { de: 'Unbekannter Eintrag', en: 'Unknown entry' } as const;

/** The key descriptions in the given language. */
export function keyDescriptions(locale: Locale = 'de'): Record<string, string> {
  return locale === 'en' ? KEY_DESCRIPTIONS_EN : KEY_DESCRIPTIONS;
}

/**
 * Whether storage works is checked once per page, not on every access: the
 * check writes, every write fires a "storage" event in the site's other tabs,
 * and their listeners read again – with a check on every read that became an
 * endless ping-pong between two open tabs (audit 2026-11, found on main).
 */
let usable: boolean | undefined;

function store(): Storage | undefined {
  try {
    const s = globalThis.localStorage;
    if (usable === undefined) {
      const probe = `${NS}probe`;
      s.setItem(probe, '1');
      s.removeItem(probe);
      usable = true;
    }
    return usable ? s : undefined;
  } catch {
    usable = false;
    return undefined;
  }
}

/** For tests only: forget the result of the storage check. */
export function resetStorageCheck(): void {
  usable = undefined;
}

export function isAvailable(): boolean {
  return store() !== undefined;
}

export function hasConsent(): boolean {
  try {
    return store()?.getItem(KEYS.consent) === 'local';
  } catch {
    return false;
  }
}

export function setConsent(allowed: boolean): void {
  const s = store();
  if (!s) return;
  try {
    if (allowed) s.setItem(KEYS.consent, 'local');
    else clearAll();
  } catch {
    /* ignore */
  }
  notify();
}

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = store()?.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** Writes only with consent. Returns whether the value was persisted. */
export function write(key: string, value: unknown): boolean {
  if (!hasConsent()) return false;
  try {
    store()?.setItem(key, JSON.stringify(value));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** All keys this site has stored, with values — for the transparency view. */
export function listStored(locale: Locale = 'de'): { key: string; value: string; description: string }[] {
  const s = store();
  if (!s) return [];
  const out: { key: string; value: string; description: string }[] = [];
  try {
    for (let i = 0; i < s.length; i++) {
      const key = s.key(i);
      if (key?.startsWith(NS)) {
        out.push({ key, value: s.getItem(key) ?? '', description: keyDescriptions(locale)[key] ?? UNKNOWN[locale] });
      }
    }
  } catch {
    return [];
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export function exportAll(): string {
  const data = Object.fromEntries(listStored().map((e) => [e.key, safeParse(e.value)]));
  return JSON.stringify({ app: 'durchblick', exportedAt: new Date().toISOString(), data }, null, 2);
}

export function clearAll(): void {
  const s = store();
  if (!s) return;
  try {
    for (const { key } of listStored()) s.removeItem(key);
  } catch {
    /* ignore */
  }
  notify();
}

function safeParse(v: string): unknown {
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

export const CHANGE_EVENT = 'durchblick:storage';
function notify(): void {
  try {
    globalThis.dispatchEvent?.(new Event(CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

// The app selection (tab, links, "Alles löschen") lives in selection.ts.
