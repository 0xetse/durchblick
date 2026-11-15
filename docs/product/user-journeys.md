# User Journeys

Stand: 2026-10-07. Routen beziehen sich auf `information-architecture.md`.

## J1 – Erster Besuch (mobil, über einen geteilten Link)

1. **Start `/`** – Überschrift: „Was erfahren Apps eigentlich über dich?" Darunter sofort das Mini-Experiment „Fünf harmlose Spuren": drei bis fünf Alltagsverhalten antippen.
2. Mit jedem Tipp verdichtet sich eine Einschätzung („Wahrscheinlich: zieht bald um"), jeweils mit Gewissheitsetikett (*abgeleitet* / *von Plattformen dokumentiert* / *möglich*). → **Überraschung, ohne Angst**.
3. Ein Satz Einordnung + Beleg: „Werbeplattformen dokumentieren solche Zielgruppen selbst – z. B. ‚Umzug' als Lebensereignis." → **Glaubwürdigkeit**.
4. Zwei Wege weiter: „Welche Dienste nutzt du?" (Fußabdruck) oder „Was kann ich tun?" (Plan mit allgemeinen Schnellmaßnahmen).
5. Vertrauens-Hinweis in der Kopfzeile: „Diese Seite: keine Cookies, keine Tracker – prüf es nach" → `/transparenz`.

Ziel: Erfolgskriterium (Produktvision) in ~2 Minuten.

## J2 – „Datenschutz ist mir egal."

- Einstieg wie J1. Keine Gegenargumente, keine Moral. Das Experiment zeigt: Es geht nicht um Geheimnisse, sondern um **Schlussfolgerungen**, die andere über dich ziehen – und die du nicht siehst.
- Angebot statt Aufforderung: „Willst du sehen, was Google glaubt, das dich interessiert? Das zeigt Google dir selbst." → Anleitung „Mein Werbecenter ansehen" (eine Minute, reine Neugier).
- Ausstieg ist okay. Kein Pop-up, kein Newsletter, kein „Bist du sicher?".

## J3 – „Ich weiß, dass gesammelt wird, verstehe es aber nicht."

1. `/check` – Dienste antippen (Logos + Namen, nach Bereichen gruppiert, Suche).
2. Ergebnis **Mein Fußabdruck** (gleiche Seite, kein Laden): Anzahl Dienste, Datenarten (als Raster, nicht als Score), Querverbindungen („3 deiner Dienste gehören zu Meta und lassen sich im Kontencenter verknüpfen"), größte Hebel.
3. Klarer Hinweis oben: „Das ist eine Einordnung auf Basis deiner Auswahl. Wir haben nichts über dich herausgefunden – und nichts gespeichert."
4. Tipp auf einen Dienst → Dienstseite mit den vier Leitfragen.

## J4 – „Ich will meine Privatsphäre verbessern."

1. Aus dem Fußabdruck: „Plan erstellen" → `/plan`.
2. Maßnahmen nach Zeit gruppiert: **5 Minuten · 30 Minuten · 1 Stunde · Weitergehend**, innerhalb nach Wirkung sortiert.
3. Jede Maßnahme aufklappbar: Warum · Was sich ändert · **Was sich nicht ändert** · Schritte (falls geprüft) · „Offizielle Einstellung öffnen" · Prüfdatum · „Erledigt".
4. Beim ersten „Erledigt": einmalige Frage „Fortschritt auf diesem Gerät merken?" (Ja / Nein, nur für diese Sitzung). Kein Konto.
5. Fortschrittsanzeige: „4 von 11 Maßnahmen erledigt" + was das konkret bedeutet („Personalisierte Werbung bei 2 Diensten eingeschränkt"). Keine Punkte.

## J5 – „Ich will weg von Google/Meta."

1. Dienstseite Google → Abschnitt „Alternativen" oder direkt `/alternativen`.
2. Pro Kategorie zuerst: **„Was du ohne Wechsel erreichst"** (ehrlich: viel lässt sich über Einstellungen begrenzen).
3. Dann Alternativen mit Abwägungen (Datenschutz, Funktionen, Preis, Bequemlichkeit, Ökosystem, Geschäftsmodell, Open Source, Verschlüsselung, Sitz, Wechselaufwand).
4. Vor dem Wechsel: Anleitung „Daten exportieren" und „Konto löschen" des alten Dienstes (im Plan unter *Weitergehend*).

## J6 – „Ich will einen bestimmten Dienst verstehen." (Suchmaschine: „Welche Daten sammelt Instagram?")

1. Landet direkt auf `/dienste/instagram/` (statisch, schnell, ohne JavaScript lesbar).
2. Oben: Ein-Satz-Antwort + „Wusstest du?"-Fakt mit Quelle.
3. Vier Abschnitte in fester Reihenfolge: **Was erfährt Instagram? · Wie? (Datenreise) · Was bedeutet das? (Ableitungen, Zwecke, Weitergabe, Speicherdauer, Datenprofil) · Was kannst du tun?**
4. Sprungnavigation; jede Aussage mit Herkunft/Gewissheit; Quellenliste mit Abrufdatum.

## J7 – „Ich will die schnellsten Verbesserungen."

- Startseite → „Schnell etwas tun" → `/plan` ohne Auswahl zeigt die wirksamsten 5-Minuten-Maßnahmen über die häufigsten Dienste; Hinweis: „Wähle deine Dienste, um den Plan anzupassen."

## J8 – Skeptische Fortgeschrittene

- Kopfzeile → `/transparenz`: Live-Liste aller Netzwerkanfragen dieser Seite (alle an die eigene Domain), gespeicherte Daten (anfangs: keine), Cookies (keine), Export/Löschen.
- `/methodik`: Quellenhierarchie, Gewissheitsstufen, Datenprofil-Rubrik, Prüfrhythmus, bekannte Grenzen.

## Querschnitt: Fehlerfälle

- JavaScript aus: Dienst-, Methodik-, Alternativen- und Anleitungsseiten voll lesbar; interaktive Teile zeigen eine statische Fassung (Liste statt Simulation).
- Offline (PWA): bereits besuchte Seiten verfügbar; Hinweis bei nicht zwischengespeicherten Seiten.
- Veraltete Anleitung: sichtbares Etikett „Noch nicht geprüft" bzw. Prüfdatum älter als 6 Monate → „Möglicherweise veraltet".
