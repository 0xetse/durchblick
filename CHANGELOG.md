# Changelog

Alle nennenswerten Änderungen an Durchblick. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [SemVer](https://semver.org/lang/de/) (vor 1.0: jede Minor-Version kann Bestehendes ändern). Die Version steht im Fuß jeder Seite. Begründungen stehen in [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) (D-xxx).

## Unveröffentlicht – Open Source

### Neu
- **Lizenzen:** Code unter MIT (`LICENSE`), eigene Inhalte und Dokumentation unter CC BY 4.0 (`LICENSES/CC-BY-4.0.txt`); Abgrenzung und Ausnahmen (Zitate Dritter, Marken, Schriften, Abhängigkeiten) in `LICENSE-CONTENT.md`.
- **Lizenzhinweise in der Website:** `public/licenses/` mit den OFL-Texten der IBM-Plex-Schriften und den Lizenzen der ausgelieferten Bibliotheken (Preact, Astro, Zod).
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, Issue- und PR-Vorlagen; offener Hinweis zur KI-Unterstützung in der README.
- `.github/dependabot.yml` (Actions und npm) und `.github/CODEOWNERS` für Workflows und sicherheitsrelevante Dateien.

### Geändert
- **TypeScript-Konfiguration:** `tsconfig.json` verzichtet auf das veraltete `baseUrl`; der Pfad-Alias `~/*` zeigt jetzt relativ auf `./src/*`. TypeScript 6 meldet `baseUrl` als veraltet, TypeScript 7 unterstützt es nicht mehr. Die Imports und die Auflösung durch Vite (`astro.config.mjs`) bleiben unverändert.
- **YouTube:** Aussagen zu Werbefaktoren (Alter/Geschlecht, Gerät, Interaktionen mit Anzeigen, Websites und Apps außerhalb von YouTube) stützen sich jetzt auf die Hilfe zu Mein Anzeigen-Center. Die YouTube-Hilfeseite nennt die frühere Faktorenliste nicht mehr. Präzisiert: Werbe-ID statt „anonyme Kennungen“, Partner-Aktivitäten nur, wenn sie im Google-Konto gespeichert werden, installierte Apps nur bei Android.
- **Quellen:** Wörtliche Zitate aus Presseartikeln (netzpolitik.org, Stiftung Warentest, Engadget, TechCrunch) und aus Abstracts wissenschaftlicher Arbeiten sind durch eigene, als „Sinngemäß“ gekennzeichnete Zusammenfassungen ersetzt und gegen die Originale geprüft. Die Methodik-Seite erklärt, dass Wortlaute in Anführungszeichen aus anderssprachigen Quellen eigene Übersetzungen sind.
- **Abhängigkeitsprüfung:** Die Ausnahme für picomatch GHSA-fc5q-39xc-vjpf ist entfernt; `scripts/audit-exceptions.json` ist leer. GitHub hat das Advisory am 18.11.2026 zurückgezogen, `npm audit` meldet es nicht mehr. Die Prüfung hatte die nicht mehr benötigte Ausnahme wie vorgesehen als Fehler gemeldet. Der Mechanismus (Ausnahmen mit Ablaufdatum, Fehlschlag bei veralteten oder fehlerhaften Ausnahmen) bleibt unverändert.
- **Node-Version:** `engines` in `package.json` verlangt jetzt `^22.23.4 || ^24.15.0 || >=26.0.0` statt `>=22.12.0`. Astro 7.4.12 und @astrojs/preact 6.1.6 setzen Node ≥ 22.23.4 voraus. jsdom, ESLint 10 und Vitest unterstützen Node 23 und 25 nicht, Node 24 erst ab 24.15. README und CONTRIBUTING nennen die neue Anforderung. Die CI nutzt bereits Node 22.23.4.
- **Node-Version (Nachtrag):** `engines` verlangt jetzt `^22.23.4 || ^24.16.0 || >=26.3.0`. eslint-plugin-astro 3 und astro-eslint-parser 3 setzen Node `^22.22.3 || ^24.16.0 || >=26.3.0` voraus; Node 24.15 und 26.0 bis 26.2 werden damit nicht mehr unterstützt. README und CONTRIBUTING nennen die neue Anforderung. Die CI (Node 22.23.4) ist nicht betroffen.
- **Abhängigkeitsprüfung:** `npm run audit:deps` erlaubt einzelne geprüfte Advisories mit Ablaufdatum (`scripts/audit-exceptions.json`, Begründung in `SECURITY.md`). Alle anderen Meldungen ab „moderate“ lassen die CI weiterhin fehlschlagen. Erste Ausnahme: picomatch GHSA-fc5q-39xc-vjpf (keine korrigierte Version verfügbar, in der statischen Website nicht ausnutzbar), gültig bis 2026-12-17.
- **ESLint 10:** Upgrade von ESLint 9.39.5 (wird nicht mehr unterstützt) auf 10.15.0. Betrifft nur die Entwicklungswerkzeuge; der Produktions-Build bleibt byte-identisch. `eslint-plugin-jsx-a11y` 6.10.2 gibt ESLint 10 noch nicht in seinen Peer-Dependencies an (Upstream-PRs jsx-eslint/eslint-plugin-jsx-a11y#1079 und #1081 sind offen). Deshalb setzt ein gezielter Override in `package.json` (`overrides` → `eslint-plugin-jsx-a11y` → `eslint: "$eslint"`) nur für dieses Plugin die ESLint-Version des Projekts ein, ohne `--legacy-peer-deps`. Das Plugin nutzt keine der in ESLint 10 entfernten APIs; alle geprüften jsx-a11y-Regeln melden unverändert. **Der Override wird entfernt, sobald `eslint-plugin-jsx-a11y` ESLint 10 offiziell unterstützt.**
- **Dependabot:** schlägt keine Major-Updates von `typescript` mehr vor; Minor- und Patch-Updates kommen weiterhin. TypeScript 7 stellt die Compiler-API nicht mehr bereit, auf der typescript-eslint (unterstützt `>=4.8.4 <6.1.0`) und `@astrojs/check` (`^5 || ^6`) aufbauen; mit 7.0.2 brechen `npm run lint` und `npm run check` ab. Das Projekt bleibt deshalb bei TypeScript 6 (Dependabot-PR #4 geschlossen). Die Ausnahme in `.github/dependabot.yml` wird entfernt, sobald beide Werkzeuge TypeScript 7 offiziell unterstützen.
- **CI** läuft für Pushes auf `main` und für jeden Pull Request, auch aus Forks (ohne Secrets, mit Freigabe durch die Maintainer); ältere Läufe eines PRs werden abgebrochen.
- `security.txt` verweist auf die vertrauliche Meldung über GitHub statt auf einen Platzhalter.
- Dokumentation ohne Verweise auf die private Arbeitsumgebung und das Test-Hosting.

## Unveröffentlicht – Gestaltung „Klarer Begleiter“

Drei Richtungen als Prototypen verglichen, Entscheidung und Begründung: [`docs/design/visual-direction-2026-11.md`](docs/design/visual-direction-2026-11.md).

### Geändert
- **Einstieg:** vier benannte Schritte (Apps · Was sie erfahren · Ein Fakt · Ändern); auf dem Handy schrumpft die Einleitung ab Schritt 2, damit jeder Schritt oben beginnt; Hauptknopf über die volle Breite; am Desktop steht das Werkzeug in einem eigenen Panel.
- **Schritt 4:** „Das ändert sich“ und „Das bleibt“ als abgesetzte Felder; „Wo das geht: Browser · Android-App · iPhone-App“; nicht nachgeprüfte Schritte sagen das (auch, dass es in der EU anders aussehen kann); ohne Direktlink stehen die Schritte gleich offen da.
- **Kontrast:** Ränder von Kacheln, Kästchen und Zweit-Knöpfen mindestens 3 : 1 (Token `--control`).
- **Wörter:** „Kostet Komfort“ statt „Abstrich“, „noch nicht nachgeprüft“ statt „ungeprüft“, „mit der offiziellen Hilfe abgeglichen – nicht in einem echten Konto ausprobiert“, im Vertrauens-Panel „Verbindungen: nur diese Website“ statt „Netzwerkziele“; Schritt 2: „etwas über 8 von 9 Bereichen“, „die Einteilung in Bereiche ist von uns“.
- **WhatsApp-Kontaktzugriff:** Android-Menüpunkt heißt laut Hilfe jetzt „Kontakte und Konten“ (am 2026-11-11 abgeglichen).

## Unveröffentlicht – Stabilisierung (Audit 2026-11)

Befunde und Prüfwege: [`docs/reviews/audit-2026-11.md`](docs/reviews/audit-2026-11.md).

### Datenschutz und Sicherheit
- **Offline-Speicher ohne Auswahl:** Der Service Worker legte Seiten unter der vollen Adresse samt `#d=…` ab, die App-Auswahl blieb so ohne Zustimmung gespeichert. Jetzt ohne Fragment; Version v4 löscht alle älteren Caches.
- **CSP sperrt fremde Ziele:** `default-src`, `connect-src`, `img-src`, `font-src`, `worker-src` auf `'self'` – vorher regelte die CSP nur Skripte und Styles.
- **„Alles löschen“ löscht alles, was Durchblick hat:** auch die Auswahl in der Adresse der offenen Seite; der Knopf erscheint auch, wenn nur die Adresse eine Auswahl hat. Das Vertrauens-Panel sagt, dass der Browser die Adresse samt Auswahl in seinem Verlauf speichert (gemessen; Entscheidungsvorlage D-N24).
- Abhängigkeiten ohne bekannte Lücke (zod 4.6.7, undici); `npm run audit:deps` läuft in der CI. JSON-LD maskiert, Links in Inhalten nur als vollständige `https://`-Adresse ohne Zugangsdaten.

### Behoben
- **Zwei offene Tabs:** Durchblick hielt beide Tabs dauerhaft beschäftigt (Tausende `storage`-Ereignisse pro Sekunde, Firefox reagierte nicht mehr). Die Speicherprüfung schreibt jetzt nur noch einmal pro Seite.
- **Wizard:** Browser-Zurück und -Vor gehen Schritt für Schritt statt die Seite zu verlassen; Neuladen bleibt im selben Schritt. Die Auswahl wird dabei nie zurückgedreht.
- **Kleine Handys (360–375 px):** Seite war 21 px zu breit, „Menü“ abgeschnitten. Das Vertrauens-Abzeichen zeigt dort nur ein Schild-Symbol.
- Neuer Wizard-Schritt verschwindet nicht mehr unter der festen Kopfzeile.
- Menü und „Keine Tracker“ schließen mit Escape (Fokus zurück auf den Knopf) und beim Tippen daneben; nur eins ist offen.
- **Plan:** sagt nach „Alles löschen“ nicht mehr „gespeichert“; erklärt, wenn der Browser Speichern blockiert; übernimmt eine geänderte Adresse.
- „Zum Inhalt springen“ und Anker werfen die Auswahl nicht mehr aus den Menü-Links.
- Kaputte gespeicherte Werte brechen keine Seite mehr.
- Offline funktionieren die Kernseiten jetzt mit Styles und Skripten, auch `/en/`; ungesehene Seiten fallen auf die Startseite in ihrer Sprache zurück.
- Ohne JavaScript zeigt die Startseite keine wirkungslosen Knöpfe mehr.

### Datenschutz: Auswahl nur im Tab (D-N24 / D-057, 2026-11-13)
- **Die App-Auswahl steht nicht mehr in der Adresse** und gelangt dadurch nicht mehr in den Browserverlauf, in dessen Vorschläge oder in den Verlaufs-Sync. Vorher legten Chromium und Firefox jeden Zwischenstand (`#d=telegram`, `#d=telegram,instagram` …) einzeln ab (gemessen).
- Sie bleibt im geöffneten Tab (`sessionStorage`): beim Seitenwechsel, Neuladen und Zurück. Jeder Tab hat seine eigene Auswahl. **Nicht spurlos:** Browser halten den Tab-Speicher für „Tabs wiederherstellen“ auf der Festplatte.
- **Teilen nur auf Wunsch:** „Link mit meiner Auswahl teilen“ im Plan, erst nach dem Aufklappen, mit dem Hinweis, was der Link enthält und wo er landen kann. Geteilte und ältere Links werden übernommen und sofort aus der Adresse entfernt.
- „In meinen Plan übernehmen“ ergänzt die Auswahl dieses Tabs. „Alles löschen“, Vertrauens-Panel, Transparenzseite und Datenschutzerklärung berücksichtigen den Tab-Speicher.
- Nach unabhängigem Review: Zurück nach „Alles löschen“ bringt keine Auswahl zurück (Back-/Forward-Cache); geteilte Links ersetzen keine gespeicherte Auswahl; unbekannte Kennungen werden verworfen; Strg-/Mittelklick auf „In meinen Plan übernehmen“ funktioniert; `/transparenz/` trennt Tab und Gerät.
- Datenreise auf Dienstseiten lädt ihren Code sofort (nach einem Deploy fehlte er offenen Tabs, reproduziert).
- Freigabeprüfung: Ein geteilter Link erreicht die gespeicherte Auswahl auch bei späteren Seitenaufrufen nicht; der Offline-Speicher enthält keine besuchten Seiten mehr (Service Worker v5); astro 7.4.7 (Sicherheitshinweise, hier nicht ausnutzbar); Fokus nach „merken?“ und nach „Alles löschen“; Transparenzseite und Vertrauens-Panel genauer; Hinweis bei blockiertem Speicher.

### Release-Gate (Phase 4, 2026-11-12/13)
- **Gespeicherte Auswahl nie in Adressen:** Eine nach Zustimmung gespeicherte Auswahl wird nicht mehr in die Adresse (und damit in den Browserverlauf) geschrieben; `/einstellungen/` liest sie selbst und reagiert auf „Alles löschen“.
- **Sprungleiste der Dienstseiten** bleibt beim Scrollen sichtbar (klebte vorher nur im Seitenkopf); Sprungziele werden nicht mehr verdeckt.
- **Kopfzeile:** Tab-Reihenfolge entspricht der Anzeige, auch auf dem Handy.
- **CI:** Actions per Commit-SHA gepinnt (v4.4.0), Deploy nur aus Push-Läufen dieses Repositorys.
- **Tests:** Browser-Tests laufen mit den echten `_headers` (CSP-Wirkung nachgewiesen: fremder `fetch`, Bild, Beacon blockiert, kein Einbetten); Tastatur-Durchlauf, 18 Nutzungsszenarien, zwei offene Tabs; Firefox gegen eigenen Testserver ohne COOP (Playwright-Firefox hängt sonst bei ≈ 16 % der Navigationen).
- Entfernt: ungenutztes `buildPlan`/`progress`.
- Entscheidungsvorlage D-N24 mit Messungen: `docs/privacy/d-n24-entscheidungsvorlage.md`.

### Tests
- Neue Regressionstests: `tests/e2e/state.spec.ts` (Verlauf, Neuladen, Anker, Löschen, kaputter Speicher, Pop-ups, Service Worker offline, 360 px), `tests/unit/security.test.ts` (CSP, URL-Regeln), Adress-Logik in `tests/unit/storage.test.ts`.
- Firefox und WebKit (Desktop Safari, iPhone-Emulation): `npm run test:e2e:engines`, eigener CI-Job.

## 0.5.1 – 2026-10-26

Stand für Testrunde 2.

### Geändert
- **Fuß jeder Seite:** „Stand der Inhalte“ zeigt jetzt das Datum der jüngsten Prüfung, aus den Inhalten berechnet (derzeit „21. Oktober 2026“), statt fest „2026-10“.
- **Überschrift der Startseite:** „Was erfahren deine Apps über dich?“ statt „Was lernen …“, weil „lernen“ zu positiv klang (D-056).
- **Tester-Feedback 2026-10-23:**
  - **Startseite:** Der Einstieg endet jetzt sichtbar. „Warum das wichtig ist“ steht darunter in einem eigenen, abgesetzten Bereich mit der Überschrift „Zum Weiterlesen“.
  - **Schritt für Schritt:** Geprüfte Schritte klappen direkt im Einstieg auf, statt auf eine andere Seite zu führen. Darunter verlinkt „Ganze Anleitung mit Quellen“ die vollständige Anleitung.
  - **Plan:** Die Kürzel „P1/P2/P3“ sind entfernt. Fehlte ein Abschnitt, sprang die Zählung zum Beispiel von P1 auf P3. Texte wie „die drei Schritte“, „Meine 3 ersten Schritte“ und „die 3 wichtigsten Schritte“ stimmen jetzt auch, wenn es weniger als drei Schritte sind.
- Browser-Test „Plan → Zustimmung“ wartet jetzt, bis die Seite bedienbar ist. Vorher schlug er etwa in einem von 30 Läufen fehl.
- **Nachprüfung 2026-10-21:** 7 weitere Anleitungen haben jetzt geprüfte Schritte aus offiziellen Hilfeseiten: Google-Zeitachse, verknüpfte Google-Dienste, YouTube-Kanal löschen, Telegram-Export, Snapchat-Personalisierung, Instagram-Werbeerlebnis und WhatsApp aus der Kontenübersicht entfernen. Damit sind 78 von 88 geprüft. Die 10 übrigen haben ein neues Prüfdatum und beschreiben, warum sie offen bleiben.
- **Alternativen:** 24 von 25 Einträgen sind gegen Quellen der Anbieter geprüft. Falsche Angaben sind korrigiert, unter anderem der Tresorit-Gratistarif, die Safari-Verschlüsselung und der Windows-Sync, die Signal-Backups, die OsmAnd-Bezahlfunktionen und die Ecosia-Fristen. Preise stehen jetzt mit Quelle, und schwache Sekundärquellen sind ersetzt. Offen bleibt Startpage.
- Nutzertests liefen über einen nicht öffentlichen Test-Link bei einem EU-Static-Host statt bei Cloudflare Pages (D-055). Der zugehörige Deploy-Workflow ist nicht Teil des öffentlichen Repositorys.

## 0.5.0 – 2026-10-19

Antwort auf das erste Testfeedback: „voll geladen, unruhig“, „man verliert sich“, „Einstellungen schwer zu finden“, „bessere Beispiele“. Der Feature-Stopp wurde dafür aufgehoben (D-050).

### Neu
- **Einstieg-Wizard** auf der Startseite mit vier Schritten, einer pro Bildschirm: Apps wählen → drei Lebensbereiche in Worten → ein belegter Fakt → eine Einstellung mit Direktlink. Ein geteilter Link startet bei Schritt 2 (D-049).
- **ICP** „Die Neugierige ohne Vorwissen“ als Maßstab für Texte und Gestaltung (`docs/product/icp.md`, D-048).
- **`/einstellungen/`**: alle Einstellungen je App, zuerst die ohne Komfortverlust, eigene Apps zuerst (D-052).
- **`/warum/`**: sechs belegte Fälle als neuer Inhaltstyp `content/examples.yaml` mit Quellenpflicht (D-053).
- **Englische Fassung** unter `/en/` mit englischen Pfaden und Sprachumschalter. Der Umschalter behält Seite und App-Auswahl. Inhalte liegen als Text-Overlays vor, Bewertungen und Quellen sind in beiden Sprachen identisch (ADR-0004, D-054).
- **CI** auf jedem Push: Lint, Typen, Unit- und Inhaltstests, Build, Browser-Tests.
- **Test-Build** `npm run build:test` mit `noindex`, `robots.txt: Disallow` und `X-Robots-Tag`.

### Geändert
- **Orientierung:** Hauptmenü mit vier Zielen (Einstellungen ändern · Mein Plan · Apps · Warum wichtig?), „Du bist hier“-Pfad auf jeder Unterseite, durchgehend „Apps“ statt „Dienste“ (D-051).
- **Gestaltung:** Startseite am Desktop zweispaltig, ruhigere Links, eine Hauptaktion pro Blick, einheitliche linke Kante.
- **Alle Apps** (`/dienste/`) als ruhige Liste nach Bekanntheit statt Konzern-Blöcken. Fakt-Texte vereinfacht und gegengeprüft.
- Die volle Matrix lebt jetzt unter „Meine Apps im Detail“ (`/check/`).

## 0.4.0 – 2026-10-08

### Neu
- Sechs weitere Dienste in voller Tiefe: Spotify, LinkedIn, Telegram, Snapchat, PayPal, Netflix (14 Dienste). Neue Kategorien „Musik & Podcasts“ und „Bezahlen“.
- Instagram-Konzept und 10 Karussell-Entwürfe, nicht veröffentlicht (D-N22).

### Behoben
- Mobile Darstellung bei 320–360 px auf 17 Seiten.
- Barrierefreiheit: eindeutige Seitentitel, Überschriften-Reihenfolge; axe ohne Verstöße.

## [0.3.0] – 2026-10-07 · Testbuild

### Geändert
- Visuelle Richtung „Research Instrument“: IBM Plex, Datenmuster als Matrix statt radialer Grafik, ein Akzentblau (D-040–D-045).

## [0.2.0] – 2026-10-07 · Testbuild

### Neu
- Datenmuster als Einstieg, Start-hier-Plan, Vertrauens-Panel, „Woher wissen wir das?“ mit Quellenart und Abrufdatum.
- Klartext-Pass für alle Inhalte, Red-Team-Korrekturen, weitere im Browser verifizierte Anleitungen.

## 0.1.0 – 2026-10-07

### Neu
- Erster Stand: Recherche, Produktdoku, Content-Modell mit Quellenpflicht, Astro/Preact-App mit 8 Diensten, Tests (Unit, Inhalte, E2E inkl. Barrierefreiheit und Netzwerk-Prüfung).

