# Testpaket: Testrunde 2 (Version 0.5.1)

**Produktstand eingefroren.** Bis echte Beobachtungen vorliegen, gibt es keine neuen Funktionen und keine Umgestaltung. Erlaubt sind nur Sofort-Fehlerbehebungen nach `triage-rules.md`.

| Datei | Wofür | Wann |
|---|---|---|
| Build-Anleitung | Welcher Stand getestet wird, wie du ihn startest (lokal: `npm run build`, dann `npm run preview -- --host`), Checkliste vor jeder Sitzung. Testlink und Einladungen werden nicht veröffentlicht. | vorher |
| [`test-plan.md`](test-plan.md) | Ziel, 8 Hypothesen, Teilnehmende, Ablauf in 30 Minuten | einmal lesen |
| [`moderator-sheet.md`](moderator-sheet.md) | **Eine Seite**, während der Sitzung offen | während |
| [`observation-template.md`](observation-template.md) | Ein Bogen pro Person (kopieren nach `sessions/P1.md` …) | während / direkt danach |
| [`klick-checklisten.md`](klick-checklisten.md) | Die 10 noch nicht geprüften Anleitungen in einem echten Konto bestätigen (je ca. 10 Min.) | unabhängig vom Test, mit deutschem Konto |
| [`triage-rules.md`](triage-rules.md) | Welcher Befund führt zu was: Sofort-Fix, Textänderung, UX-Umbau, noch nichts | nach jeder Sitzung und nach allen |

**Reihenfolge:** Build starten → Sitzung mit `moderator-sheet.md` führen, `observation-template.md` ausfüllen → nach der Sitzung Befunde nach `triage-rules.md` einordnen → nach allen Sitzungen Auswertung.

Ausgefüllte Bögen gehören **nicht** ins Repository, solange sie Zitate oder Angaben enthalten, die Personen erkennbar machen. Ablage: `docs/user-test/sessions/P1.md` … – dieser Ordner ist per `.gitignore` ausgeschlossen. Ins Repository kommt nur die zusammengefasste Auswertung (`findings-<Datum>.md`).
