# Designsystem

> **Hinweis (2026-10-07):** Typografie, Farbe, Form und Komponenten wurden mit V3 ersetzt – maßgeblich ist `docs/design/visual-direction-v3.md`. Dieses Dokument beschreibt den V1/V2-Stand und bleibt als Historie erhalten.

Stand: 2026-10-07 · Code: `src/styles/global.css` (Tokens, Basis), `src/styles/ui.css` (Komponenten; früher `components.css`)

## Haltung

Ruhig, vertrauenswürdig, menschlich, technisch präzise. Bewusst **nicht**: Cyber-Neon, Matrix-Grün, Schlösser, Kapuzen-Hacker, Cookie-Banner-Ästhetik, Behörden-Look.

## Metapher: Spuren und Konstellation

Geprüft wurden: Fingerabdruck (abgenutzt, suggeriert Identifizierung statt Ableitung), Schatten (düster, Angst), Radar (Überwachung), Pass (zu formal), Nährwertetikett (gut für Einordnung → als Datenprofil umgesetzt), Netzwerkgraph/Konstellation (zeigt *Verbindung* – den eigentlichen Mechanismus).

Gewählt: **Spuren, die sich zu einer Konstellation verbinden.** Einzelne Punkte sind harmlos; erst die Linien zwischen ihnen ergeben ein Bild. Das Logo (Ring, gestrichelter Ring, Punkt) und der Simulator nutzen dieselbe Sprache.

## Typografie

- **Fraunces** (variabel, optische Größen) für Überschriften: warm, redaktionell, Datenjournalismus statt SaaS.
- **Atkinson Hyperlegible Next** für Text: für Lesbarkeit bei Sehschwäche entworfen.
- Beide selbst gehostet; fließende Größen über `clamp()`.

## Farbe

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--paper` | #f6f4ef | #121117 | Hintergrund (warmes Papier) |
| `--ink` | #17161c | #edebf2 | Text |
| `--accent` | #2f3ba8 | #9aa5ff | Interaktion, Links, Auswahl |
| `--expo` | #b4531f | #d4773c | Datenprofil „Preisgabe", Datenarten-Matrix |
| `--ctrl` | #00806a | #1fa38c | Datenprofil „Kontrolle", Fortschritt, Vertrauens-Hinweise |

`--expo`/`--ctrl` wurden mit dem Palette-Validator (Helligkeitsband, Chroma, CVD-Abstand, Kontrast ≥ 3:1) für beide Modi geprüft. Kein Rot, keine Ampel: Preisgabe ist kein Alarm.

## Gewissheits-Glyphen (Markenzeichen)

Gewissheit wird über **Füllform** kodiert, nie nur über Farbe, immer mit Text:

| Glyphe | Bedeutung |
|---|---|
| ● gefüllt | Angegeben |
| ◉ Punkt mit Ring | Beobachtet |
| ◐ halb gefüllt | Berechnet / direkt ableitbar |
| ○ Ring | Vom Anbieter beschrieben / von Werbeplattformen dokumentiert |
| ◌ gestrichelt | Möglich, nicht belegt |

## Komponenten

Chips (`aria-pressed`), Panels, Disclosure (`<details>`), Datenprofil-Meter (4 Segmente + Wort + „Warum?"), Datenreise (nummerierte Stationen), Matrix (echte `<table>` mit Beschriftung, scrollbar in fokussierbarer Region), Fortschritt (`<progress>`). Mindestgröße Touch-Ziele 44 px. Fokus-Ring 3 px in `--focus`. `prefers-reduced-motion` schaltet Animationen ab; `forced-colors` wird unterstützt.
