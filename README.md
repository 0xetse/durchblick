# Durchblick

**Was erfahren deine Apps über dich?** Durchblick ist eine datenschutzfreundliche Web-App (PWA): Du tippst an, welche Apps du nutzt, und siehst in wenigen Minuten, welche Bereiche deines Lebens sie berühren können, einen belegten Fakt, den die wenigsten kennen, und eine Einstellung, die du sofort ändern kannst – ohne Konto, ohne Cookies, ohne Tracking.

*English summary [below](#english-summary).*

> **Vorabversion.** Dieser Quellcode ist öffentlich, damit man ihn prüfen, nachbauen und verbessern kann. Das ist **keine stabile Produktfreigabe**: Es gibt noch keinen offiziellen Betrieb, kein Impressum und keine öffentliche Instanz, für die jemand Verantwortung übernimmt. Änderungen: [`CHANGELOG.md`](CHANGELOG.md).

## Projektstatus

**Vorabversion (0.x), nicht für den Alltag freigegeben.** Konkret heißt das:

- **Inhalte:** Jede Aussage hat eine Quelle, aber nicht jede Anleitung ist in einem echten Konto nachvollzogen. Solche Schritte sind auf der Seite als „noch nicht nachgeprüft“ gekennzeichnet. Menüs der Anbieter ändern sich oft; Anleitungen können veralten. Noch hat kein Mensch alle Texte redaktionell gegengelesen ([`docs/content/gegenlesen-2026-10.md`](docs/content/gegenlesen-2026-10.md)).
- **Kein Rechtsrat:** Die Einordnungen sind redaktionell und nicht juristisch geprüft.
- **Getestet** wird automatisiert in Chromium, Firefox und WebKit (inkl. Barrierefreiheitsprüfung mit axe). Ein Durchgang mit echten Screenreadern und auf echten iPhones/Android-Geräten steht noch aus. Automatisierte Tests zeigen das Verhalten in den getesteten Fällen – sie sind kein Beweis, dass es keine Fehler gibt.
- **Betrieb:** Betreiber, Impressum und Hosting für einen öffentlichen Start sind offen ([`docs/DECISIONS_NEEDED.md`](docs/DECISIONS_NEEDED.md), D-N4/D-N5). Wer den Code selbst betreibt, ist für den eigenen Betrieb verantwortlich.
- **Bekannte Einschränkungen und offene Punkte:** [`docs/DECISIONS_NEEDED.md`](docs/DECISIONS_NEEDED.md) und die Reviews in [`docs/reviews/`](docs/reviews/), zuletzt [`docs/reviews/audit-2026-11.md`](docs/reviews/audit-2026-11.md).

## Wie Durchblick entsteht

Durchblick wird von **Etse** ([@0xetse](https://github.com/0xetse)) betreut – Schwerpunkte: Privacy, Security, Open Source, digitale Selbstverteidigung.

**Das Projekt wird mit KI-Unterstützung entwickelt.** Ein großer Teil von Code, Tests, Recherche-Notizen und Texten wurde mit einem KI-Assistenten (Claude von Anthropic) erstellt und überarbeitet. Entscheidungen, Prüfaufträge und Freigaben liegen bei einem Menschen. Was das für die Qualität heißt:

- KI-Recherche kann Fehler enthalten. Deshalb hat jede Aussage über einen Dienst eine Quelle, die man selbst prüfen kann, und ungeprüfte Anleitungen sind als solche gekennzeichnet.
- Sicherheits- und Datenschutzeigenschaften sind durch automatisierte Tests und dokumentierte Reviews belegt, die ebenfalls KI-gestützt entstanden sind. Eine unabhängige externe Prüfung gab es bisher nicht.
- Die Entscheidungswege stehen in [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) und [`docs/reviews/`](docs/reviews/). Die Git-Historie dieses Repositorys beginnt mit der Veröffentlichung des Quellcodes.

Korrekturen von Menschen mit Fachwissen sind ausdrücklich willkommen ([`CONTRIBUTING.md`](CONTRIBUTING.md)).

## Warum

Fast alle wissen, dass Dienste Daten sammeln – kaum jemand weiß, welche, wie, was daraus folgt und was man konkret tun kann. Datenschutzerklärungen sind unlesbar, viele Ratgeber alarmistisch oder veraltet. Durchblick übersetzt das in vier Fragen, die jede Ansicht strukturieren:

1. **Was erfahren sie?** 2. **Wie erfahren sie es?** 3. **Was bedeutet das?** 4. **Was kannst du tun?**

## Was die App kann (0.5.1, 14 Apps, Deutsch und Englisch)

| Bereich | Route | Kurz |
|---|---|---|
| **Einstieg (Wizard)** | `/` | Vier Schritte, einer pro Bildschirm: Apps antippen → die drei wichtigsten Lebensbereiche in Worten → ein belegter Fakt zu einer eigenen App („Woher wissen wir das?") → eine Änderung mit offiziellem Link (was sich ändert, was bleibt). Zielgruppe: `docs/product/icp.md` |
| Einstellungen ändern | `/einstellungen/` | alle Einstellungen je App, zuerst die ohne Komfortverlust, je Direktlink zum Anbieter und Anleitung; eigene Apps (aus diesem Tab) zuerst und aufgeklappt |
| Warum wichtig? | `/warum/` | echte, belegte Fälle (verkaufte Standortdaten, Datenlecks, Gesundheitsdaten) mit „Was das für dich heißt" und passender Einstellung |
| Meine Apps im Detail | `/check/` | Datenmuster als Matrix plus Auffälligkeiten über Apps hinweg und Tabelle aller Datenarten |
| Mein Plan | `/plan/` | **Start hier (3)** · Danach · Optional – mit Abstrichen; Priorisierung erklärt; Fortschritt nur lokal, nur mit Zustimmung |
| Alle Apps | `/dienste/` | ruhige Liste aller Apps nach Bekanntheit (Kategorie, Konzern, berührte Lebensbereiche) und welche Apps zusammengehören |
| Apps | `/dienste/<id>/` | Recherche-Brief mit nummerierter Sprungleiste: Datenpunkte, Datenreise, Schlüsse, Zwecke, Weitergabe, Einordnung in 10 Punkten, Anleitungen, Quellen |
| Experiment | `/spuren/` | „Was verraten harmlose Spuren?" – wie aus Alltagsverhalten Schlüsse werden, mit Gewissheitsstufe, Beleg und passender Handlung |
| Anleitungen | `/anleitungen/<id>/` | einzeln verlinkbar, mit Prüfdatum |
| Alternativen | `/alternativen/` | neutral, mit Komfort-Abwägungen; zuerst „Was du ohne Wechsel erreichst" |
| Vertrauen | Kopfzeile auf jeder Seite, `/transparenz/` | „Was weiß Durchblick über dich?" – live: Cookies, fremde Verbindungen, Gespeichertes, „Alles löschen" |
| Methodik | `/methodik/` | Quellen, Sicherheit der Aussagen, Einordnung statt Punktzahl, Aktualität |
| Englisch | `/en/…` | alle Seiten auf Englisch mit englischen Pfaden (`/en/settings/`, `/en/apps/<id>/` …); Sprachumschalter in der Kopfzeile behält Seite und App-Auswahl |

## Architektur

Statische [Astro](https://astro.build)-Site mit [Preact](https://preactjs.com)-Inseln, **kein Backend**. Wissen liegt als YAML in `content/` und wird im Build gegen Zod-Schemas validiert (inkl. Querverweise und Quellenpflicht). Details: [`docs/architecture/architecture.md`](docs/architecture/architecture.md), ADRs in `docs/architecture/adr/`.

Zweisprachigkeit (ADR-0004): Deutsch liegt im Wurzelpfad, Englisch unter `/en/`. Englische Inhalte sind Text-Overlays in `content/i18n/en/` – IDs, Bewertungen, Quellen und Daten kommen immer aus dem deutschen Original, ein Test stellt sicher, dass nichts fehlt oder abweicht.

```
content/        Dienste, Anleitungen, Quellen, Alternativen, Beispiele, Simulator (YAML)
content/i18n/en/  englische Text-Overlays
src/domain/     Schemas, Loader, Logik (Fußabdruck, Plan, Simulator, Speicher) – framework-unabhängig
src/i18n/       Sprachen, Routen, Wörterbücher (de/en)
src/islands/    interaktive Preact-Inseln (u. a. Einstieg-Wizard)
src/views/      Seiteninhalte, einmal für beide Sprachen
src/pages/      Routen (dünn; `pages/en/` für Englisch)
tests/          unit · content · e2e (inkl. Barrierefreiheit und Netzwerk-Prüfung, siehe unten)
docs/           Recherche, Produkt, Architektur, Privacy, Security, Reviews
```

## Entwicklung

Voraussetzung: Node 22 ab 22.23.4, Node 24 ab 24.16 oder Node ≥ 26.3 (siehe `engines` in `package.json`).

```bash
npm ci                 # exakt die Versionen aus package-lock.json
npm run dev            # Entwicklungsmodus, http://localhost:4321
npm run build          # statischer Output in dist/
npm run build:test     # wie build, zusätzlich noindex (für nicht öffentliche Testumgebungen)
npm run preview        # gebauten Stand ansehen (so wie ausgeliefert), http://localhost:4321
npm run preview -- --host   # zusätzlich im WLAN erreichbar (Handy-Test), Adresse steht in der Konsole
```

## Nutzertests

Durchblick wird mit kleinen moderierten Nutzertests weiterentwickelt. Testplan, Moderationsblatt, Beobachtungsbogen, Klick-Checklisten und Triage-Regeln: [`docs/user-test/`](docs/user-test/README.md). Ausgefüllte Bögen und Testlinks werden nicht veröffentlicht.

## Tests & Qualität

```bash
npm run lint           # ESLint (TS, Astro, jsx-a11y, Verbot von Netzwerk-APIs im App-Code)
npm run check          # astro check (Typen)
npm test               # Vitest: Domain-Logik, Komponenten, Content-Validierung, Link-Allowlist
npm run build && npm run test:e2e   # Playwright braucht den gebauten Stand; startet selbst scripts/serve-dist.mjs auf Port 4321
npm run verify         # alles nacheinander, inkl. Build
npm run audit:deps     # Audit der Produktionsabhängigkeiten
```

**Was die Netzwerk-Prüfung zeigt** (`tests/e2e/trust.spec.ts`): Auf 14 festgelegten Seiten (Deutsch und Englisch) gehen in den getesteten Browsern nur Anfragen an die eigene Herkunft, es entstehen keine Cookies, ohne Zustimmung wird nichts gespeichert, und die Konsole meldet keine CSP-Verstöße. Ein weiterer Test zeigt, dass die ausgelieferte CSP Anfragen an fremde Hosts blockiert und die Seite sich nicht einbetten lässt. Das belegt das Verhalten dieser Seiten in diesen Browsern – nicht für jede Umgebung, Erweiterung oder künftige Änderung.

Die CI (`.github/workflows/ci.yml`) führt Lint, Typen, Tests, Build und Browser-Tests bei Pushes auf `main` und bei jedem Pull Request aus. Workflows aus Forks laufen erst nach Freigabe durch die Maintainer.

Port 4321 muss für die E2E-Tests frei sein (eine laufende Vorschau mit `npx astro preview stop` beenden). `astro preview` läuft außerhalb eines Terminals im Hintergrund weiter und weicht bei belegtem Port still auf 4322 aus – deshalb nutzen die Tests einen eigenen Server.

Browser für die E2E-Tests: Auf einem normalen Rechner einmalig `npx playwright install chromium`. Ein vorhandenes Chromium lässt sich mit `PW_CHROMIUM_PATH=/pfad/zu/chrome` verwenden.

## Datenschutz-Philosophie

Wir erheben nichts ohne klaren Produktgrund. Keine Konten, Cookies, Analyse, Drittanbieter-Ressourcen. Persönliche Auswahl wird im Browser berechnet; dauerhaft gespeichert wird nur nach ausdrücklicher Zustimmung und nur lokal. Präzise statt plakativ: *„Deine Auswahl, deine Antworten und dein Fortschritt verlassen dein Gerät nicht."* – denn den Seitenabruf selbst sieht das Hosting wie bei jeder Website.

**Grenzen, die wir nicht wegversprechen:** Das Hosting verarbeitet beim Abruf technisch die IP-Adresse. Was der Browser selbst aufbewahrt (Verlauf, Wiederherstellung geschlossener Tabs, Synchronisation), liegt außerhalb der Kontrolle der Seite. Ein bewusst geteilter Link mit Auswahl landet beim Empfänger wie jeder Link im Verlauf. Die Tests belegen das Verhalten in den getesteten Browsern; sie sind keine Garantie für jede Umgebung. Details: [`docs/privacy/privacy-architecture.md`](docs/privacy/privacy-architecture.md), Bedrohungsmodell: [`docs/security/threat-model.md`](docs/security/threat-model.md).

## Inhalte & Quellen

- Jede Aussage über einen Dienst hat Quellen (Tier 1: Anbieter, Behörden, Gesetze; Tier 2: Forschung, Journalismus; Tier 3: nur ergänzend) mit Abrufdatum.
- **Herkunft** (angegeben / beobachtet / berechnet) und **Gewissheit** (laut Anbieter / technisch zwangsläufig / Forschung; bei Ableitungen: beschrieben / nur möglich) sind getrennte Pflichtfelder.
- Anleitungsschritte nur, wenn eine offizielle Hilfeseite sie bestätigt; sonst „noch nicht geprüft" + offizieller Link.
- Kein numerischer Score: [Datenprofil-Methodik](docs/content/assessment-methodology.md). Redaktionsregeln: [`docs/content/content-guidelines.md`](docs/content/content-guidelines.md). Recherche-Notizen mit Zitatstellen: `docs/research/`.

## Dokumentation

| Thema | Datei |
|---|---|
| Wettbewerb & Chancen | `docs/research/competitive-analysis.md`, `docs/research/opportunity-map.md` |
| Produkt | `docs/product/product-vision.md`, `icp.md` (Zielgruppe), `personas.md`, `user-journeys.md`, `information-architecture.md` |
| Architektur | `docs/architecture/architecture.md`, ADRs in `docs/architecture/adr/` |
| Datenschutz & Sicherheit | `docs/privacy/privacy-architecture.md`, `docs/security/threat-model.md`, `docs/security/security.md` |
| Änderungen | `CHANGELOG.md` |
| Entscheidungen | `docs/DECISION_LOG.md`, offene: `docs/DECISIONS_NEEDED.md` |
| Reviews | `docs/reviews/` (First-Use, Trust, Red Team, Audit 2026-11) |
| V2-Richtung & Plan-Methodik | `docs/product/v2-direction.md`, `docs/product/action-plan-methodology.md` |
| Nutzertests | `docs/user-test/` |
| Namensfindung | `docs/product/naming-exploration.md` |

## Roadmap (Auszug)

1. **Jetzt: Nutzertests fortführen** – Wizard auf echtem iPhone/Safari, englische Fassung mit englischsprachiger Testperson. Neue Features sind erlaubt, wenn Tests sie begründen (D-050).
2. Vor Launch: Betreiber/Impressum, Hosting für den Start (EU, minimale Logs; D-N5), Rechtsprüfung der Einordnungen, Name/Marke, redaktionelle Durchsicht, Prüfung der 17 noch nicht verifizierten Anleitungen.
3. Danach: weitere Dienste (Microsoft, Apple), Änderungsprotokoll je Dienst, Privatsphäre-Beleg (lokaler Export).
4. Später: lokaler Import von Google Takeout / Meta-Export im Web Worker (Machbarkeit dokumentiert).

## Mitmachen

Korrekturen mit Quelle, nachgeprüfte Anleitungen, Fehlerberichte und Verbesserungen der Barrierefreiheit sind willkommen. Bitte zuerst [`CONTRIBUTING.md`](CONTRIBUTING.md) lesen – dort stehen die Grundsätze (kein Tracking, keine Drittanbieter, Quellenpflicht) und die Prüfschritte. Es gilt der [Verhaltenskodex](CODE_OF_CONDUCT.md).

## Sicherheit

Sicherheitsprobleme bitte vertraulich melden, nicht als Issue: [`SECURITY.md`](SECURITY.md).

## Lizenz

- **Quellcode:** [MIT](LICENSE).
- **Eigene redaktionelle Inhalte und Dokumentation** (u. a. `content/`, `docs/`): [CC BY 4.0](LICENSES/CC-BY-4.0.txt).
- **Ausgenommen** sind Material Dritter – wörtliche Zitate aus Datenschutzerklärungen und Hilfeseiten, Namen und Marken der beschriebenen Dienste, die Schriften IBM Plex (SIL Open Font License 1.1) und die Abhängigkeiten unter ihren eigenen Lizenzen.

Welche Datei unter welcher Lizenz steht und wie man richtig namensnennt: [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md). Durchblick ist mit keinem der beschriebenen Anbieter verbunden.

## English summary

Durchblick (German for “seeing through it”) is a privacy-friendly web app that explains what popular apps can learn about you and which settings you can change right now – without accounts, cookies, tracking or third-party requests. German and English.

- **Status:** pre-release. The source code is public for review and contributions; this is **not** a stable product release, and there is no official hosted instance yet.
- **AI-assisted:** much of the code, tests, research notes and text were produced with an AI assistant (Claude by Anthropic), directed and reviewed by the maintainer, Etse ([@0xetse](https://github.com/0xetse)). Every claim about a service links to a source; unverified guide steps are marked. No independent external audit has taken place.
- **Develop:** Node 22.23.4+, 24.16+ or ≥ 26.3, `npm ci`, `npm run dev`; checks: `npm run verify`.
- **Contribute:** [`CONTRIBUTING.md`](CONTRIBUTING.md) · **Security:** [`SECURITY.md`](SECURITY.md) · **Code of Conduct:** [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- **License:** code MIT, own editorial content and docs CC BY 4.0, third-party material excluded – see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).
