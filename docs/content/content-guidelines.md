# Redaktionsleitfaden & Content-Modell

Stand: 2026-10-07. Technischer Vertrag: `src/domain/schema.ts`. Rubrik: `assessment-methodology.md`.

## Entitäten

| Entität | Datei | Kernfelder |
|---|---|---|
| Unternehmen | `content/companies.yaml` | Name, EU-Gesellschaft, Sitz, Beschreibung, Quellen |
| Dienst | `content/services/<id>.yaml` | Zusammenfassung, Wusstest-du, Geschäftsmodell, Datenpunkte, Ableitungen, Zwecke, Weitergabe, Speicherdauer, Datenreise, Datenprofil, Alternativ-Kategorie, `reviewedAt` |
| Datenpunkt | im Dienst | Kategorie, Titel (Stufe 1), Detail (Stufe 2), Technik (Stufe 3), **Herkunft**, **Mechanismen**, **Gewissheit**, Bedingung, Quellen (Stufe 4) |
| Ableitung | im Dienst | Titel, Detail, **Stufe** (`documented`/`possible`), Grundlage (Datenpunkt-IDs), Quellen |
| Anleitung | `content/guides/<dienst>.yaml` | Art, Ziel, Warum, Was ändert sich, **Was ändert sich nicht**, Wirkung, Minuten, Schwierigkeit, Plattformen, offizieller Link, Schritte, Region, **Prüfstatus + Prüfdatum + Methode**, Quellen |
| Quelle | `content/sources/*.yaml` | Titel, Herausgeber, URL, **Tier**, Typ, Abrufdatum, Region |
| Alternative | `content/alternatives.yaml` | Einordnung, „Ohne Wechsel", etablierter Dienst + Alternativen mit Abwägungen |
| Simulator | `content/simulator.yaml` | Signale, Regeln (benötigte Signale, Stufe, sensibel), Takeaways |

## Fortschreitende Tiefe

1. **Stufe 1** – ein Satz, Alltagssprache („Instagram merkt sich, womit du interagierst.")
2. **Stufe 2** – Beispiele („Likes, Follows, wie lange du ein Reel ansiehst")
3. **Stufe 3** – Technik (optional)
4. **Stufe 4** – Quelle mit Abrufdatum

## Schreibregeln

- Du-Form, ruhig, konkret. Keine Wörter wie „ausspionieren", „Datenkrake", „gläsern".
- Kein Pauschalurteil über Unternehmen. Beschreiben, nicht anklagen.
- Möglichkeit ≠ Tatsache: „kann", „laut Anbieter", „möglich, aber nicht belegt" – passend zur Gewissheitsstufe im Feld.
- Jede Maßnahme sagt, was sie **nicht** ändert.
- Keine erfundenen Menüpfade. Wenn unklar: `needs-verification`, offizieller Link, keine Schritte.
- Zahlen nur mit Quelle und Datum.

## Quellen-Tiers

| Tier | Typen | Verwendung |
|---|---|---|
| 1 | Datenschutzerklärung, Hilfe-Center, offizielle Doku, Transparenzbericht, Behörde, Gesetz, Gericht | Pflicht für Aussagen „laut Anbieter" und für geprüfte Anleitungen |
| 2 | Forschung, große journalistische Recherchen | Ableitungen, Kontext, „laut Forschung" |
| 3 | Sekundärquellen (Lexika, Blogs) | nur ergänzend, nie alleiniger Beleg für eine Aussage über einen Anbieter |

## Prüfung & Korrektur

- Neuer/geänderter Inhalt: `npm run validate:content` muss grün sein; Recherche-Notizen mit Zitatstellen in `docs/research/services/<id>.md`.
- Prüfrhythmus: Dienst `reviewedAt` spätestens alle 6 Monate; Anleitungen bei Änderung der Hilfeseite.
- Korrekturen: Änderung im YAML + Eintrag im Commit; ab Änderungsmonitor zusätzlich in `content/changes/`.
