# Mitmachen bei Durchblick

Danke, dass du helfen möchtest. Durchblick erklärt, was Apps über Menschen erfahren und was man dagegen tun kann – ruhig, belegt und ohne selbst Daten zu sammeln. Beiträge müssen diesen Anspruch halten.

*English summary at the end.*

## Was am meisten hilft

1. **Inhaltliche Korrekturen** – eine Aussage stimmt nicht (mehr), ein Menüpunkt heißt anders, ein Link führt ins Leere. Bitte mit Quelle (offizielle Hilfeseite, Datenschutzerklärung, Behörde) und Abrufdatum. Vorlage: *Inhaltlicher Fehler*.
2. **Geprüfte Anleitungen** – viele Anleitungen sind als „noch nicht nachgeprüft“ markiert. Wer einen Schritt in einem echten Konto nachvollzogen hat, kann das melden (ohne Screenshots mit persönlichen Daten).
3. **Fehler in der Website** – Darstellung, Bedienung mit Tastatur oder Screenreader, Browser-Probleme. Vorlage: *Fehler melden*.
4. **Übersetzungen** – derzeit Deutsch und Englisch (`content/i18n/en/`).

Sicherheitsprobleme bitte **nicht** als Issue melden, sondern wie in [`SECURITY.md`](SECURITY.md) beschrieben.

## Grundsätze, die nicht verhandelbar sind

- **Keine Datenerhebung.** Keine Analyse, kein Tracking, keine Cookies, keine Konten. Keine Requests an fremde Server aus der Website – auch keine Schriftarten, Bilder oder Skripte von CDNs. ESLint verbietet Netzwerk-APIs im App-Code, und die Browser-Tests prüfen, dass nur die eigene Herkunft angefragt wird.
- **Keine neuen Drittanbieter** ohne nachvollziehbaren Grund und Diskussion in einem Issue vorab.
- **Jede Aussage über einen Dienst braucht eine Quelle** (`content/sources/`), mit Herkunft und Gewissheit. Lieber „noch nicht nachgeprüft“ als eine geratene Anleitung. Redaktionsregeln: [`docs/content/content-guidelines.md`](docs/content/content-guidelines.md).
- **Kein Alarmismus.** Sachlich, nachvollziehbar, ohne Panikmache. Keine Bewertung von Anbietern als Punktzahl.
- **Keine Logos oder Screenshots von Apps** (Markenrechte, Persönliches in Screenshots).
- **Barrierefreiheit** nach WCAG 2.2 AA bleibt erhalten; axe-Prüfungen laufen in den Tests.

## Entwicklung

Voraussetzung: Node ≥ 22.12.

```bash
npm ci                 # exakt die Versionen aus package-lock.json
npm run dev            # http://localhost:4321
npm run lint           # ESLint
npm run check          # Typen (astro check)
npm test               # Unit- und Inhaltstests (Vitest)
npm run build          # statischer Output in dist/
npx playwright install chromium   # einmalig
npm run test:e2e       # Browser-Tests gegen den gebauten Stand
```

Vor einem Pull Request bitte mindestens `npm run lint`, `npm run check`, `npm test` und `npm run build` ausführen. Bei Änderungen an Seiten oder Inseln auch `npm run test:e2e`. Aufbau des Projekts: [`README.md`](README.md#architektur) und [`docs/architecture/`](docs/architecture/).

## Pull Requests

- Klein und fokussiert: ein Thema pro PR.
- Beschreibe, **was** sich ändert und **warum**, und wie du es geprüft hast. Behaupte keine Tests, die du nicht ausgeführt hast.
- Neue Funktionen bitte zuerst als Issue besprechen. Durchblick hält den Funktionsumfang bewusst klein.
- Tests nicht abschwächen oder entfernen, um eine Prüfung grün zu bekommen.
- Inhaltliche Änderungen: Quelle mit Abrufdatum angeben.
- Die Maintainer prüfen jeden PR. Workflows aus Forks laufen erst nach Freigabe durch die Maintainer.

## Verhalten

Für alle Beiträge gilt der [Verhaltenskodex](CODE_OF_CONDUCT.md).

## KI-Werkzeuge

Durchblick selbst wird mit KI-Unterstützung entwickelt (siehe [`README.md`](README.md#wie-durchblick-entsteht)). Beiträge mit Hilfe von KI-Werkzeugen sind deshalb willkommen – unter denselben Regeln wie alle anderen:

- Du hast den Beitrag selbst gelesen, verstanden und geprüft und kannst Rückfragen dazu beantworten.
- Quellen sind echt und tatsächlich aufgerufen; Zitate stimmen wörtlich. Bitte keine von einer KI „erinnerten“ Menüwege oder Links ohne Prüfung.
- Gib in der PR-Beschreibung kurz an, ob und wofür du KI-Werkzeuge genutzt hast.

## Lizenz deiner Beiträge

Mit einem Beitrag bestätigst du, dass du ihn einreichen darfst, und stimmst zu, dass er unter den Lizenzen des Projekts veröffentlicht wird: **Code unter MIT**, **redaktionelle Inhalte und Dokumentation unter CC BY 4.0** (Abgrenzung: [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)). Bitte keine fremden Texte, Bilder oder Code übernehmen, deren Lizenz das nicht erlaubt; kurze wörtliche Zitate aus Quellen sind als Zitat zu kennzeichnen.

---

## English summary

Durchblick is a German/English guide that explains what apps learn about people and how to change settings, without collecting any data itself. Contributions are welcome, especially corrections with an official source, verification of guide steps, bug reports and accessibility fixes. Ground rules: no tracking, analytics, cookies or third-party requests; every claim about a service needs a source; no alarmism; no app logos or personal screenshots. Report security issues privately as described in [`SECURITY.md`](SECURITY.md). Run `npm run lint`, `npm run check`, `npm test` and `npm run build` before opening a pull request. AI-assisted contributions are welcome if you have reviewed them yourself and say so in the PR. By contributing you agree that code is licensed under MIT and editorial content/documentation under CC BY 4.0 (see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)). Issues and pull requests may be written in German or English.
