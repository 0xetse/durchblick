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

Durchblick ist eine statische Website ohne Backend, ohne Konten und ohne Cookies. Eine App-Auswahl wird im Browser verarbeitet und nur für den aktuellen Tab gespeichert; dauerhaft nur nach ausdrücklicher Zustimmung und nur lokal. Wie das umgesetzt und getestet ist, steht in [`docs/privacy/privacy-architecture.md`](docs/privacy/privacy-architecture.md) und im Bedrohungsmodell [`docs/security/threat-model.md`](docs/security/threat-model.md). Diese Dokumente beschreiben den Stand und seine Grenzen – sie sind keine Garantie.

## Abhängigkeiten und bekannte Schwachstellen

Die CI prüft mit `npm run audit:deps` alle Produktionsabhängigkeiten (`npm audit --omit=dev`) und schlägt bei jeder Meldung ab Schweregrad „moderate“ fehl. Ausnahmen sind nur für einzelne, geprüfte Advisories möglich und stehen in [`scripts/audit-exceptions.json`](scripts/audit-exceptions.json). Jede Ausnahme gilt nur für genau eine GHSA-ID, ein Paket und den betroffenen Versionsbereich und läuft nach höchstens 30 Tagen ab. Danach schlägt die CI wieder fehl, und die Ausnahme muss neu bewertet werden. Die CI schlägt auch dann fehl, wenn eine Ausnahme nicht mehr gebraucht wird; sie wird dann gelöscht. Die Regeln stehen in `scripts/lib/audit-policy.mjs`.

### Aktuelle Ausnahmen

**GHSA-fc5q-39xc-vjpf – picomatch `<=4.0.7`, ReDoS durch wiederholte Extglobs (hoch, CVSS 7.5), gültig bis 2026-12-17.**

- *Stand:* Es gibt keine korrigierte Version (neueste Version 4.0.7, das Advisory nennt keine gepatchte Version; der Fix in micromatch/picomatch#194 ist noch nicht übernommen). Auch die neuesten Versionen von Astro, Vite und tinyglobby setzen picomatch 4.0.7 voraus. Installiert sind picomatch 4.0.7 (Astro, Vite, tinyglobby, @rollup/pluginutils) und 2.3.2 (anymatch über unstorage, @prefresh/vite).
- *Warum nicht ausnutzbar:* Der Angriff setzt voraus, dass Angreifende das Glob-Muster selbst bestimmen, z. B. `+(*a)`. Durchblick wird statisch gebaut, ohne Server und ohne Adapter. picomatch läuft nur beim Build und in Entwicklungswerkzeugen, mit Mustern, die fest im Repository stehen (`import.meta.glob` in `src/domain/content.ts`), und ist nicht im ausgelieferten Browser-Code enthalten.
- *Nicht gewählt:* `npm audit fix --force` (würde Astro auf 5.3.0 zurückstufen und das Problem nicht beheben), ein npm-Override (es gibt keine sichere Zielversion) und das Abschalten der Prüfung.
- *Neu bewerten:* sobald eine korrigierte picomatch-Version erscheint, wenn sich das Advisory ändert, spätestens am Ablaufdatum, und in jedem Fall, bevor Durchblick serverseitig gerendert wird (SSR/Adapter).

## Unterstützte Versionen

Unterstützt wird nur der aktuelle Stand von `main`. Es gibt noch keine stabile Veröffentlichung (siehe [`README.md`](README.md#projektstatus)).

---

## Reporting a vulnerability (English)

Please do **not** open a public issue. Report privately via **Security → Report a vulnerability** in this repository, or, if that is not possible, by e-mail to **etse@posteo.de**. Include the affected page or file, steps to reproduce, browser and expected impact, and no real personal data. This is a volunteer project without a bug bounty; we aim to respond promptly but cannot promise fixed timelines. Only the current `main` branch is supported.
