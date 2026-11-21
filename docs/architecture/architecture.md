# Technische Architektur

Stand: 2026-10-07 · Kanonisch für die Produkt-Codebasis

## Überblick

```
content/*.yaml ──(Build: Zod-Validierung + Integritätsprüfung)──► Astro (statisches HTML)
                                                                      │
                                         Preact-Inseln (nur wo Interaktion nötig)
                                                                      │
                                Browser: Berechnung lokal · localStorage nur mit Zustimmung
                                                                      │
                                     Statisches Hosting (kein Server-Code, keine Datenbank)
```

**Kernentscheidung:** Durchblick ist eine **statisch erzeugte Website mit interaktiven Inseln** und **ohne Backend**. Das ist nicht nur schnell und günstig, sondern die stärkste technische Antwort auf das Vertrauensparadox: Was es nicht gibt, kann nichts sammeln.

## Stack

| Bereich | Wahl | Begründung | ADR |
|---|---|---|---|
| Framework | **Astro 7** (statischer Output) | HTML zuerst, null JS als Standard, Inseln nur bei Bedarf, sehr gutes SEO, i18n-Routing, eingebaute CSP mit Hashes | ADR-0001 |
| Interaktive Inseln | **Preact 11** | ~4 kB, React-kompatible API, SSR-fähig; Inseln sind ohne JS als statisches HTML lesbar | ADR-0001 |
| Sprache | TypeScript (strictest) | Typsicherheit über Content, Domain-Logik und UI | – |
| Content | YAML in `content/`, **Zod 4**-Schemas in `src/domain/schema.ts` | redaktionell lesbar, diffbar, CMS-/API-migrationsfähig; Laufzeitvalidierung im Build | ADR-0002 |
| Styles | eigenes CSS mit Design-Tokens (CSS Custom Properties) | keine Utility-Framework-Abhängigkeit; Tokens für Hell/Dunkel | – |
| Schriften | selbst gehostet (Fontsource): Fraunces (Display), Atkinson Hyperlegible Next (Text) | keine Anfragen an Schrift-CDNs; Atkinson ist auf Lesbarkeit bei Sehschwäche ausgelegt | – |
| PWA | handgeschriebener Service Worker (`public/sw.js`, ~130 Zeilen) + Manifest | inspizierbar, keine Workbox-Abhängigkeit, nur gleiche Herkunft | ADR-0003 |
| Tests | Vitest (Unit, Content, Komponenten), Playwright + axe-core (E2E, Barrierefreiheit, Netzwerk-Prüfung: nur eigene Herkunft auf den geprüften Seiten) | – | – |
| Qualität | ESLint (typescript-eslint, astro, jsx-a11y), `astro check` | Lint-Regel verbietet `fetch`/XHR/WebSocket/`sendBeacon` im App-Code | – |

## Verzeichnisstruktur

```
content/                 Wissensbasis (YAML), nie in Komponenten hart kodiert
  services/<id>.yaml     ein Dienst je Datei (id = Dateiname)
  guides/<service>.yaml  Liste von Anleitungen je Dienst
  sources/<x>.yaml       Quellen (global eindeutige IDs)
  companies.yaml, alternatives.yaml, simulator.yaml
src/domain/              framework-unabhängige Logik (rein, getestet)
  schema.ts              Zod-Schemas = Content-Vertrag
  content.ts             Build-Loader + Integritätsprüfung (nur serverseitig!)
  projections.ts         Content → schlanke Props für Inseln
  assessment.ts footprint.ts plan.ts simulator.ts freshness.ts storage.ts
src/i18n/de.ts           UI-Texte + Taxonomie-Bezeichnungen
src/islands/*.tsx        interaktive Inseln (Spuren, Fußabdruck, Plan, Datenreise, Transparenz)
src/components/          statische Bausteine (Astro/Preact ohne Hydrierung)
src/pages/               Routen (siehe information-architecture.md)
public/                  sw.js, Manifest, Icons, _headers, security.txt
tests/{unit,content,e2e}
```

**Regel:** `src/domain/content.ts` (inkl. YAML-Parser) wird nie von einer Insel importiert. Inseln bekommen nur projizierte, serialisierbare Daten. So landet weder Parser noch Gesamt-Content im Client-Bundle.

## Datenfluss persönlicher Angaben

| Angabe | Wo berechnet | Wo gespeichert | Verlässt das Gerät? |
|---|---|---|---|
| Ausgewählte Spuren (Simulator) | Browser | nur im Arbeitsspeicher | nein |
| Ausgewählte Dienste | Browser | `sessionStorage` nur dieses Tabs (D-057, `src/domain/selection.ts`); `localStorage` nur mit Zustimmung; in einer Adresse (`#d=…`) nur nach „Link mit meiner Auswahl teilen“, beim Öffnen übernommen und entfernt | nein |
| Erledigte Maßnahmen | Browser | Arbeitsspeicher; `localStorage` nur mit Zustimmung | nein |
| Seitenabrufe | – | Zugriffsprotokoll des Hostings (siehe Privacy-Architektur) | ja, technisch zwangsläufig (wie bei jeder Website) |

## Internationalisierung

- UI-Texte in `src/i18n/<locale>.ts` mit identischer Form (`Dictionary`-Typ).
- Content-Struktur ist sprachneutral (IDs, Stufen, Quellen); Texte im MVP Deutsch. Weitere Sprachen über **Overlay-Dateien** (`content/i18n/<locale>/services/<id>.yaml`), die nur Textfelder per ID überschreiben – Struktur, Bewertungen und Quellen bleiben eine einzige Wahrheit (ADR-0004).
- Routing: Deutsch ohne Präfix, weitere Sprachen mit Präfix (Astro i18n bereits konfiguriert).

## Sicherheit (Kurzfassung, Details: `docs/security/threat-model.md`)

- **CSP** per `<meta>` mit Hashes für alle Skripte/Styles (Astro `security.csp`), kein `unsafe-inline`; ergänzende Header (`frame-ancestors`, HSTS, `Referrer-Policy: no-referrer`, `Permissions-Policy`) über `public/_headers`.
- Externe Links: `rel="noopener noreferrer"`, globaler `<meta name="referrer" content="no-referrer">`.
- Keine `set:html`/`dangerouslySetInnerHTML` mit Content (einzige Ausnahme: JSON-LD aus `JSON.stringify` eigener Daten).
- Inhalte sind redaktionell und werden im Build validiert (URLs nur `https:`).
- Abhängigkeiten minimal und exakt gepinnt; `npm run audit:deps` für Produktionsabhängigkeiten.

## Machbarkeit: lokaler Datenimport (Zukunft)

**Ziel:** „Zeig mir, was mein Google-Takeout über mich sagt" – ohne Upload.

| Aspekt | Einschätzung |
|---|---|
| Dateiformate | Google Takeout: ZIP mit JSON/HTML/CSV je Produkt (z. B. „Meine Aktivitäten" wahlweise HTML oder JSON). Meta „Deine Informationen herunterladen": ZIP mit wählbarem HTML oder JSON. Formate ändern sich ohne Ankündigung → Parser pro Quelle versioniert, tolerant, mit Testfixtures. *Formatdetails vor Umsetzung gegen aktuelle Exporte prüfen.* |
| Entpacken im Browser | machbar mit Streaming-ZIP-Bibliotheken (z. B. `fflate`), in einem **Web Worker**, damit die Oberfläche nicht blockiert. Dateien mehrere GB groß möglich → Streaming, nur benötigte Pfade lesen, Abbruch bei Größenlimit. |
| Verarbeitung | Web Worker mit `postMessage`, Ergebnisse als aggregierte Kennzahlen (Zeitachse, Kategorien, Häufigkeiten). Rohdaten bleiben im Worker-Speicher, werden nicht persistiert (optional: IndexedDB nur mit Zustimmung). |
| Zusage „verlässt das Gerät nicht" | technisch absicherbar und prüfbar (in den getesteten Browsern): strenge CSP mit `connect-src 'self'` (bzw. `'none'` auf der Import-Route), keine Netzwerk-APIs im Worker (Lint-Regel), E2E-Test, der während des Imports jede Anfrage protokolliert und fehlschlägt, falls eine erfolgt. |
| Risiken | bösartige/defekte Archive (ZIP-Bomben, Pfad-Tricks), Speicherverbrauch auf Mobilgeräten, Darstellung hochsensibler Daten (Standortverlauf) auf geteilten Geräten → siehe Bedrohungsmodell. |
| Fazit | **machbar** als eigenständige, lazy geladene Route mit eigenem Worker; nicht im MVP, Architektur (Inseln, CSP, Lint-Regeln, Storage-Modul) ist darauf vorbereitet. |

## Änderungsmonitor (Zukunft)

Das Datenmodell trägt pro Dienst `reviewedAt`, pro Anleitung `verification.checkedAt/status`, pro Quelle `retrievedAt`. Nächster Schritt: `content/changes/<service>.yaml` (Änderungsprotokoll: Datum, Art, Beschreibung, Quelle) und ein **redaktioneller** Prüfrhythmus (Skript listet überfällige Prüfungen; keine automatische Überwachung fremder Websites im MVP – das wäre fehleranfällig und rechtlich/ethisch heikel beim Scraping).

## Hosting

Jeder statische Host funktioniert (`dist/`). Kriterien und Empfehlung stehen in `docs/privacy/privacy-architecture.md` und `docs/DECISIONS_NEEDED.md` (Entscheidung offen: EU-Hosting mit minimaler Protokollierung).
