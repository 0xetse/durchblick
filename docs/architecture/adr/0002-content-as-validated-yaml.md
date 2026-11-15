# ADR-0002: Wissen als validiertes YAML mit Zod-Schemas

Status: akzeptiert · 2026-10-07

## Entscheidung
Alle Fakten (Dienste, Datenpunkte, Ableitungen, Anleitungen, Quellen, Alternativen, Simulator) liegen als YAML in `content/`. `src/domain/schema.ts` definiert strikte Zod-Schemas; `src/domain/content.ts` validiert im Build und prüft Querverweise (Quellen-IDs, Datenpunkt-IDs, Dienst-IDs). Ein Fehler bricht den Build ab.

Erzwungene Regeln u. a.: jede Aussage hat `sources`; Herkunft (`provenance`) und Gewissheit (`evidence`/`level`) sind getrennte Pflichtfelder; als „verified" markierte Anleitungen brauchen eine Tier-1-Quelle; URLs nur `https`.

## Alternativen
Astro Content Collections (koppelt an Astro), Headless-CMS (Kosten, Drittanbieter, Datenschutzfragen), Markdown mit Frontmatter (für stark strukturierte Daten unhandlich).

## Konsequenzen
Migrationspfad: Schemas sind die API-Verträge; ein späteres CMS oder eine Datenbank kann dieselben Schemas validieren. Umkehrbarkeit: hoch.
