# Triage-Regeln: Was folgt aus welchem Befund?

**Grundsatz:** Während der Testrunde bleibt das Produkt gleich, damit alle Sitzungen vergleichbar sind. Einzige Ausnahme ist Kategorie 1. Alles andere wird gesammelt und **erst nach allen Sitzungen** entschieden.

Zählweise: „n von N" = Anzahl der Personen mit diesem Befund von allen getesteten Personen. Ein Befund zählt pro Person nur einmal.

## 1 · Sofort-Fehlerbehebung (auch während der Testrunde)

**Auslöser – schon bei 1 Person:**

- Etwas funktioniert nicht: Seite lädt nicht, Knopf reagiert nicht, Inhalt fehlt, Layout bricht (Text abgeschnitten, nicht scrollbar).
- Eine Tatsachenaussage ist **falsch** oder veraltet (nachweisbar, z. B. Einstellung heißt anders, Link führt ins Leere).
- Die Seite bricht ihr eigenes Versprechen: Speicherung ohne Zustimmung, Verbindung zu fremden Servern, Cookie.
- Barriere, die eine Aufgabe unmöglich macht (z. B. Element mit Daumen nicht erreichbar).

**Vorgehen:** beheben, alle Tests laufen lassen (`npm run verify`), als neuen Teststand mit Commit in der Build-Anleitung eintragen, im Beobachtungsbogen ab der nächsten Sitzung vermerken. **Kein** Umformulieren oder Umgestalten „bei der Gelegenheit".

## 2 · Textänderung (nach der Testrunde)

**Auslöser:**

- Ein Wort oder Satz wird von **≥ 2 Personen** nicht verstanden oder falsch verstanden, **oder**
- **1 Person** versteht eine Aussage so, dass ein gefährliches Missverständnis entsteht – insbesondere: glaubt, ihr Konto/Handy sei gescannt worden (H5), oder hält eine Möglichkeit für eine Tatsache.

**Vorgehen:** neue Formulierung, gegen Jargon-Regeln prüfen, in der nächsten Runde gezielt prüfen.

## 3 · UX-Umbau (nach der Testrunde, erst nach allen Sitzungen)

**Auslöser – eines davon:**

- Eine Hypothese ist nach den Schwellen in `test-plan.md` **widerlegt**.
- Dieselbe Aufgabe scheitert (✗) bei **≥ 3 Personen** an derselben Stelle.
- **≥ 3 Personen** übersehen ein zentrales Element (z. B. Ergebnis unter den Kacheln, Panel „Keine Tracker", „Start hier").

**Vorgehen:** Problem beschreiben (nicht Lösung), 2–3 Lösungsvarianten skizzieren, Entscheidung ins `DECISION_LOG.md`, danach erneuter kurzer Test (3–5 Personen) **nur** für den umgebauten Teil.

**Nie** nach 1–2 Sitzungen umbauen, auch wenn ein Befund deutlich wirkt.

## 4 · Noch nichts tun (sammeln)

**Auslöser:**

- Einzelne Vorliebe oder Geschmack („Ich mag die Farbe nicht"), wenn nicht ≥ 3 Personen dasselbe sagen.
- Funktionswünsche („Kann man das mit meinem Konto verbinden?") – das Produkt ist eingefroren; Wünsche kommen in eine Liste, nicht ins Produkt.
- Widersprüchliche Befunde (2 finden es zu lang, 2 zu kurz).
- Befunde, die eindeutig an der Testsituation liegen (z. B. fremdes Handy, Moderationsfehler).

**Vorgehen:** in der Auswertung aufführen, mit Anzahl. Bei der nächsten Testrunde gezielt beobachten.

## Entscheidungshilfe

```
Funktioniert etwas nicht, ist etwas falsch oder bricht das Datenversprechen?
  └─ ja → 1 Sofort-Fix
Wird ein Wort/Satz missverstanden (≥ 2) oder entsteht ein gefährliches Missverständnis (≥ 1)?
  └─ ja → 2 Textänderung
Ist eine Hypothese widerlegt oder scheitern ≥ 3 an derselben Stelle?
  └─ ja → 3 UX-Umbau (nach allen Sitzungen)
Sonst → 4 sammeln
```

## Was wir ausdrücklich nicht tun

- Keine Änderungen auf Basis vermuteter Reaktionen oder einzelner Meinungen.
- Keine neuen Funktionen als Antwort auf Testbefunde, bevor das Kernerlebnis bestätigt ist.
- Keine Erfolgsmeldung, wenn eine Hypothese nur „offen" ist.
