# Bedrohungsmodell

Stand: 2026-10-07 · Methode: STRIDE-orientiert, mit Fokus auf das künftige lokale Import-Feature

## Schützenswerte Güter

1. **Vertrauen** in die Aussagen und in das Versprechen „keine Tracker" (Reputationsgut – ein einziger Verstoß zerstört das Produkt).
2. **Persönliche Auswahl und Fortschritt** der Nutzer (gering sensibel, aber Hinweise auf genutzte Dienste).
3. **Künftig: importierte Exporte** (Standortverlauf, Suchverlauf, Nachrichten – hochsensibel).
4. **Integrität der Inhalte** (falsche Anleitung = Nutzer ändert falsche Einstellung oder landet auf Phishing-Seite).

## Angreifer und Szenarien (MVP)

| # | Bedrohung | Szenario | Gegenmaßnahme | Status |
|---|---|---|---|---|
| T1 | Supply-Chain (Tampering) | kompromittiertes npm-Paket schleust Tracking/Exfiltration in das Bundle | wenige, exakt gepinnte Abhängigkeiten; `package-lock.json`; Audit (auch in der CI); CSP mit `default-src`/`connect-src 'self'` blockiert Verbindungen zu fremden Hosts (bis 2026-11 fehlte das – die CSP regelte nur Skripte und Styles); E2E-Test auf fremde Anfragen | umgesetzt |
| T2 | XSS | Inhalt (YAML) enthält HTML/JS | Inhalte werden als Text gerendert (Astro/Preact escapen), `set:html` nur für JSON-LD, mit `<` als `\u003c` maskiert; URLs im Schema nur `https://` ohne Zugangsdaten; CSP ohne `unsafe-inline` | umgesetzt |
| T3 | Bösartige Links | manipulierte `officialUrl` führt auf Phishing-Seite | Schema erlaubt nur `https:`; Review-Pflicht für Content-Änderungen; künftig: Allowlist offizieller Domains je Dienst (Test) | teilweise (Allowlist offen) |
| T4 | Hoster injiziert Skripte | CDN-Analyse/Bot-Schutz fügt JS ein | Hosting-Anforderung; CSP blockiert unbekannte Skripte und macht Verstoß sichtbar | Entscheidung offen |
| T5 | Clickjacking | Einbettung in fremde Seite | `frame-ancestors 'none'`, `X-Frame-Options: DENY` (Header) | umgesetzt (Header-Datei) |
| T6 | Referrer-Leck | Zielseite erfährt, dass man von „Konto löschen"-Anleitung kommt | `Referrer-Policy: no-referrer`, `rel=noreferrer` | umgesetzt |
| T7 | Information Disclosure lokal | Mitbenutzer des Geräts sieht ausgewählte Dienste | Speichern nur nach Zustimmung; Löschen mit einem Klick | umgesetzt |
| T8 | Falsche/veraltete Inhalte | Einstellung verschoben, Anleitung führt ins Leere | Prüfdatum, `needs-verification`, „Möglicherweise veraltet" nach 6 Monaten | umgesetzt |
| T9 | Service-Worker-Missbrauch | veralteter/bösartiger SW bleibt aktiv | SW nur gleiche Herkunft, `Cache-Control: no-cache` für `sw.js`, Versionierung | umgesetzt |
| T10 | Rechtlicher Angriff | Unternehmen geht gegen Bewertung vor | Methodik offen, keine Zahl/kein Ranking, Quellen je Aussage, Korrekturprozess | umgesetzt, Rechtsprüfung offen |

## Künftiges Feature: lokaler Datenimport

Das ist der Teil mit dem höchsten Risiko, weil die Daten hochsensibel sind.

| # | Bedrohung | Gegenmaßnahme (Pflicht vor Umsetzung) |
|---|---|---|
| I1 | Exfiltration der Importdaten durch eigenen Code, Abhängigkeit oder Hoster-Skript | Import-Route mit eigener, strengerer CSP (`connect-src 'none'`, keine Drittskripte); Parser in Web Worker ohne Netzwerk-APIs; E2E-Test, der Import mit Testdatei durchführt und jede Anfrage protokolliert; Abhängigkeiten des Parsers minimal und auditiert |
| I2 | ZIP-Bombe / Speichererschöpfung | Streaming-Entpacken, Größen- und Dateianzahl-Limits, Abbruch-Knopf, Worker isoliert UI |
| I3 | Pfad-/Dateinamen-Tricks im Archiv | Dateinamen nie als Pfad oder HTML verwenden; Allowlist erwarteter Dateien |
| I4 | Bösartiger Inhalt im Export (HTML in Takeout) | HTML-Exporte nie rendern, nur als Text parsen; JSON bevorzugen; Ausgabe escapen |
| I5 | Persistenz ohne Wissen | Standard: nur Arbeitsspeicher; Speichern in IndexedDB nur nach Zustimmung, mit sichtbarer Größe und Löschknopf |
| I6 | Schulterblick / Bildschirmfreigabe | Hinweis vor der Ergebnisansicht; sensible Abschnitte (Standort) standardmäßig eingeklappt |
| I7 | Falsche Schlüsse aus Rohdaten | Ergebnisse mit denselben Gewissheitsstufen wie im Rest des Produkts kennzeichnen |
| I8 | Social Engineering („Lade deine Daten hier hoch") durch Nachahmer | Kommunikation: Durchblick fordert nie zum Hochladen auf einen Server auf; Prüfanleitung in der Transparenzseite |

## Sicherheitsmaßnahmen im Repository

- Keine Secrets: Das Produkt benötigt keine Umgebungsvariablen. `.env*` ist in `.gitignore`. Siehe `docs/security/security.md`.
- `npm run audit:deps` prüft Produktionsabhängigkeiten und läuft seit 2026-11 in der CI. Stand 2026-11-11: 0 Befunde (zod auf 4.6.7, undici über `npm audit fix`). Bekannt in der **Dev**-Kette: 7 × moderate, alle eine Lücke: `minimatch` < 11.0.1 (GHSA-g3hv-75wg-m249, DoS durch Glob-Muster) über `@typescript-eslint/typescript-estree`, das selbst in der neuesten Version (8.72.2) `minimatch ^10.2.2` verlangt. Geprüft 2026-11-12: Ein `overrides` auf `minimatch@11.0.8` läuft (Lint grün, Audit 0), wird aber **nicht** übernommen – es verlässt den von typescript-eslint unterstützten Bereich, und die Lücke betrifft nur ein Entwicklungswerkzeug, das unsere eigenen Glob-Muster liest. Der von npm vorgeschlagene „Fix“ ist ein Downgrade auf typescript-eslint 8.36.0 und wird ebenfalls nicht übernommen. Wieder prüfen, sobald typescript-eslint auf minimatch 11 wechselt.
- `security.txt` vorbereitet; Kontakt vor Veröffentlichung festlegen.
