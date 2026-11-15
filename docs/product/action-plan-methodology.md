# Methodik: Mein Plan (V2)

Stand: 2026-10-07 · Code: `src/domain/priority.ts` (getestet in `tests/unit/v2.test.ts`) · in Kurzform auf `/plan/` sichtbar.

## Ziel

Besorgte, aber überforderte Menschen sollen mit **drei** Schritten anfangen können, die viel bringen, wenig kosten und auf nichts verzichten lassen. Alles andere kommt danach oder ist ausdrücklich optional.

## Stufen

| Stufe | Inhalt | Regel |
|---|---|---|
| **Start hier** | bis zu 3 Schritte | höchste Priorität; keine Komfort-Abstriche; nicht „kleine Wirkung"; möglichst jede gewählte App höchstens einmal |
| **Danach** | übrige Schritte ohne Abstriche | nach Priorität |
| **Optional – mit Abstrichen** | Schritte mit `tradeOff` (z. B. Verlauf pausieren → keine Empfehlungen), Datenexport, Konto löschen | nach Priorität; Abstrich wird beim Schritt genannt |

Ohne App-Auswahl zeigt der Plan nur einen Startsatz aus allen Apps und fordert zur Auswahl auf.

## Priorität

`Priorität = Wirkung × 4 + Aufwand + Gewissheit`

| Faktor | Werte | Begründung |
|---|---|---|
| Wirkung | groß 3 · mittel 2 · klein 1 | redaktionelle Einschätzung, wie viel Informationsfluss der Schritt stoppt oder begrenzt; pro Schritt begründet („Warum das wichtig ist", „Was sich ändert", „Was sich nicht ändert") |
| Aufwand | ≤ 5 Min: 2 · ≤ 15 Min: 1 · länger: 0 | schnelle Erfolge zuerst |
| Gewissheit | Schritte an offizieller Hilfe geprüft: 1 · sonst 0 | geprüfte Anleitungen funktionieren eher |

Der Faktor 4 sorgt dafür, dass Wirkung immer Vorrang hat: Aufwand und Gewissheit entscheiden nur innerhalb derselben Wirkungsstufe (Test: „ranks impact over effort over verification").

## Was wir bewusst nicht tun

- **Keine Prozentzahlen** („Risiko um 40 % gesenkt"). Es gibt kein belastbares Modell, das Einstellungen in Risikoreduktion umrechnet.
- **Keine Punkte, Level, Streaks.** Fortschritt heißt „1 von 3 ersten Schritten erledigt" und nennt, bei welchen Apps Einstellungen angepasst wurden.
- **Keine Gesamtnote**, die nach Erledigung „steigt" – das würde falsche Sicherheit erzeugen, weil viele Datenflüsse durch keine Einstellung abschaltbar sind.

## Bekannte Grenzen

- „Wirkung" ist eine begründete, aber subjektive Einordnung. Sie wird im Nutzertest und bei Inhalts-Reviews überprüft.
- Nicht geprüfte Anleitungen können in „Start hier" landen, wenn ihre Wirkung hoch ist; sie tragen dann den sichtbaren Hinweis „Schritte noch nicht geprüft" und verlinken die offizielle Einstellung.
