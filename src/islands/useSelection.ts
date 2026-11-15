/**
 * The app selection shared by the islands that let people pick apps (Start,
 * Meine Apps im Detail). One place for the rules (see domain/selection.ts):
 * - Source: a shared link (#d=…, taken over and removed from the address),
 *   else this tab, else the apps saved after consent.
 * - Every change is kept for this tab (and, with consent, on this device).
 *   Nothing is ever written into an address.
 * - "Alles löschen" (RESET_EVENT) empties it; a page restored from the
 *   back/forward cache reads it again.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  RESET_EVENT,
  cleanSelectionFromUrl,
  hasSelectionInHash,
  currentSelection,
  initialSelection,
  rememberSelection,
  selectionFromHash,
  type SelectionSource,
} from '~/domain/selection';

export function useSelection(ids: readonly string[], onLoad?: (initial: { ids: string[]; source: SelectionSource }) => void) {
  const [selected, setState] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Only a change the person makes here is kept (this tab, and with consent on
  // this device). Loading, taking over a link, a cache restore or "Alles
  // löschen" write nothing: a shared link must never end up in the saved
  // selection, not even on the next page load (final review, P1).
  const edited = useRef<string[] | null>(null);
  const setSelected = (v: string[] | ((prev: string[]) => string[])) =>
    setState((prev) => {
      const next = typeof v === 'function' ? v(prev) : v;
      edited.current = next;
      return next;
    });

  useEffect(() => {
    const initial = initialSelection(ids, window.location.hash);
    // A shared or older link: this tab only, then clean the address.
    if (initial.source === 'link') rememberSelection(initial.ids, { device: false });
    cleanSelectionFromUrl();
    setState(initial.ids);
    onLoad?.(initial);
    setHydrated(true);

    // "Alles löschen" has already removed everything; only show it.
    const reset = () => setState([]);
    // A link with a selection opened on the same page (e.g. pasted into the address bar).
    const onHash = () => {
      if (!hasSelectionInHash(window.location.hash)) return;
      const next = selectionFromHash(window.location.hash, ids);
      cleanSelectionFromUrl();
      if (!next.length) return;
      rememberSelection(next, { device: false });
      setState(next);
    };
    // Back/forward cache: the page comes back as it was. Another page in this
    // tab may have changed or deleted ("Alles löschen") the selection meanwhile:
    // always take what this tab knows now – also when that is nothing.
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setState(currentSelection(ids));
    };
    addEventListener(RESET_EVENT, reset);
    addEventListener('hashchange', onHash);
    addEventListener('pageshow', onShow);
    return () => {
      removeEventListener(RESET_EVENT, reset);
      removeEventListener('hashchange', onHash);
      removeEventListener('pageshow', onShow);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || edited.current !== selected) return;
    edited.current = null;
    rememberSelection(selected);
  }, [selected, hydrated]);

  return { selected, setSelected, hydrated };
}
