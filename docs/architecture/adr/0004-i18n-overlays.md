# ADR-0004: Mehrsprachigkeit über Text-Overlays

Status: akzeptiert · 2026-10-07

## Entscheidung
Deutsch ist Ausgangssprache. Struktur (IDs, Bewertungen, Quellen, URLs) existiert genau einmal. Übersetzungen ergänzen später nur Textfelder per ID in `content/i18n/<locale>/…`; ein Test prüft Vollständigkeit. UI-Texte liegen in `src/i18n/<locale>.ts` mit identischem Typ.

## Alternativen
- Felder als `{de, en}`-Objekte: robust, aber für Redaktion im MVP schwerfällig.
- Komplette Kopie pro Sprache: führt zu abweichenden Bewertungen zwischen Sprachen (zwei Wahrheiten).

## Konsequenzen
Bewertungen können zwischen Sprachen nie auseinanderlaufen. Umkehrbarkeit: hoch.

## Umsetzung (2026-10-18, Englisch)

- Overlays liegen als vollständige Kopien der deutschen Dateien unter `content/i18n/en/` (gleiche Schlüssel, gleiche Reihenfolge). Der Lader (`src/domain/content.ts`) übernimmt daraus **nur Fließtext**; Kennungen, Aufzählungswerte, Links, Daten, Bewertungen und Quellenzitate (`note`) kommen immer aus dem Deutschen. Abweichungen brechen den Build ab; `tests/content/i18n.test.ts` prüft Vollständigkeit und Strukturgleichheit.
- Routen: Deutsch an der Wurzel, Englisch unter `/en/` mit englischen Pfaden (`src/i18n/index.ts`, `ROUTES`). Seiten liegen einmal in `src/views/`, je Sprache gibt es eine dünne Seite. Die Sprache folgt der Adresse.
- UI-Texte: gemeinsames Wörterbuch `src/i18n/de.ts`/`en.ts` (typgleich); seitenspezifische Texte liegen zweisprachig in der jeweiligen Datei.
- Für englische Leser: offizielle Links werden wo möglich auf englische Hilfeseiten umgestellt (`localizeUrl`), deutschsprachige Quellen sind als „in German“ markiert, englische Rechtstexte verweisen auf die verbindliche deutsche Fassung.
