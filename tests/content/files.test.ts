/**
 * File-level validation: every content file parses against its schema and
 * every source reference resolves. Runs without the full bundle so content can
 * be authored incrementally.
 */
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';
import { refId } from '~/domain/content';
import { guideSchema, serviceSchema, sourceSchema } from '~/domain/schema';

const load = (g: Record<string, string>) => Object.entries(g);
const services = load(import.meta.glob<string>('/content/services/*.yaml', { eager: true, query: '?raw', import: 'default' }));
const guides = load(import.meta.glob<string>('/content/guides/*.yaml', { eager: true, query: '?raw', import: 'default' }));
const sources = load(import.meta.glob<string>('/content/sources/*.yaml', { eager: true, query: '?raw', import: 'default' }));

const sourceIds = new Set<string>();
for (const [, raw] of sources) {
  const r = z.array(sourceSchema).safeParse(parse(raw));
  if (r.success) r.data.forEach((s) => sourceIds.add(s.id));
}

function collectRefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectRefs(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'sources' && Array.isArray(v)) v.forEach((x) => out.push(refId(x)));
      else collectRefs(v, out);
    }
  }
  return out;
}

const check = (file: string, raw: string, schema: z.ZodType) => {
  const result = schema.safeParse(parse(raw));
  if (!result.success) throw new Error(`${file}\n${z.prettifyError(result.error)}`);
  const missing = collectRefs(result.data).filter((r) => !sourceIds.has(r));
  expect(missing, `${file}: unknown source ids`).toEqual([]);
};

describe('content files', () => {
  it.each(sources)('%s', (file, raw) => {
    const r = z.array(sourceSchema).safeParse(parse(raw));
    if (!r.success) throw new Error(`${file}\n${z.prettifyError(r.error)}`);
  });
  it.each(services)('%s', (file, raw) => check(file, raw, serviceSchema));
  it.each(guides)('%s', (file, raw) => check(file, raw, z.array(guideSchema)));
});
