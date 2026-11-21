import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import { de } from '~/i18n/de';
import { en } from '~/i18n/en';

const SEMVER = /\b\d+\.\d+\.\d+\b/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? sourceFiles(p) : /\.(astro|ts|tsx|mjs|js)$/.test(e.name) ? [p] : [];
  });
}

describe('software version', () => {
  it('package.json is the only source: no version literal in the app code', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
    const literal = new RegExp(`['"\`]v?${pkg.version.replaceAll('.', '\\.')}['"\`]`);
    for (const f of sourceFiles('src')) expect(readFileSync(f, 'utf8'), f).not.toMatch(literal);
  });

  it('the footer and the transparency page take the version from package.json', () => {
    for (const f of ['src/layouts/Base.astro', 'src/views/Transparenz.astro']) {
      const src = readFileSync(f, 'utf8');
      expect(src, f).toContain("import { version } from '../../package.json';");
    }
    expect(readFileSync('src/layouts/Base.astro', 'utf8')).toMatch(/· Version \{version\}/);
  });

  it('the README heading about the app carries no hand-written version number', () => {
    const heading = readFileSync('README.md', 'utf8')
      .split('\n')
      .find((l) => l.startsWith('## Was die App kann'));
    expect(heading).toBeDefined();
    expect(heading).not.toMatch(SEMVER);
  });

  it('the footer label says "last reviewed" in both languages', () => {
    expect(de.footer.contentReviewed).toBe('Inhalte zuletzt geprüft');
    expect(en.footer.contentReviewed).toBe('Content last reviewed');
  });
});
