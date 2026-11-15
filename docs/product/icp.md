# ICP – für wen Durchblick zuerst gebaut wird

Stand: 2026-10-15. Zuspitzung der Personas 1 („Unbekümmert") und 2 („Neugierig") aus `personas.md` auf **eine** Person, an der sich Startseite, Texte und Kanäle messen lassen. Anlass: Feedback, die Startseite wirke „sehr voll geladen und relativ unruhig".

> Hinweis zur Evidenz: Arbeitshypothese aus Desk-Research und heuristischem Walkthrough, **nicht** durch eigene Nutzerforschung belegt. Prüfung im nächsten Nutzertest, siehe „Wie wir den ICP prüfen".

## Die Neugierige ohne Vorwissen

| | |
|---|---|
| Alltag | Nutzt täglich 5–10 große Apps (Instagram, WhatsApp, Google, TikTok, Amazon …), fast nur auf dem Handy. |
| Wissen | Hat nie eine Datenschutzerklärung gelesen. Kennt ihre Rechte nach DSGVO nicht und hat sich damit nie beschäftigt. Weiß nur vage: „Die sammeln irgendwas." |
| Gefühl | Diffuses Unbehagen, das ab und zu hochkommt (unheimlich passende Werbung, „hört mein Handy mit?"). Keine Angst, aber auch keine Ruhe. |
| Zeit und Geduld | Gering. Entscheidet in den ersten Sekunden, ob sich das lohnt. |
| Auslöser für den Besuch | Instagram-Post, Link von Freunden, eine Schlagzeile. Neugier, nicht Not. |
| Kernaufgabe (Job-to-be-done) | „Ich will in zwei Minuten verstehen, was meine Apps über mich wissen, und **eine** Sache ändern, die wirklich etwas bringt – ohne mich dumm oder belehrt zu fühlen." |
| Erfolg beim ersten Besuch | Hat **eine** Einstellung geöffnet oder geändert. Alles Weitere ist Bonus. |
| Was abschreckt | Fachbegriffe, Tabellen, Abkürzungen, viele Optionen auf einmal, Moralpredigt, Panikmache, lange Texte, Registrierung. |
| Was wirkt | Ein Schritt nach dem anderen; die eigenen Apps; ein überraschender, belegter Satz; ein großer Knopf, der direkt zur Einstellung führt. |

## Bewusst nicht die Zielgruppe

| Wer | Warum nicht der Maßstab | Wie wir sie trotzdem bedienen |
|---|---|---|
| Fortgeschrittene / Privacy-Fans (Persona 4) | Wichtig als Weiterempfehler, aber ihr Wunsch nach Vollständigkeit macht die Oberfläche für alle anderen zu voll. | Alles auf einer Seite (`/check/`), Methodik, Quellen, Transparenz – eine Ebene tiefer, nicht im Einstieg. |
| Unternehmen, Selbstständige mit DSGVO-Pflichten | Suchen Rechtssicherheit für *ihre* Datenverarbeitung. Durchblick hilft ihnen nicht. | Gar nicht. Deshalb: „DSGVO" nicht in Überschriften, Einstieg oder Kanaltexten. |
| Stark Besorgte (Persona 3) | Sind schon motiviert und finden den Plan selbst. | Mein Plan, Anleitungen, Alternativen. |

## Was daraus für das Produkt folgt

1. **Ein Schritt pro Bildschirm im Einstieg.** Apps wählen → was sie erfahren können → ein Fakt → eine Änderung. Keine Matrix, keine Legende, keine Kennzahlen im ersten Durchlauf.
2. **Die Startseite fragt nur nach Apps, nie nach der Person.** Kein „Wie besorgt bist du?" (siehe `personas.md`: keine Profilbildung durch die Hintertür).
3. **Alltagssprache vor Präzision im ersten Kontakt.** Die Präzision bleibt erhalten, eine Ebene tiefer („Woher wissen wir das?", „Alle Bereiche ansehen").
4. **Wörterliste für den Einstieg**

   | Statt | Lieber |
   |---|---|
   | Datenmuster, Matrix, Lebensbereich | „was deine Apps über dich erfahren können", „Bereiche deines Lebens" |
   | Befund | „Das wissen die wenigsten" |
   | Aufwand / Wirkung / Abstrich | „dauert etwa 3 Minuten", „Das ändert sich", „Das bleibt" |
   | Angaben, dokumentiert | „laut eigener Angabe der Anbieter" |
   | IG, WA, GO … | ausgeschriebene App-Namen |
   | DSGVO, Datenschutz-Grundverordnung | (im Einstieg weglassen) |

5. **Kanal:** Social Media (Konzept nicht öffentlich, D-N22) und Weiterempfehlung. Jeder Post endet in genau einer Handlung, die auf der Startseite wieder auftaucht.

## Wie wir den ICP prüfen

Im nächsten Nutzertest 5 Personen, die auf den ICP passen (Screener: nutzt ≥ 5 der 14 Apps; hat in den letzten 12 Monaten keine Datenschutz-Einstellung bewusst geändert; arbeitet nicht in IT, Recht oder Datenschutz). Beobachten:

- Versteht die Person in ≤ 10 Sekunden, was sie tun soll?
- Erreicht sie Schritt 4 ohne Hilfe?
- Öffnet sie die Einstellung beim Anbieter? (Erfolgskriterium oben)
- Welche Wörter fragt sie nach oder liest sie laut stockend? → Wörterliste ergänzen.

Wenn mehr als 2 von 5 nicht zu Schritt 4 kommen, ist entweder der ICP falsch oder der Einstieg noch zu schwer – beides vor dem Start klären.
