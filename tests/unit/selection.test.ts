// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RESET_EVENT,
  TAB_KEY,
  addToSelection,
  cleanSelectionFromUrl,
  currentSelection,
  forgetEverything,
  initialSelection,
  listTab,
  readTabSelection,
  rememberSelection,
  resetTabCheck,
  selectionFromHash,
  shareLink,
  takeOverLink,
} from '~/domain/selection';
import { KEYS, setConsent, write } from '~/domain/storage';

/** D-N24 (2026-11-13): the selection lives in this tab, never in an address. */
const ids = ['google', 'instagram', 'tiktok'];

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  resetTabCheck();
  history.replaceState(null, '', '/');
});

describe('the selection in this tab', () => {
  it('is kept in sessionStorage and never written into the address', () => {
    const before = history.length;
    rememberSelection(['google', 'tiktok']);
    expect(JSON.parse(sessionStorage.getItem(TAB_KEY)!)).toEqual(['google', 'tiktok']);
    expect(location.hash).toBe('');
    expect(history.length).toBe(before);
    expect(localStorage.length).toBe(0); // no consent: nothing on the device
  });

  it('goes to the device only with consent', () => {
    setConsent(true);
    rememberSelection(['instagram']);
    expect(JSON.parse(localStorage.getItem(KEYS.services)!)).toEqual(['instagram']);
  });

  it('an empty selection leaves no entry behind', () => {
    rememberSelection(['google']);
    rememberSelection([]);
    expect(sessionStorage.getItem(TAB_KEY)).toBeNull();
    expect(listTab()).toEqual([]);
  });

  it('reads only known, de-duplicated ids and survives broken values', () => {
    sessionStorage.setItem(TAB_KEY, JSON.stringify(['google', 'evil', 'google', 3]));
    expect(readTabSelection(ids)).toEqual(['google']);
    sessionStorage.setItem(TAB_KEY, '{"not":"a list"}');
    expect(readTabSelection(ids)).toEqual([]);
    sessionStorage.setItem(TAB_KEY, 'not json');
    expect(readTabSelection(ids)).toBeUndefined();
  });

  it('starts from a shared link, else this tab, else the consented device copy', () => {
    expect(initialSelection(ids, '#d=tiktok')).toEqual({ ids: ['tiktok'], source: 'link' });
    expect(initialSelection(ids, '')).toEqual({ ids: [], source: 'none' });
    setConsent(true);
    write(KEYS.services, ['instagram']);
    expect(initialSelection(ids, '')).toEqual({ ids: ['instagram'], source: 'device' });
    rememberSelection(['google']);
    expect(initialSelection(ids, '')).toEqual({ ids: ['google'], source: 'tab' });
    expect(initialSelection(ids, '#d=nonsense')).toEqual({ ids: ['google'], source: 'tab' });
  });

  it('"In meinen Plan übernehmen" adds one app', () => {
    rememberSelection(['google']);
    addToSelection('tiktok', ids);
    addToSelection('tiktok', ids);
    addToSelection('unknown', ids);
    expect(readTabSelection(ids)).toEqual(['google', 'tiktok']);
  });

  it('works without sessionStorage (blocked): no crash, nothing kept', () => {
    const spy = vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    resetTabCheck();
    expect(() => rememberSelection(['google'])).not.toThrow();
    expect(readTabSelection(ids)).toBeUndefined();
    spy.mockRestore();
  });
});

describe('links with a selection', () => {
  it('fill only this tab: a shared link never replaces what the person saved on this device', () => {
    setConsent(true);
    rememberSelection(['google']);
    history.replaceState(null, '', '/warum/#d=tiktok,bogus');
    takeOverLink(location.hash, ids);
    expect(readTabSelection(ids)).toEqual(['tiktok']);
    expect(JSON.parse(localStorage.getItem(KEYS.services)!)).toEqual(['google']);
    expect(location.hash).toBe('');
  });

  it('with only unknown ids keep the selection of this tab', () => {
    rememberSelection(['instagram']);
    history.replaceState(null, '', '/warum/#d=bogus');
    takeOverLink(location.hash, ids);
    expect(readTabSelection(ids)).toEqual(['instagram']);
    expect(location.hash).toBe('');
  });

  it('after "Alles löschen" the current selection is empty (back/forward cache resync)', () => {
    rememberSelection(['google']);
    forgetEverything();
    expect(currentSelection(ids)).toEqual([]);
  });

  it('parses only known, de-duplicated ids', () => {
    expect(selectionFromHash('#d=google,google,instagram', ids)).toEqual(['google', 'instagram']);
    expect(selectionFromHash('#d=GOOGLE', ids)).toEqual([]);
    expect(selectionFromHash('#d=foo,<script>', ids)).toEqual([]);
    expect(selectionFromHash('#main', ids)).toEqual([]);
    expect(selectionFromHash('#x=1&d=google', ids)).toEqual(['google']);
  });

  it('are cleaned from the address without a new history entry, keeping history.state', () => {
    history.replaceState({ durchblickStep: 2 }, '', '/plan/?x=1#d=google');
    const before = history.length;
    cleanSelectionFromUrl();
    expect(location.pathname + location.search + location.hash).toBe('/plan/?x=1');
    expect(history.length).toBe(before);
    expect(history.state).toEqual({ durchblickStep: 2 });
  });

  it('never touch a plain anchor', () => {
    history.replaceState(null, '', '/#main');
    cleanSelectionFromUrl();
    expect(location.hash).toBe('#main');
  });

  it('only come into being through the explicit share link', () => {
    expect(shareLink('/plan/', ['google', 'tiktok'])).toBe(`${location.origin}/plan/#d=google,tiktok`);
    expect(location.hash).toBe('');
  });
});

describe('"Alles löschen"', () => {
  it('removes the device copy, this tab and a selection in the address, and tells the islands', () => {
    setConsent(true);
    rememberSelection(['google']);
    history.replaceState(null, '', '/#d=google');
    const reset = vi.fn();
    addEventListener(RESET_EVENT, reset);
    forgetEverything();
    removeEventListener(RESET_EVENT, reset);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.getItem(TAB_KEY)).toBeNull();
    expect(location.hash).toBe('');
    expect(reset).toHaveBeenCalledOnce();
  });
});
