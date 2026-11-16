import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { excerpt, mdCell, mdCodeCell, mdRow } from '../../scripts/lib/markdown-table.mjs';

/**
 * Splits one GFM table row into raw cells the way GFM does: a backslash and
 * the following character form one unit, an unescaped `|` ends the cell.
 * (Cross-checked against micromark-extension-gfm-table.)
 */
export function splitRow(row: string): string[] {
  const inner = row.trim().replace(/^\|/, '');
  const cells: string[] = [];
  let cell = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]!;
    if (c === '\\' && i + 1 < inner.length) {
      cell += c + inner[i + 1];
      i++;
    } else if (c === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += c;
    }
  }
  if (cell.trim() !== '') cells.push(cell.trim());
  return cells;
}

/** What a reader sees: Markdown backslash escapes of ASCII punctuation removed. */
const shown = (cell: string) => cell.replace(/\\([!-/:-@[-`{-~])/g, '$1');

/** One cell between two others; returns what the parser sees in the middle. */
const roundTrip = (value: unknown) => {
  const cells = splitRow(mdRow(['A', mdCell(value), 'Z']));
  return { count: cells.length, middle: shown(cells[1] ?? ''), last: cells[2] };
};

describe('mdCell (CodeQL js/incomplete-sanitization)', () => {
  it('keeps text that already contains a backslash before a pipe in one cell', () => {
    // The previous escaping turned `a \| b` into `a \\| b`, which ends the cell after the backslash.
    expect(splitRow('| A | a \\\\| b | Z |')).toHaveLength(4); // old output for `a \| b`: broken
    expect(roundTrip('a \\| b')).toEqual({ count: 3, middle: 'a \\| b', last: 'Z' });
  });

  it('preserves existing backslashes, also at the end of the text', () => {
    for (const v of ['C:\\Users\\x\\', 'ends with \\', '\\\\|', '\\']) {
      expect(roundTrip(v)).toEqual({ count: 3, middle: v, last: 'Z' });
    }
  });

  it('shows Markdown special characters literally instead of formatting them', () => {
    const v = '*em* _u_ ~s~ [l](https://e.example) ![i](x) <b>x</b> &lt; `code` # h | pipe';
    expect(roundTrip(v)).toEqual({ count: 3, middle: v, last: 'Z' });
    expect(mdCell(v)).not.toMatch(/(?<!\\)[*_~[\]<>&`|]/);
  });

  it('keeps gender stars in quotations verbatim (they were eaten as emphasis before)', () => {
    const v = 'Standardmäßig kann jede*r Nutzer*in, der*die dein Profil aufruft';
    expect(roundTrip(v).middle).toBe(v);
    // Unescaped, `*r Nutzer*` is read as emphasis and the stars disappear ("jeder Nutzerin").
    expect(mdCell(v)).toContain('jede\\*r Nutzer\\*in');
  });

  it('turns line breaks and tabs into single spaces so a row never ends early', () => {
    expect(mdCell('multi\nline\r\n\ttab  x')).toBe('multi line tab x');
    expect(mdCell('a\nb')).not.toContain('\n');
  });

  it('accepts other input types', () => {
    expect(mdCell(42)).toBe('42');
    expect(mdCell(0)).toBe('0');
    expect(mdCell(false)).toBe('false');
    expect(mdCell(null)).toBe('');
    expect(mdCell(undefined)).toBe('');
    expect(mdCell('')).toBe('');
  });

  it('escapes exactly once: escaping is not repeated on already escaped output', () => {
    // Each value is escaped once; a second pass would make the backslashes visible.
    expect(shown(mdCell('a|b'))).toBe('a|b');
    expect(shown(mdCell(mdCell('a|b')))).toBe('a\\|b');
  });
});

describe('mdCodeCell', () => {
  it('escapes pipes inside the code span', () => {
    expect(mdCodeCell('a|b.md:3')).toBe('`a\\|b.md:3`');
    expect(splitRow(mdRow(['A', mdCodeCell('a|b.md:3'), 'Z']))).toHaveLength(3);
  });

  it('falls back to escaped plain text for backticks and backslashes', () => {
    expect(mdCodeCell('with`tick.md:1')).toBe(mdCell('with`tick.md:1'));
    expect(roundTrip('win\\path.md:2').middle).toBe('win\\path.md:2');
    expect(mdCodeCell('win\\path.md:2')).toBe(mdCell('win\\path.md:2'));
  });

  it('keeps ordinary paths as code', () => {
    expect(mdCodeCell('content/services/a.yaml:12')).toBe('`content/services/a.yaml:12`');
  });
});

describe('excerpt', () => {
  it('cuts at code points, never inside an emoji, and marks only real cuts', () => {
    expect(excerpt('😀😀😀', 2)).toBe('😀😀…');
    expect(excerpt('kurz', 70)).toBe('kurz');
    expect(excerpt(null, 5)).toBe('');
  });
});

describe('scripts/zitate-inventar.mjs output', () => {
  it('every table row has as many cells as its header', () => {
    const md = execFileSync('node', ['scripts/zitate-inventar.mjs'], { encoding: 'utf8' });
    const lines = md.split('\n');
    let header = 0;
    let checked = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (!line.startsWith('|')) {
        header = 0;
        continue;
      }
      if (/^\|(-+\|)+$/.test(line)) continue;
      if (header === 0) {
        header = splitRow(line).length;
        continue;
      }
      expect(splitRow(line), `line ${i + 1}`).toHaveLength(header);
      checked++;
    }
    expect(checked).toBeGreaterThan(100);
  });
});
