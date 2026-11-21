# Bedrohungsmodell

Stand: 2026-10-07 · Methode: STRIDE-orientiert, mit Fokus auf das künftige lokale Import-Feature
Teilaktualisierung 2026-11-21: T3, T7, neue Zeilen T11/T12 (Speicherorte im Browser) und der Abschnitt „Sicherheitsmaßnahmen im Repository“ gegen den Code geprüft und angepasst. Die übrigen Zeilen sind auf dem Stand vom 2026-10-07.

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
| T3 | Bösartige Links | manipulierte `officialUrl` führt auf Phishing-Seite | Schema erlaubt nur `https:`; Review-Pflicht für Content-Änderungen; Allowlist offizieller Domains je Unternehmen, geprüft in `tests/content/links.test.ts` | umgesetzt |
| T4 | Hoster injiziert Skripte | CDN-Analyse/Bot-Schutz fügt JS ein | Hosting-Anforderung; CSP blockiert unbekannte Skripte und macht Verstoß sichtbar | Entscheidung offen |
| T5 | Clickjacking | Einbettung in fremde Seite | `frame-ancestors 'none'`, `X-Frame-Options: DENY` (Header) | umgesetzt (Header-Datei) |
| T6 | Referrer-Leck | Zielseite erfährt, dass man von „Konto löschen"-Anleitung kommt | `Referrer-Policy: no-referrer`, `rel=noreferrer` | umgesetzt |
| T7 | Information Disclosure lokal | Mitbenutzer des Geräts sieht ausgewählte Dienste | ohne Zustimmung nur `sessionStorage` dieses Tabs und nie automatisch in Adressen (D-057); `localStorage` nur nach Zustimmung; „Alles löschen“ entfernt `localStorage`-Einträge, Tab-Auswahl und Auswahl in der Adresse | umgesetzt; Rest-Risiko: Browser bewahren `sessionStorage` zur Tab-Wiederherstellung auf, und ein bewusst geteilter Link (`#d=…`) landet im Verlauf |
| T11 | Information Disclosure über Offline-Cache | Cache Storage verrät, welche Apps jemand angesehen hat | Service Worker speichert nur feste Kernseiten, Manifest, Icon, Schriften und gehashte Build-Dateien, keine besuchten Einzelseiten (seit SW v5), Adressen ohne Fragment `#d=…` (seit SW v4); E2E-Test prüft den Cache-Inhalt (`tests/e2e/state.spec.ts`) | umgesetzt; der Cache liegt ohne Zustimmung vor (nur öffentliche Dateien) und wird von „Alles löschen“ nicht geleert |
| T12 | Speicher ohne Wissen | Daten bleiben gespeichert, ohne dass die Person es weiß | `/transparenz/` und die Kopfzeile zeigen live, was gespeichert ist; jeder `localStorage`-Schlüssel ist beschrieben (`src/domain/storage.ts`) | umgesetzt für `localStorage` und die Tab-Auswahl; den Offline-Cache erklärt `/transparenz/` im Text, listet ihn aber nicht live auf |
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
- `npm run audit:deps` prüft Produktionsabhängigkeiten und läuft in der CI (Job `verify`); einzelne geprüfte Advisories können mit Ablaufdatum ausgenommen werden (`scripts/audit-exceptions.json`, Regeln in `SECURITY.md`). Stand 2026-11-21: 0 Befunde und keine Ausnahmen; auch `npm audit` einschließlich der Entwicklungsabhängigkeiten meldet 0. Die frühere Lücke in der Dev-Kette (`minimatch`, GHSA-g3hv-75wg-m249) besteht nicht mehr.
- Dependabot schlägt Updates wöchentlich als Pull Request vor; CodeQL analysiert den Code und die Workflows (siehe `README.md`, „Tests & Qualität“).
- `public/.well-known/security.txt` nennt die vertrauliche Meldung über GitHub und eine Kontaktadresse (siehe `SECURITY.md`).
