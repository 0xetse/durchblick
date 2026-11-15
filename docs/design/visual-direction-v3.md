# Visuelle Richtung V3

Stand: 2026-10-07 · Grundlage: `docs/reviews/ui-density-audit.md` · Ersetzt die Abschnitte Typografie/Farbe/Form in `docs/architecture/design-system.md`.

Ziel: **ein modernes Recherche-Werkzeug für mündige Verbraucher** – technisch, präzise, ruhig, zurückhaltend; verständlich für Menschen ohne Fachwissen. Nicht: Hacker-Ästhetik, Terminal, Neon, Matrix, Behörde, SaaS-Dashboard.

## Drei Richtungen

### A · Editorial Technical

| | |
|---|---|
| Typografie | Text-Serife für Fließtext (z. B. Source Serif), Sans für UI, Mono selten |
| Abstände | großzügig, lange Lesespalte (65 ch), viel Weißraum |
| Flächen | Papierweiß, keine Karten, Haarlinien |
| Farbe | Schwarz/Grau + ein tiefes Rot oder Blau als Akzent |
| Komponenten | Fußnoten, Randnotizen, nummerierte Abschnitte |
| Diagramme | statische Infografik im Stil von Datenjournalismus |
| Ton | „Bericht einer Redaktion" |

Stärke: sehr glaubwürdig, ruhig. Schwäche: interaktive Teile (Auswahl, Plan) wirken darin wie Fremdkörper; zu viel Lesestoff für die 2-Minuten-Erfahrung; nahe an V1-„Lexikon".

### B · Research Instrument

| | |
|---|---|
| Typografie | eine präzise Grotesk (IBM Plex Sans) für alles; IBM Plex Mono klein für Metadaten, Zähler, Kennungen, Quellenart, Datum |
| Abstände | dichter in Datenbereichen (Zeilen 40–48 px), Luft zwischen Abschnitten; 4-px-Raster |
| Flächen | neutrales Weiß/Grau, Haarlinien, Tabellen; Panels nur für echte Objekte (Inspektions-Panel, Dialog); Radius 4 px |
| Farbe | Neutrale + **ein** Akzent (tiefes Blau) für Interaktion und Intensität; Status (geprüft/ungeprüft) als kleine Textmarke |
| Komponenten | Matrix, Kennwert-Listen (Schlüssel → Wert), Checkliste mit Spalten, Zitationszeilen, Abschnittsnummern `01 02 03` |
| Diagramme | analytische Matrix/Heatmap statt radialer Grafik; Datenreise als nummerierte Pipeline |
| Ton | „Ich untersuche ein System" – sachlich, aber nicht kalt |

Stärke: passt zum Kern (belegte, strukturierte Daten), trägt die interaktiven Teile natürlich, macht Präzision sichtbar. Schwäche: Gefahr, zu kühl/abweisend zu werden → Gegenmittel: Alltagssprache in Überschriften, warmes Off-White, keine Versal-Wüsten.

### C · Developer Tool Lite

| | |
|---|---|
| Typografie | Inter + JetBrains Mono, Mono deutlich häufiger (Labels, Navigation) |
| Abstände | kompakt, viele kleine Elemente |
| Flächen | Seitenleisten, Tabs, Kopfleisten, dunkle Variante als Standard |
| Farbe | Grau-Skala + Grün/Blau-Statusfarben |
| Komponenten | Tabs, Badges, Konsolen-artige Panels, Tastaturkürzel |
| Diagramme | Graph-Ansicht, Log-artige Listen |
| Ton | „Werkzeug für Entwickler" |

Stärke: sehr technisch. Schwäche: grenzt Nicht-Experten aus; kippt leicht in Terminal-Ästhetik; widerspricht dem Ziel „verständlich für normale Menschen".

## Entscheidung: **B · Research Instrument**, mit zwei Anleihen aus A

- Aus **A**: großzügige Lesespalte und Alltagssprache für erklärende Absätze (Fakt, Lead), damit es nicht kalt wird.
- Aus **C** nichts außer der disziplinierten Verwendung von Mono für Metadaten.

Begründung: B ist die einzige Richtung, in der *alle* Kernflächen – Auswahl, Muster, Dienstbrief, Plan, Vertrauens-Panel, Quellen – dieselbe Sprache sprechen: strukturierte Daten, sauber ausgerichtet, belegt. A und C lösen jeweils nur einen Teil.

## Spezifikation

### Typografie

| Rolle | Schrift | Größe (mobil → Desktop) | Gewicht |
|---|---|---|---|
| H1 | IBM Plex Sans | 30 → 44 px, Laufweite −1 % | 600 |
| H2 | IBM Plex Sans | 22 → 28 px | 600 |
| H3 | IBM Plex Sans | 17 → 18 px | 600 |
| Text | IBM Plex Sans | 16 → 17 px, Zeilenhöhe 1.55 | 400 |
| Klein | IBM Plex Sans | 14 px | 400 |
| Meta / Labels | IBM Plex Mono | 12 px, Versalien nur für Spaltenköpfe, Laufweite +4 % | 400–500 |

Mono nie für Absätze. Keine Display-Serife mehr.

### Farbe (hell / dunkel)

| Token | Hell | Dunkel | Rolle |
|---|---|---|---|
| `--bg` | #f7f7f5 | #101214 | Seite |
| `--surface` | #ffffff | #171a1d | Panels, Tabellenköpfe |
| `--ink` | #121417 | #e9ebee | Text |
| `--ink-2` | #3c424a | #c3c8cf | Sekundärtext |
| `--muted` | #5d646d | #9aa1ab | Metadaten |
| `--line` | #e2e4e7 | #2a2e33 | Haarlinien |
| `--line-strong` | #c4c8cd | #3d434a | Rahmen von Eingaben |
| `--accent` | #2343c4 | #8ea6ff | Interaktion, Auswahl, Intensität |
| `--accent-weak` | #e9edfb | #1c2447 | ausgewählte Zustände |
| `--ok` | #1d6b4a | #6fcf9f | nur Status „geprüft / 0 Tracker" (Text, kleine Marke) |
| `--warn` | #8a5a00 | #e0b65a | nur Status „ungeprüft / Abstrich" (Text, kleine Marke) |

Intensität im Muster: Akzent in drei Deckkraftstufen (0.25 / 0.55 / 1.0) plus Text – nie Regenbogen.

### Form

Radius 4 px für Panels/Eingaben, 2 px für Marken; keine Pillen; Rahmen 1 px; Schatten nur beim schwebenden Panel (Vertrauens-Panel).

### Raster und Abstand

4-px-Basis; Inhaltsbreite 1120 px; Lesespalte 68 ch; Abschnittsabstand 48–72 px; Datenzeilen 44 px Mindesthöhe (Touch).

### Komponenten

- **Abschnittskopf:** Mono-Nummer `01` + H2, Haarlinie darüber.
- **Kennwert-Liste:** zweispaltig, Schlüssel in Mono-Klein, Wert in Sans; Haarlinien zwischen Zeilen.
- **Zitationszeile:** `QUELLENART` (Mono) · Herausgeber – Titel ↗ · geprüft JJJJ-MM-TT.
- **Checkliste:** Status-Kästchen · Titel · Spalten Wirkung / Aufwand / Abstrich.
- **Matrix:** Zeilen = Lebensbereiche, Spalten = gewählte Apps (Mono-Kürzel), Zellen = Quadrate in drei Intensitäten.
- **Toggle-Liste (App-Auswahl):** quadratisches Kontrollkästchen, Name, Mono-Kürzel; 2 Spalten.

### Diagramme

Das radiale Muster entfällt. Das **Datenmuster** wird eine Matrix (Lebensbereich × App) mit Zeilensummen – ein analytisches Instrument, lesbar als Tabelle, ohne Farbe-als-Information-allein.

### Bewegung

Nur Farb-/Deckkraftwechsel ≤ 120 ms bei Zustandswechseln. Keine Zeichen-, Einblend- oder Wachstums-Animationen. `prefers-reduced-motion` schaltet auch diese ab.

### Ikonografie

Logo: 3 × 3-Raster aus Quadraten, vier davon gefüllt (verweist auf die Matrix). Sonst nur: ↗ (extern), ↓/→ (Richtung), Kontrollkästchen, Herkunfts-Glyphen (klein, 10 px). Keine Häkchen-Kreise, keine Nummernkreise.

### Tonalität-Schutz („nicht zu kalt")

- Überschriften bleiben Alltagssprache („Was lernen deine Apps über dich?").
- Warmes Off-White statt reinem Weiß als Seitenhintergrund.
- Erklärende Absätze in normaler Lesegröße, nicht in Mono.
- Keine Versal-Überschriften, nur Versal-Spaltenköpfe in Mono-Klein.

## Umsetzung (2026-10-07)

| Fläche | Vorher (V2) | Jetzt (V3) |
|---|---|---|
| Startseite | Muster + Illustration + 4 Vertrauenskacheln + 8 Dienstkacheln | H1, ein Satz, Auswahl; darunter drei schlichte Abschnitte (Warum, Wie wir arbeiten als Kennwert-Liste, Index) |
| Datenmuster | radiales Sektor-Diagramm, Ringe in Rost, schwarze Pillen-Leiste | Matrix Lebensbereich × App (Mono-Kürzel), 3 Intensitätsstufen eines Akzents, Zeilensumme, aufklappbare Zeilen mit Belegdaten |
| Befund / Maßnahme | Karte mit Schatten, Petrol-Fläche | Abschnitte mit Haarlinie; Maßnahme mit Kennwerten Aufwand · Wirkung · Abstrich |
| Dienstseite | Kartenraster, Chip-Wolken, Badges je Datenpunkt | Brief: Metadatenzeile, Kurzbefund als Spezifikationstabelle, Befund mit Akzentlinie, nummerierte Abschnitte 01–05, Datenpunkte als Zeilen nach Lebensbereich |
| Quellen | Linkliste mit Fließtext-Metadaten | Zitationszeilen: Quellenart (Mono) · Herausgeber – Titel ↗ · Stufe · Abrufdatum |
| Plan | Karten, Akzentrahmen | Checkliste P1/P2/P3 mit Spalten Dienst · Wirkung · Minuten · Abstrich · geprüft/ungeprüft |
| Vertrauens-Panel | Petrol-Pille, Freitextliste | Inspektionstabelle (Konto, Cookies, Tracker-Skripte, Netzwerkziele, lokaler Speicher, Auswahl), Messmethode genannt |
| Navigation | runde Hover-Flächen | Textlinks, Unterstreichung der aktiven Seite, Raster-Logo |
| Bewegung | Linien-Zeichnen, Einblenden, Wachstum | nur Farb-/Deckkraftwechsel ≤ 120 ms |

Nicht geändert: Inhalte, Content-Modell, Priorisierungslogik, Datenfluss, Nutzerreise (Auswahl → Muster → Befund → Maßnahme → Plan).

## Qualitätsprüfung nach Umsetzung

| Frage | Einschätzung | Rest-Risiko / Gegenmaßnahme |
|---|---|---|
| Noch zu verspielt? | Nein. Keine Pillen, keine Kreise außer Herkunfts-Glyphen, keine Animationen, kein Farbfeuerwerk. | Spuren-Konstellation bleibt die verspielteste Fläche – bewusst als „Experiment" gekennzeichnet. |
| Glaubwürdig? | Deutlich: Metadaten (Stand, Zahl der Angaben und Quellen), Zitationszeilen und Prüfstatus sind auf jeder Kernfläche sichtbar. | – |
| Ruhiger? | Ja: ein Akzent, Haarlinien, keine Schatten außer am schwebenden Panel. Startseite von 4 konkurrierenden Blöcken auf 1 Interaktion reduziert. | – |
| Leichter zu überfliegen? | Ja: Dienstseite hat Kurzbefund + nummerierte Abschnitte; Plan zeigt vergleichbare Spalten. Dienstseite Desktop ≈ 25 % kürzer. | Datenpunkte nach Lebensbereich gruppiert: im Nutzertest prüfen, ob die Gruppen verstanden werden. |
| Stärkere Hierarchie? | Ja: eine Schriftfamilie, klare Größenstufen, Mono nur für Metadaten. | – |
| Ernsthaftes technisches Produkt? | Ja – „Recherche-Werkzeug", nicht „Terminal": Mono bleibt klein und sparsam, Fließtext in Plex Sans. | – |
| Für Nicht-Experten verständlich? | Überschriften und Erklärsätze bleiben Alltagssprache; Matrix hat Legende und Textalternative; Bereiche sind Fragen („Wo du bist"). | **Hypothese für den Nutzertest:** Werden Matrix und Mono-Kürzel (IG, GO …) ohne Erklärung verstanden? |
| Zu kalt / einschüchternd? | Teilweise möglich: Versal-Labels in Mono und Tabellen wirken sachlich. Abgefedert durch warmes Off-White, großzügige Lesespalte, du-Ansprache. | Im Test auf Aussagen wie „wirkt kompliziert/technisch" achten (→ Triage Kategorie 2/3). |

Automatisch geprüft: Lint, Typen, 76 Unit-/Content-Tests, 99 Browser-Tests (u. a. axe WCAG 2.2 AA hell/dunkel, keine Drittverbindungen, kein horizontales Scrollen) – grün.
