#!/usr/bin/env node
// Inventory of verbatim third-party quotations for a later legal review.
// Lists every quotation in content/ (incl. the English overlays and the
// source records in content/sources/) and docs/research/ with file:line, the source it belongs to (type, tier,
// publisher, language), length, language and a heuristic review flag.
// It does NOT decide whether a use is lawful; it only makes the places findable.
//
//   node scripts/zitate-inventar.mjs            # Markdown to stdout
//   node scripts/zitate-inventar.mjs --summary  # counts only

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';
import { excerpt, mdCell, mdCodeCell, mdRow } from './lib/markdown-table.mjs';

const root = new URL('..', import.meta.url).pathname;
const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// --- sources -----------------------------------------------------------------
const sources = new Map();
for (const f of walk(join(root, 'content/sources')).filter((p) => p.endsWith('.yaml'))) {
  for (const s of parse(readFileSync(f, 'utf8')) ?? []) sources.set(s.id, s);
}
const sourceLang = (s) => {
  if (!s) return '?';
  if (s.language) return s.language.slice(0, 2);
  const u = s.url ?? '';
  if (/[/?&._-](de|de-de|de_de|hl=de|lang=de)([/?&._-]|$)/i.test(u) || /\.de(\/|$)/.test(new URL(u).hostname + '/')) return 'de';
  if (/[/?&._-](en|en-us|en-gb|en_us|hl=en|lang=en)([/?&._-]|$)/i.test(u)) return 'en';
  return '?';
};

// --- language heuristic --------------------------------------------------------
const DE = /\b(der|die|das|und|nicht|wir|ihre?|dein|deine|sie|ist|werden|mit|für|auf|von|zu|den|dem|eine?n?|oder|wenn|können)\b/gi;
const EN = /\b(the|and|not|we|your|you|is|are|will|with|for|on|of|to|a|an|or|if|can|our|this|that)\b/gi;
const lang = (t) => {
  const d = (t.match(DE) ?? []).length;
  const e = (t.match(EN) ?? []).length;
  if (d >= 2 && d > e * 1.5) return 'de';
  if (e >= 2 && e > d * 1.5) return 'en';
  return '?';
};

// --- quotations ----------------------------------------------------------------
// Typographic quotation marks only (ASCII quotes delimit YAML strings).
const QUOTE = /„([^“”]+)[“”]|“([^”]+)”|«([^»]+)»/g;
const MIN_CHARS = 40; // shorter ones are mostly menu labels or titles
const rows = [];
const files = [
  ...walk(join(root, 'content')).filter((p) => p.endsWith('.yaml')),
  ...walk(join(root, 'docs/research')).filter((p) => /\.(md|ya?ml)$/.test(p)),
];
for (const f of files) {
  const rel = relative(root, f);
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(QUOTE)) {
      const q = (m[1] ?? m[2] ?? m[3]).trim();
      if (q.length < MIN_CHARS) continue;
      // Source: nearest `ref:` on this or up to 3 lines above; in research notes an id or URL on the line.
      let ref = null;
      if (rel.startsWith('content/sources/')) {
        // A source record quotes itself: the nearest `- id:` above is the source.
        for (let k = i; k >= 0 && !ref; k--) ref = lines[k].match(/^- id:\s*([\w-]+)/)?.[1] ?? null;
      }
      for (let k = i; k >= Math.max(0, i - 3) && !ref; k--) ref = lines[k].match(/\bref:\s*([\w-]+)/)?.[1] ?? null;
      const s = ref ? sources.get(ref) : null;
      const field = line.match(/^\s*-?\s*([a-zA-Z]+):/)?.[1] ?? (rel.startsWith('docs/') ? 'Notiz' : '?');
      const ql = lang(q);
      const sl = sourceLang(s);
      const flags = [];
      if (q.length > 300) flags.push('lang (>300 Zeichen)');
      if (s && ['journalism', 'secondary'].includes(s.type)) flags.push('Presse/Sekundärquelle');
      if (s && s.type === 'research') flags.push('wissenschaftliche Veröffentlichung');
      if (ql !== '?' && sl !== '?' && ql !== sl) flags.push(`übersetzt? (Zitat ${ql}, Quelle ${sl})`);
      if (rel.startsWith('content/i18n/') && field !== 'note' && ql === 'en') flags.push('englische Fassung: Übersetzung prüfen');
      if (!s && rel.startsWith('content/')) flags.push('keine direkte Quellenzuordnung in der Zeile');
      rows.push({ rel, line: i + 1, field, ref: ref ?? '–', type: s?.type ?? '–', tier: s?.tier ?? '–', publisher: s?.publisher ?? '–', sl, ql, len: q.length, q, flags });
    }
  });
}

const flagged = rows.filter((r) => r.flags.length);
const byType = rows.reduce((a, r) => ((a[r.type] = (a[r.type] ?? 0) + 1), a), {});

if (process.argv.includes('--summary')) {
  console.log(JSON.stringify({ quotations: rows.length, flagged: flagged.length, byType }, null, 2));
  process.exit(0);
}

const out = [];
out.push('# Inventar wörtlicher Zitate Dritter', '');
out.push(`Erzeugt mit \`node scripts/zitate-inventar.mjs\`. Erfasst Zitate in typografischen Anführungszeichen ab ${MIN_CHARS} Zeichen in \`content/\` (inkl. \`content/i18n/en/\` und \`content/sources/\`) und \`docs/research/\`.`, '');
out.push('**Keine rechtliche Bewertung.** Die Markierungen sind Heuristiken, die Stellen für eine Prüfung auffindbar machen. Nicht markiert heißt nicht „geklärt“. Sprache wird geschätzt; „?“ = nicht bestimmbar.', '');
out.push(`Zitate gesamt: **${rows.length}** · markiert: **${flagged.length}**`, '');
out.push('| Quellentyp | Zitate |', '|---|---|');
for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) out.push(mdRow([mdCell(t), mdCell(n)]));
out.push('', '## Markierte Stellen (zuerst prüfen)', '', '| Fundstelle | Feld | Quelle (Typ, Tier) | Herausgeber | Sprache Zitat/Quelle | Länge | Markierung | Auszug |', '|---|---|---|---|---|---|---|---|');
const source = (r) => mdCell(`${r.ref} (${r.type}, ${r.tier})`);
for (const r of flagged) {
  out.push(mdRow([mdCodeCell(`${r.rel}:${r.line}`), mdCell(r.field), source(r), mdCell(r.publisher), mdCell(`${r.ql}/${r.sl}`), mdCell(r.len), mdCell(r.flags.join('; ')), mdCell(excerpt(r.q, 70))]));
}
out.push('', '## Alle übrigen Stellen', '', '| Fundstelle | Feld | Quelle (Typ, Tier) | Sprache Zitat/Quelle | Länge | Auszug |', '|---|---|---|---|---|---|');
for (const r of rows.filter((x) => !x.flags.length)) {
  out.push(mdRow([mdCodeCell(`${r.rel}:${r.line}`), mdCell(r.field), source(r), mdCell(`${r.ql}/${r.sl}`), mdCell(r.len), mdCell(excerpt(r.q, 70))]));
}
console.log(out.join('\n'));
