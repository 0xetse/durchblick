# Gestaltung 2026-11 – „Klarer Begleiter“

Stand: 2026-11-12 · baut auf `visual-direction-v3.md` („Research Instrument“) auf und ersetzt es **nur für den Einstieg und die erste Kontaktfläche** (Wizard, Plan-Beschriftungen, Vertrauens-Panel). Grundlage: `docs/reviews/audit-2026-11.md` (Reviews C, D, F) und `docs/product/icp.md`.

## Ausgangslage

V3 ist ruhig und glaubwürdig (Review C: „works“). Die Schwächen liegen dort, wo die Zielgruppe „Neugierige ohne Vorwissen“ zuerst ankommt:

- Handy: Die Einleitung steht über jedem Wizard-Schritt; der Inhalt und „Weiter“ rutschen unter den Rand.
- Orientierung: „Schritt 2 von 4“ sagt nicht, *was* noch kommt.
- Schritt 4: „Das ändert sich / Das bleibt“ in kleiner Mono-Schrift; der Prüfstatus („noch nicht nachgeprüft“, EU-Unterschiede) fehlt ganz; ohne Direktlink war die eigentliche Handlung hinter einem zugeklappten „Schritt für Schritt“ versteckt (3 der 6 ersten Vorschläge).
- Bedienelemente mit 1,6–1,7 : 1 Kontrast (Ankreuzkästchen, Zweit-Knöpfe).
- Begriffe gegen die Wörterliste: „Abstrich“, „ungeprüft“, „Inspektion“, „Netzwerkziele“.

## Drei Richtungen, als echte Prototypen verglichen

Jede Richtung wurde als CSS-Overlay auf den gebauten Stand gelegt und bei 375 px und 1366 px in allen vier Schritten fotografiert (nicht im Repository; Vorgehen reproduzierbar mit Playwright `addStyleTag` und `bypassCSP` nur im Testbrowser).

| | A · Leise | B · Begleiter | C · Signal |
|---|---|---|---|
| Idee | V3 bleibt, nur Reibung raus (kompakte Einleitung ab Schritt 2, Kontrast) | benannte Schritte, abgesetzte Felder für „ändert sich / bleibt“, breiter Hauptknopf, Werkzeug als Karte | dunkles Band, sehr große Schrift, Pillen-Kacheln |
| Orientierung (ICP: „Wo bin ich, was kommt?“) | schwach | **stark** | mittel |
| Kognitive Last | gering | gering | mittel (viel Kontrast, große Typo) |
| Vertrauen / Ton | ruhig | ruhig, erklärend | wirkt im hellen Modus alarmierend – widerspricht „ohne Panikmache“ |
| Konsistenz mit den übrigen 229 Seiten | hoch | hoch, wenn auf den Einstieg begrenzt | gering |
| Platz auf dem Handy | gut | Karte kostet ~34 px Breite | Überschriften verdrängen Inhalt |
| Risiko | gering | gering bis mittel | hoch |

**Entscheidung:** B, mit der Zurückhaltung von A. Die Karte gibt es nur am Desktop (dort trennt sie Versprechen und Werkzeug), auf dem Handy nicht. C ist verworfen.

## Umgesetzt

| Element | Vorher | Jetzt | Warum |
|---|---|---|---|
| Fortschritt | 4 Striche + „Schritt 2 von 4“ in Mono | 4 benannte Schritte (Apps · Was sie erfahren · Ein Fakt · Ändern), aktueller fett; Zähler in Sans, Name auch für Screenreader | Orientierung ohne Lesen |
| Einleitung auf dem Handy | über jedem Schritt | ab Schritt 2 nur noch die Frage als kleine Überschrift (`:has()`) | jeder Schritt beginnt oben |
| Schritt 4 | Mono-Labels, kein Prüfstatus, Schritte zugeklappt | „Das ändert sich“ (blau getönt) / „Das bleibt“ (grau) als Felder; „Wo das geht: Browser (auch am Handy) · Android-App · iPhone-App“; Hinweis bei nicht nachgeprüften Schritten; ohne Direktlink sind die Schritte offen | Erfolgskriterium des ICP: eine Einstellung öffnen |
| Hauptknopf Handy | Inhaltsbreite | volle Breite | Daumen |
| Kontrast Bedienelemente | 1,6–1,7 : 1 | neues Token `--control`: hell #7d838c (3,8 : 1 auf Weiß), dunkel #737a84 (4,0 : 1) | WCAG 1.4.11 |
| Radius | 4 px | 6 px | etwas freundlicher, gleiche Sprache |
| Desktop | Linie zwischen Versprechen und Werkzeug | Werkzeug als Panel mit leichtem Schatten | klare Trennung „lesen“ / „tun“ |
| Wörter | Abstrich, ungeprüft, geprüft, Inspektion, Netzwerkziele, Tracker-Skripte, Resource Timing | Kostet Komfort, noch nicht nachgeprüft, Schritte geprüft (mit dem Zusatz „abgeglichen – nicht in einem echten Konto ausprobiert“), Gerade eben auf dieser Seite gemessen, Verbindungen: nur diese Website, Tracker | Wörterliste, ehrlicher Prüfbegriff |
| Fokus | Schritt-Überschrift ohne sichtbaren Fokus | sichtbarer Rahmen nur bei Tastatur (`:focus-visible`) | Orientierung für Tastatur |

Unverändert: Schrift (IBM Plex), Akzentblau, Haarlinien, Mono für echte Metadaten (Quellen, Daten), Dunkelmodus-Palette, reduzierte Bewegung.

## Nicht getan (bewusst)

- Keine App-Logos: Markenrechte, und sie würden Aufmerksamkeit auf die Anbieter statt auf die eigene Entscheidung lenken.
- Keine Illustrationen oder Animationen über die vorhandenen 0,12-s-Übergänge hinaus.
- Dienstseiten (12 000 px auf dem Handy) nicht umgebaut – größerer Eingriff, eigener Durchgang nach dem Nutzertest.

## Gegenprüfung (unabhängiger Agent, 3 Engines, 103 Screenshots)

Urteil: für die Zielgruppe klar besser; axe 0 Verstöße auf allen vier Schritten hell/dunkel, 375/1366 px, Plan und offenem Vertrauens-Panel; Reflow 320 px und 200 % ohne Querscrollen; `:has()` in WebKit und Firefox wie in Chromium. Eingearbeitet:

- Grammatikfehler aus dieser Änderung („über 8 von 9 Bereiche“ → „Bereichen“).
- Vertrauens-Panel behauptete „das misst dein Browser“ für alle Zeilen, zwei sind aber feste Angaben (Konto, Tracker) – Satz präzisiert.
- „Optional – kostet etwas Komfort“ passte nicht zu Datenexporten → „Optional – wenn du mehr willst“.
- Schrittnamen 13 statt 12 px, App-Name in Schritt 4 nicht mehr in Linkfarbe, „Wo das geht:“ statt „Geht über:“.

Bewusst gelassen: Beim Zurück zu Schritt 1 erscheint die Einleitung wieder (Sprung um ~225 px, Fokus landet korrekt auf der Überschrift).
