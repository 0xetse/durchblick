# Personas – nach Privacy-Reife, nicht nach Demografie

Stand: 2026-10-07. Die Personas beschreiben **Verhaltens- und Wissensstufen**. Dieselbe Person kann je nach Thema in einer anderen Stufe sein (z. B. Messenger: bewusst, KI-Assistenten: ahnungslos). Alter, Geschlecht oder Beruf spielen bewusst keine Rolle.

> Hinweis zur Evidenz: Die Personas sind Arbeitshypothesen aus Desk-Research (Wettbewerbsanalyse, öffentliche Studien zum „Privacy Paradox"). Sie sind **nicht** durch eigene Nutzerforschung validiert. Validierung: über Nutzertests (siehe `docs/product/icp.md`).

## 1. Unbekümmert – „Ich hab doch nichts zu verbergen."

| | |
|---|---|
| Haltung | Datenschutz betrifft andere; Komfort zählt. |
| Wissen | Weiß, dass Werbung „personalisiert" ist; Mechanismen unbekannt. |
| Auslöser für einen Besuch | Link in Social Media, Artikel, Empfehlung von Freunden. Neugier, nicht Sorge. |
| Was abschreckt | Moralpredigt, Fachsprache, lange Texte, Registrierung. |
| Was wirkt | Ein konkreter, persönlich wiedererkennbarer Aha-Moment; Humor ohne Häme. |
| Erfolg | „Ach so funktioniert das." Eine Einstellung angeschaut, ohne sich belehrt zu fühlen. |
| Produktantwort | Signature-Erlebnis „Fünf harmlose Spuren" auf der Startseite; der Begriff „nichts zu verbergen" wird nicht widerlegt, sondern umgedeutet: Es geht nicht um Geheimnisse, sondern darum, wer Schlüsse über dich zieht. |

## 2. Neugierig – „Ich weiß, dass die Daten sammeln, aber nicht, was genau."

| | |
|---|---|
| Haltung | Diffuses Unbehagen, keine Zeit für Recherche. |
| Wissen | Kennt Begriffe (Cookies, Tracking), nicht die Zusammenhänge. |
| Auslöser | Nachricht über ein Datenleck, neue KI-Funktion, Gespräch. |
| Was abschreckt | Panikmache, Pauschalurteile, „Lösch alles". |
| Was wirkt | Übersicht über die *eigenen* Dienste, klare Kennzeichnung von Gewissheit, kurze Wege zu Einstellungen. |
| Erfolg | Versteht die eigenen 3–5 wichtigsten Dienste; setzt 2–3 schnelle Maßnahmen um. |
| Produktantwort | Fußabdruck-Check → persönliche Übersicht → „5 Minuten"-Maßnahmen. |

## 3. Besorgt – „Ich will das jetzt wirklich angehen."

| | |
|---|---|
| Haltung | Motiviert, aber überfordert von widersprüchlichen Ratgebern. |
| Wissen | Hat schon Einstellungen geändert, unsicher, ob es etwas bringt. |
| Auslöser | Konkretes Erlebnis (unheimlich passende Werbung, Kontoübernahme, Kinder bekommen erstes Smartphone). |
| Was abschreckt | Unklare Wirkung („Was bringt das eigentlich?"), veraltete Anleitungen. |
| Was wirkt | „Was ändert sich – und was nicht", Prüfdatum, Fortschritt, Priorisierung nach Wirkung. |
| Erfolg | Hat einen Plan abgearbeitet und weiß, was offen ist und warum. |
| Produktantwort | Mein Plan mit Zeitstufen, lokaler Fortschritt, ehrliche Grenzen jeder Maßnahme, Alternativen mit Abwägungen. |

## 4. Fortgeschritten – „Ich nutze Signal und Firefox, aber was ist mit dem Rest?"

| | |
|---|---|
| Haltung | Skeptisch gegenüber jeder Website – auch dieser. |
| Wissen | Hoch; prüft Netzwerkanfragen selbst. |
| Auslöser | Sucht Quellen, Vergleiche, will Nicht-Experten im Umfeld etwas Verlässliches empfehlen. |
| Was abschreckt | Ungenauigkeit, Übertreibung, Tracker auf einer Datenschutzseite, versteckte Affiliate-Links. |
| Was wirkt | Methodik, Primärquellen, Gewissheitsstufen, nachprüfbare Architektur, offener Code. |
| Erfolg | Vertraut der Seite genug, um sie weiterzuempfehlen („Die ist sauber und belegt"). |
| Produktantwort | Transparenzansicht, Methodik-Seite, Quellenangaben pro Aussage, Datenprofil-Rubrik. **Wichtig: Diese Persona ist Multiplikator, nicht Hauptzielgruppe.** |

## Konsequenzen für das Produkt

- **Primärzielgruppe des MVP sind 2 und 3.** 1 wird über den Einstieg erreicht, 4 über Glaubwürdigkeit.
- Jede Ansicht muss für 1 in einem Satz und für 4 bis zur Quelle funktionieren → fortschreitende Tiefe als Grundmuster.
- Kein Selbsteinstufungs-Quiz („Welcher Typ bist du?") – das wäre Profilbildung durch die Hintertür und für Nutzer wertlos.
