# Privacy-Architektur

Stand: 2026-10-07 · Grundsatz: **Wir erheben nichts, wofür es keinen klaren Produktgrund gibt.**

## Was die App erhebt

| Datum | Zweck | Ort | Dauer | Rechtsgrundlage (Einschätzung, keine Rechtsberatung) |
|---|---|---|---|---|
| Server-Zugriffsdaten (IP, Zeit, URL, User-Agent) | Auslieferung, Betriebssicherheit | Hosting-Anbieter | abhängig vom Hoster – Ziel ≤ 7 Tage oder gar keine Protokollierung | Art. 6 Abs. 1 lit. f DSGVO; Hoster als Auftragsverarbeiter |
| Einwilligung „lokal merken" | eigene Entscheidung respektieren | `localStorage` des Nutzers | bis zum Löschen | auf Wunsch des Nutzers; § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für ausdrücklich gewünschten Dienst) – zusätzlich ausdrücklich erfragt |
| Erledigte Maßnahmen (Guide-IDs) | Fortschritt anzeigen | `localStorage` | bis zum Löschen | wie oben |
| Ausgewählte Dienste (IDs) | Auswahl beim Seitenwechsel im Tab behalten; Plan/Fußabdruck | `sessionStorage` (nur dieser Tab, ohne Zustimmung, D-057); `localStorage` nur mit Zustimmung; in einer Adresse nur nach „Link mit meiner Auswahl teilen“ | Tab: bis der Tab geschlossen wird – **nicht spurlos**, Browser halten ihn für die Tab-Wiederherstellung auf der Festplatte; Gerät: bis zum Löschen | wie oben |
| Offline-Kopien der Seiten | Offline-Nutzung | Cache Storage (Service Worker): nur feste Kernseiten und Build-Dateien, keine besuchten Seiten (seit SW v5; v4 speicherte besuchte Seiten, vor v4 sogar mit `#d=…`) | bis zur nächsten Version | technisch erforderlich, keine personenbezogenen Daten |
| Wizard-Schritt | Zurück-Taste und Neuladen führen zum selben Schritt | `history.state` (nur dieser Tab) | bis der Tab geschlossen wird | technisch erforderlich, nur eine Zahl 1–4 |

## Was die App nicht erhebt

Keine Konten · keine Cookies · keine Analyse (weder Drittanbieter noch selbst gehostet) · keine Fehler-Telemetrie · keine Fingerprinting-Techniken · keine eingebetteten Inhalte Dritter (Videos, Karten, Schriften, Social-Buttons) · keine Formulare, die Daten an einen Server senden · keine Werbung · keine Affiliate-Parameter.

## Browser-Speicher

- Namensraum `durchblick:` (siehe `src/domain/storage.ts`); jeder Schlüssel ist dokumentiert (`KEY_DESCRIPTIONS`) und wird auf `/transparenz/` live mit Inhalt angezeigt.
- Schreiben ist technisch an die Einwilligung gekoppelt (`write()` prüft `hasConsent()`); Widerruf löscht alles.
- Export als JSON, Löschen mit einem Klick.
- `localStorage` statt IndexedDB: Datenmenge winzig, synchron, einfach zu inspizieren. IndexedDB erst für den späteren Datenimport (große Datenmengen, nur mit Zustimmung).

## Externe Anfragen und Drittabhängigkeiten zur Laufzeit

**Keine.** Alle Dateien (inkl. Schriften) kommen von der eigenen Domain. Abgesichert durch:
1. CSP: Astro erzeugt pro Seite eine CSP mit Hashes für Skripte und Styles und – seit 2026-11 – `default-src`/`connect-src`/`img-src`/`font-src`/`worker-src 'self'`, damit auch ein kompromittiertes Bundle nichts an fremde Hosts senden kann. Ergänzend Header (`_headers`) mit denselben Abruf-Direktiven plus `frame-ancestors`; bewusst ohne `default-src` (sonst würden die gehashten Inline-Skripte blockiert, Test: `tests/unit/security.test.ts`).
2. ESLint-Regel gegen `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` im App-Code.
3. E2E-Test `tests/e2e/trust.spec.ts`: schlägt fehl, sobald irgendeine Seite eine Anfrage an eine fremde Herkunft stellt, ein Cookie setzt oder ohne Zustimmung etwas speichert.

Externe **Links** (offizielle Einstellungsseiten, Quellen) werden erst beim Klick geöffnet; `noreferrer` und globale `no-referrer`-Policy verhindern, dass der Zielseite mitgeteilt wird, von welcher Durchblick-Seite (z. B. „Dienst X löschen") man kommt.

## IP-Verarbeitung und Hosting

Die einzige personenbezogene Verarbeitung, die wir nicht vermeiden können, ist die IP-Adresse beim Seitenabruf. Anforderungen an das Hosting (Entscheidung offen, siehe `docs/DECISIONS_NEEDED.md`):

1. Sitz/Verarbeitung in der EU, AV-Vertrag nach Art. 28 DSGVO.
2. Zugriffsprotokolle abschaltbar oder IP-gekürzt bzw. kurze Speicherfrist.
3. Kein vom Hoster eingeschleustes Analyse-/Bot-Skript (manche CDNs injizieren Skripte – das würde die CSP brechen und muss deaktiviert sein).
4. Unterstützung eigener Response-Header.

## Analytics – bewusst nicht im MVP

Wir wissen dadurch nicht, wie viele Menschen das Produkt nutzen. Optionen für später, in aufsteigender Invasivität – jede nur nach eigenem ADR mit Privacy-Review:
1. Freiwillige, anonyme Ein-Klick-Rückmeldung ohne Kennung („Hat dir das geholfen? Ja/Nein") → benötigt einen minimalen Endpunkt.
2. Aggregierte Zählung aus Server-Logs beim Hoster, ohne IP-Speicherung.
3. Cookieloses, selbst gehostetes Zählwerkzeug ohne IP-Speicherung.

Die Transparenzseite müsste jede dieser Optionen sichtbar machen.

## Künftiges Kontenmodell

Kein Konto im MVP und keines geplant, solange lokale Speicherung genügt. Falls Synchronisation zwischen Geräten gewünscht wird: Ende-zu-Ende-verschlüsselt (Schlüssel nur beim Nutzer, z. B. aus Passphrase abgeleitet), Server speichert nur Chiffrat, Export/Löschen gleichwertig. Alternativ: Datei-Export/Import zwischen Geräten ohne Server.

## Künftiger Datenimport (Takeout etc.)

Siehe `docs/architecture/architecture.md` (Machbarkeit) und `docs/security/threat-model.md`. Grundsatz: Verarbeitung im Web Worker, `connect-src 'none'` auf der Import-Route, keine Persistenz ohne Zustimmung, Ergebnis-Ansicht mit „Bildschirm-Teilen"-Warnung.

## Die Aussage „Nichts verlässt dein Gerät"

Diese Aussage verwenden wir **nicht pauschal**, weil der Seitenabruf technisch beim Hoster ankommt. Verwendet wird die präzise Fassung: *„Deine Auswahl, deine Antworten und dein Fortschritt verlassen dein Gerät nicht."* Das ist durch Architektur (kein Endpunkt, der sie annehmen könnte), CSP und E2E-Test belegt.


## Auswahl in der Adresse (Prüfung 2026-11)

Die App-Auswahl steht als Fragment in der Adresse (`#d=google,instagram`). Geprüft:

- **Nicht betroffen:** Server-Logs (Fragmente werden nie gesendet), Referrer (Fragmente nie; zusätzlich `no-referrer` als Meta und Header, `rel="noreferrer"` an allen externen Links), externe Dienste (CSP).
- **Behoben:** Der Service Worker legte Seiten unter der vollen Adresse samt `#d=…` im Cache ab – die Auswahl blieb so ohne Zustimmung gespeichert und „Alles löschen“ erreichte sie nicht. Seit SW v4 ohne Fragment; v4 löscht alle älteren Caches. „Alles löschen“ entfernt jetzt auch die Auswahl aus der Adresse der offenen Seite.
- **Bis zur Umsetzung von D-057 (2026-11-13):** Wie jede Adresse behielt der Browser sie im Verlauf (gemessen: jeder Zwischenstand) und gegebenenfalls im Browser-Sync. Seit D-057 steht die Auswahl nicht mehr automatisch in Adressen; siehe unten.

**Umgesetzt 2026-11-13 (D-057):** Die Auswahl steht nicht mehr automatisch in Adressen. Nachweis und Grenzen: `docs/privacy/d-n24-entscheidungsvorlage.md`, Abschnitt 7.
