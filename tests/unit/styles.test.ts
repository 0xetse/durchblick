import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * A lost "}" in one stylesheet silently swallows every rule after it in the
 * bundle – in 2026-11 it took the sticky header and the phone menu with it
 * (after a merge). Builds and type checks do not notice; this does.
 */
const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');

describe('stylesheets', () => {
  const files = readdirSync('src/styles').filter((f) => f.endsWith('.css'));
  it.each(files)('%s has balanced braces', (f) => {
    let depth = 0;
    for (const ch of strip(readFileSync(join('src/styles', f), 'utf8'))) {
      depth += ch === '{' ? 1 : ch === '}' ? -1 : 0;
      expect(depth).toBeGreaterThanOrEqual(0);
    }
    expect(depth).toBe(0);
  });
});
