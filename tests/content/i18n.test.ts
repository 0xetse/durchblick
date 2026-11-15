import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getContent, overlayProblems } from '~/domain/content';
import { localizeUrl, switchPath } from '~/i18n';

const root = join(process.cwd(), 'content');
const files = (dir: string): string[] =>
  readdirSync(join(root, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.yaml') ? [join(dir, e.name)] : [],
  );
/** German files with prose that must exist in English (sources are citations and stay as they are). */
const translatable = [...files('services'), ...files('guides'), 'companies.yaml', 'alternatives.yaml', 'simulator.yaml', 'examples.yaml'];

describe('English content overlays', () => {
  it('exist for every German file with prose', () => {
    for (const f of translatable) expect(() => readFileSync(join(root, 'i18n/en', f)), f).not.toThrow();
  });

  it('change only prose – ids, ratings, links, dates and citations stay identical', () => {
    for (const f of translatable) {
      const de = parse(readFileSync(join(root, f), 'utf8'));
      const en = parse(readFileSync(join(root, 'i18n/en', f), 'utf8'));
      expect(overlayProblems(de, en), f).toEqual([]);
    }
  });

  it('load and validate like the German content, with English text', () => {
    const de = getContent('de');
    const en = getContent('en');
    expect(en.services.map((s) => s.id).sort()).toEqual(de.services.map((s) => s.id).sort());
    expect(en.guides.map((g) => g.id)).toEqual(de.guides.map((g) => g.id));
    const g = (b: typeof de) => b.services.find((s) => s.id === 'google')!;
    expect(g(en).summary).not.toEqual(g(de).summary);
    // Ratings are structure: identical in every language; only the explanation is translated.
    const ratings = (b: typeof de) => Object.entries(g(b).assessment).map(([k, v]) => [k, (v as { level: number; confidence: string }).level + ':' + (v as { confidence: string }).confidence]);
    expect(ratings(en)).toEqual(ratings(de));
  });
});

describe('locale helpers', () => {
  it('maps a page to the same page in the other language', () => {
    expect(switchPath('/dienste/google/', 'en')).toBe('/en/apps/google/');
    expect(switchPath('/en/guides/google-takeout/', 'de')).toBe('/anleitungen/google-takeout/');
    expect(switchPath('/', 'en')).toBe('/en/');
    expect(switchPath('/en/', 'de')).toBe('/');
    expect(switchPath('/einstellungen/', 'en')).toBe('/en/settings/');
  });

  it('points official links to English help pages where the pattern is known', () => {
    expect(localizeUrl('https://help.snapchat.com/hc/de/articles/1', 'en')).toBe('https://help.snapchat.com/hc/en-us/articles/1');
    expect(localizeUrl('https://support.google.com/accounts/answer/1?hl=de', 'en')).toBe('https://support.google.com/accounts/answer/1?hl=en');
    expect(localizeUrl('https://telegram.org/faq/de#f-x', 'en')).toBe('https://telegram.org/faq');
    expect(localizeUrl('https://myaccount.google.com/', 'en')).toBe('https://myaccount.google.com/');
    expect(localizeUrl('https://help.snapchat.com/hc/de/articles/1', 'de')).toBe('https://help.snapchat.com/hc/de/articles/1');
  });
});
