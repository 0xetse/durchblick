// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KEYS, clearAll, exportAll, hasConsent, listStored, read, resetStorageCheck, setConsent, write } from '~/domain/storage';

describe('consent-gated storage', () => {
  beforeEach(() => localStorage.clear());

  it('writes nothing without consent', () => {
    expect(write(KEYS.done, ['a'])).toBe(false);
    expect(localStorage.length).toBe(0);
    expect(listStored()).toEqual([]);
  });

  it('persists after consent and can export and clear everything', () => {
    setConsent(true);
    expect(hasConsent()).toBe(true);
    expect(write(KEYS.done, ['a'])).toBe(true);
    expect(read(KEYS.done, [])).toEqual(['a']);
    expect(JSON.parse(exportAll()).data[KEYS.done]).toEqual(['a']);
    clearAll();
    expect(localStorage.length).toBe(0);
    expect(hasConsent()).toBe(false);
  });

  it('withdrawing consent deletes stored data', () => {
    setConsent(true);
    write(KEYS.services, ['google']);
    setConsent(false);
    expect(listStored()).toEqual([]);
  });

  it('never touches keys of other sites/apps', () => {
    localStorage.setItem('other', 'x');
    setConsent(true);
    clearAll();
    expect(localStorage.getItem('other')).toBe('x');
  });
});

describe('storage check', () => {
  it('writes its probe once per page, not on every read (two open tabs ping-ponged)', () => {
    resetStorageCheck();
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    for (let i = 0; i < 20; i++) {
      hasConsent();
      listStored();
      read(KEYS.services, []);
    }
    expect(spy.mock.calls.filter(([k]) => k === 'durchblick:probe')).toHaveLength(1);
    spy.mockRestore();
  });
});
