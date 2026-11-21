# Sicherheit

*English below.*

## Ein Problem melden

Bitte melde Sicherheitsprobleme **nicht** in einem öffentlichen Issue, sondern vertraulich über GitHub:

**Repository → Reiter „Security“ → „Report a vulnerability“** (private Meldung an die Maintainer).

Falls das nicht möglich ist: E-Mail an **etse@posteo.de** (bitte nur eine kurze Beschreibung; wir antworten mit einem vertraulichen Weg für Details).

Hilfreich sind: betroffene Seite oder Datei, Schritte zum Nachstellen, Browser und erwartete Auswirkung. Bitte keine echten personenbezogenen Daten mitschicken.

Durchblick ist ein ehrenamtliches Projekt ohne Bug-Bounty. Wir bemühen uns, Meldungen zeitnah zu bestätigen und zu beheben, können aber keine festen Fristen zusagen. Wenn du einverstanden bist, nennen wir dich nach der Behebung im Changelog.

## Was in den Rahmen fällt

- Die Website (statische Seiten, Preact-Inseln, Service Worker, Sicherheits-Header und CSP).
- Alles, was dazu führen könnte, dass Daten von Besucherinnen und Besuchern die eigene Herkunft verlassen oder ohne Zustimmung gespeichert werden.
- Die Build- und CI-Konfiguration in diesem Repository (`.github/workflows/`).

Nicht im Rahmen: die Dienste, über die Durchblick schreibt; Angriffe, die vollen Zugriff auf das Gerät der Person voraussetzen; Probleme beim jeweiligen Hosting-Anbieter.

## Wie Durchblick gebaut ist

Durchblick ist eine statische Website ohne Backend, ohne Konten und ohne Cookies. Eine App-Auswahl wird im Browser verarbeitet und ohne Zustimmung nur für den aktuellen Tab gespeichert (`sessionStorage`); dauerhaft (`localStorage`) nur nach ausdrücklicher Zustimmung und nur lokal. Der Service Worker legt ohne Zustimmung Offline-Kopien öffentlicher Dateien der Website im Cache Storage ab, aber keine Auswahl und keine besuchten Einzelseiten (Übersicht in [`README.md`](README.md#datenschutz-philosophie)). Wie das umgesetzt und getestet ist, steht in [`docs/privacy/privacy-architecture.md`](docs/privacy/privacy-architecture.md) und im Bedrohungsmodell [`docs/security/threat-model.md`](docs/security/threat-model.md). Diese Dokumente beschreiben den Stand und seine Grenzen – sie sind keine Garantie.

## Abhängigkeiten und bekannte Schwachstellen

Die CI prüft mit `npm run audit:deps` alle Produktionsabhängigkeiten (`npm audit --omit=dev`) und schlägt bei jeder Meldung ab Schweregrad „moderate“ fehl. Ausnahmen sind nur für einzelne, geprüfte Advisories möglich und stehen in [`scripts/audit-exceptions.json`](scripts/audit-exceptions.json). Jede Ausnahme gilt nur für genau eine GHSA-ID, ein Paket und den betroffenen Versionsbereich und läuft nach höchstens 30 Tagen ab. Danach schlägt die CI wieder fehl, und die Ausnahme muss neu bewertet werden. Die CI schlägt auch dann fehl, wenn eine Ausnahme nicht mehr gebraucht wird; sie wird dann gelöscht. Die Regeln stehen in `scripts/lib/audit-policy.mjs`.

**Format und Gültigkeit einer Ausnahme:** Jede Ausnahme hat die Felder `id` (GHSA-ID), `package`, `range`, `added`, `expires` und `reason` (Begründung). `added` ist das Datum, an dem die Ausnahme geprüft und eingetragen wurde, `expires` der letzte Tag, an dem sie gilt. Beide müssen echte Kalenderdaten im Format JJJJ-MM-TT sein. `scripts/lib/audit-policy.mjs` prüft bei jedem Lauf technisch:

- `added` liegt nicht in der Zukunft.
- `expires` liegt nicht vor `added` und höchstens 30 Kalendertage danach (`expires` − `added` ≤ 30).
- Am Tag `expires` gilt die Ausnahme noch; ab dem Folgetag schlägt die CI fehl.
- Gerechnet wird in ganzen Kalendertagen nach UTC; „heute“ ist das aktuelle UTC-Datum. Das Ergebnis hängt deshalb nicht von der lokalen Zeitzone oder der Sommerzeit ab. Lokal kann das UTC-Datum in den Stunden um Mitternacht vom lokalen Datum abweichen.

`added` ist ein **deklariertes** Startdatum: Es wird im Pull Request zusammen mit der Ausnahme geprüft, ist aber technisch nicht gegen spätere Änderung geschützt. Die 30-Tage-Grenze begrenzt die Gültigkeit **eines Eintrags**, nicht die Gesamtdauer, über die ein Advisory durch wiederholte Verlängerung ausgenommen bleibt. Jede Verlängerung ist eine neue Bewertung mit neuen Daten in einem eigenen Pull Request.

### Aktuelle Ausnahmen

Derzeit keine.

### Frühere Ausnahmen

**GHSA-fc5q-39xc-vjpf – picomatch `<=4.0.7`, ReDoS durch wiederholte Extglobs (vom 17.11. bis 18.11.2026).** GitHub hat das Advisory am 18.11.2026 zurückgezogen (`withdrawn_at` 2026-11-18T15:38:56Z, Titel „Withdrawn Advisory“, mit Verweis auf eine Stellungnahme des picomatch-Maintainers in micromatch/picomatch#235: Globs sind reguläre Ausdrücke, Muster aus nicht vertrauenswürdigen Quellen sollen nicht verwendet werden). `npm audit` meldet es nicht mehr, Dependabot führt den Hinweis als behoben. Die Ausnahme wurde deshalb gelöscht. Installiert ist unverändert picomatch 4.0.7. Die frühere Bewertung gilt weiter: Durchblick verwendet nur fest im Repository stehende Glob-Muster beim Build.

## Unterstützte Versionen

Unterstützt wird nur der aktuelle Stand von `main`. Es gibt noch keine stabile Veröffentlichung (siehe [`README.md`](README.md#projektstatus)).

---

## Reporting a vulnerability (English)

Please do **not** open a public issue. Report privately via **Security → Report a vulnerability** in this repository, or, if that is not possible, by e-mail to **etse@posteo.de**. Include the affected page or file, steps to reproduce, browser and expected impact, and no real personal data. This is a volunteer project without a bug bounty; we aim to respond promptly but cannot promise fixed timelines. Only the current `main` branch is supported.
