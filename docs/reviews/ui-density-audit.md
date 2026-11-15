# UI-Dichte-Audit (V2 → V3)

Datum: 2026-10-07 · Gegenstand: V2-Oberfläche (Version 0.2.0), mobil (Pixel 7) und Desktop (1280 px), Seiten Start, Start mit Auswahl, Instagram-Dienstseite, Plan, Spuren, Transparenz, Vertrauens-Panel.

**Gesamturteil:** Die V2-Oberfläche wirkt wie eine freundliche Consumer-App. Fast jede Informationseinheit steckt in einem eigenen abgerundeten, gefüllten Behälter; Farbe wird dekorativ eingesetzt (Petrol-Flächen, Rost-Ringe, Indigo-Chips); die serifenbetonte Display-Schrift (Fraunces) und runde Pillen geben einen verspielten, „weichen" Ton. Inhaltlich ist das Produkt präzise – visuell kommuniziert es diese Präzision nicht.

## 1. Unnötige Karten

| Ort | Befund | Maßnahme V3 |
|---|---|---|
| Start: „Jede App im Detail" | 8 Kacheln mit Rahmen, Radius 14 px, Hover-Anheben | schlichte Liste mit Trennlinien und Metadaten |
| Start: Vertrauensabschnitt | vier petrolfarbene Kacheln „0 Cookies" usw. | eine kompakte Kennwert-Liste (Schlüssel/Wert) |
| Datenmuster: Fakt („Das wissen die wenigsten") | weiße Karte mit Schatten und farbigem Linksbalken | Abschnitt mit Haarlinie oben, kein Schatten |
| Datenmuster: Handlung | petrolfarbene Fläche | Abschnitt mit Haarlinie, Metadatenzeile |
| Dienstseite: „Auf einen Blick" | vier Karten mit Chips | eine zweispaltige Definitionstabelle |
| Dienstseite: jeder Datenpunkt | eigene Karte (≈ 12 pro Seite) | Zeilen einer Liste, Trennlinien |
| Dienstseite: jede Ableitung, jede Anleitung | eigene Karte | Zeilen |
| Dienstseite: Datenprofil | zwei Karten mit je 6/4 Zeilen | eine Tabelle ohne Karte |
| Plan: jede Maßnahme | Karte, „Start hier" sogar mit 2-px-Akzentrand | Zeilen einer Checkliste |
| Plan: Kopf (Auswahl, Fortschritt, Speicherhinweis) | Karte | Kopfzeile mit Metadaten, Fortschrittsbalken 2 px |
| Transparenz: drei Live-Karten | drei Karten nebeneinander | eine Inspektionstabelle |

## 2. Konkurrierende Rahmen und Radien

- Vier verschiedene Radien im Einsatz (4, 8, 14, 22 px) plus Pillen (999 px) für Buttons, Chips, Tags, Vertrauens-Badge und Live-Leisten.
- Datenpunkte: Karte (Rahmen) **in** Abschnitt (Trennlinie) **mit** Etiketten (Pillen-Hintergrund) – drei Begrenzungsebenen für einen Satz.
- Sprungnavigation der Dienstseite mit Ober- und Unterkante, darunter sofort Abschnittslinie.

## 3. Dekorative Elemente

- Radiales „Datenmuster" mit neun Sektoren und Ringen in Rost: wirkt wie ein Spiel-Ergebnis, nicht wie ein Messinstrument; Beschriftung klein und kreisförmig verteilt, schwer zu lesen.
- Startseiten-Illustration „7:40 Uhr / Abend-WLAN" (zwei Punkte, zwei Kurven, Ring): illustriert, was der Text schon sagt.
- Simulator-Konstellation mit Zeichen-Animation der Linien.
- Nummernkreise („1", „2", „3", „4") in schwarzen Kreisen vor den Schritten.
- Logo: drei konzentrische Kreise.

## 4. Zu viele Etiketten (Badges)

- Pro Datenpunkt bis zu drei Etiketten: Herkunft („Beobachtet" + Glyphe), Gewissheit („Laut Anbieter"), Bedingung („Nur unter Bedingung"). Bei 12 Datenpunkten ≈ 30 Pillen auf einer Seite.
- „Auf einen Blick" setzt Lebensbereiche, Quellenwege und Zwecke als Chip-Wolken (≈ 25 Pillen).
- Alternativen: Kategorie-Navigation als Pillen.

## 5. Zu viele gleichzeitige Farben

Gleichzeitig sichtbar auf der Startseite mit Auswahl: Indigo (Auswahl, Links, Buttons), Rost (Muster, Zahlen in der Überschrift), Petrol (Vertrauens-Badge, Handlungsfläche, Vertrauenskacheln), Rosé (Abstrich-Hinweis), Grau-Beige (Papier). Fünf Farbrollen für ein Erlebnis, bei dem nur zwei Bedeutung tragen (Auswahl/Interaktion, Intensität).

## 6. Verspielte Icons / Formen

- Häkchen-Kreis im Vertrauens-Badge; Chip-Punkte; Kreis-Glyphen (gefüllt/Ring/halb/gestrichelt) überall; runde Zeitleisten-Knoten mit Zahlen.
- Die Glyphen selbst sind sinnvoll (Gewissheit über Form statt Farbe), werden aber zu oft und zu groß gezeigt.

## 7. Schwache Hierarchie

- Display-Serife in drei Größen konkurriert mit fetten Sans-Zwischentiteln und Eyebrows in Versalien – vier Hierarchie-Signale pro Abschnitt.
- Dienstseite: H1, Lead, vier Karten, Fakt-Karte, Stand-Zeile, „Tiefer einsteigen", Sprungnavigation – bevor der erste Abschnitt beginnt.
- „Frage 1 / Was erfahren sie?" ist doppelt (Eyebrow + H2).

## 8. Wiederholte Erklärtexte

- Herkunfts-Legende steht unter Frage 1, im Simulator, auf der Methodikseite und als Tooltip.
- „Deine Auswahl bleibt in deinem Browser" + Disclaimer „Einordnung … wie viel davon bei dir anfällt …" + Vertrauensabschnitt sagen auf der Startseite dreimal fast dasselbe.
- „Woher wissen wir das?" erscheint je Datenpunkt (≈ 12 × pro Seite).

## 9. Vertikale Abstände

- Abschnitte `padding-block` bis 80 px plus Trennlinie: Startseite auf Desktop 2 255 px hoch bei vier Inhalten.
- Dienstseite Desktop 8 400 px; ein Drittel davon sind Kartenabstände und Abschnittspolster.

## 10. Zu wenig Gruppierung

- Zwecke, Weitergabe, Speicherdauer, Geschäftsmodell stehen als lose Absätze in zwei Spalten ohne gemeinsame Struktur – genau das sind tabellarische Daten (Merkmal → Wert → Quelle).
- Plan-Metadaten (Dienst, Minuten, Wirkung) als Fließtext-Zeile statt als vergleichbare Spalten.

## 11. Generische Consumer-App-Muster

- Pillen-Buttons mit großem Polster, „Kachel-Gitter" für Dienste, Zähler-Kacheln, farbige Hinweisboxen, klebende schwarze Pillen-Leiste („3 Apps · 8 von 9 Lebensbereichen ↓"), animiertes „Einblenden" von Ergebnissen.

## Zusammenfassung der V3-Prinzipien

1. **Karten nur, wo ein Objekt wirklich abgegrenzt ist** (Vertrauens-Panel, Einwilligungsdialog). Sonst: Abschnitte, Haarlinien, Tabellen, Definitionslisten.
2. **Ein Akzent** (Interaktion/Auswahl). Intensität über Graustufen/Deckkraft desselben Akzents; Status (geprüft/ungeprüft) nur als kleine Textmarke.
3. **Radius 3–4 px**, keine Pillen.
4. **Typografie trägt die Hierarchie:** eine Sans-Familie in wenigen Größen; Monospace nur für Metadaten (Datum, Kennungen, Zähler, Quellenart).
5. **Etiketten sparen:** Herkunft als kleine Glyphe mit Text in Mono-Kleinschrift; Gewissheit in die Beleg-Zeile; Bedingungen als Textzusatz.
6. **Bewegung:** nur Zustandswechsel (≤ 120 ms Deckkraft/Farbe), keine Zeichen-/Einblend-Animationen.
