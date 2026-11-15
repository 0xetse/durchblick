# Produktvision – Durchblick

Stand: 2026-10-07 · Arbeitstitel „Durchblick" (Name nicht final, siehe `docs/DECISIONS_NEEDED.md`)

## Problem

Fast alle wissen, dass Dienste „Daten sammeln". Kaum jemand weiß, **welche**, **wie**, **was daraus folgt** und **was man konkret tun kann**. Die vorhandenen Informationsquellen sind entweder

- **juristisch** (Datenschutzerklärungen, DSGVO-Artikel) – korrekt, aber unlesbar,
- **alarmistisch** („Big Tech weiß alles") – erzeugt Ohnmacht statt Handlung,
- **technisch** (Privacy-Guides für Fortgeschrittene) – setzen Wissen voraus, das die Mehrheit nicht hat,
- **fragmentiert** (Einstellungen in 15 Menüs, jede Plattform anders, ständig verschoben).

Ergebnis: Resignation („Die wissen eh alles") – das sogenannte *Privacy Paradox* ist zu einem großen Teil eine Verständnis- und Aufwandslücke, keine Gleichgültigkeit.

## Nutzer

Primär: **Erwachsene in Deutschland, intelligent, ohne Fachwissen**, die täglich 5–15 große Dienste nutzen und nicht vorhaben, ihr digitales Leben umzukrempeln. Details und Reifegrade: `personas.md`.

## Jobs-to-be-done

1. *Wenn ich einen Dienst nutze, will ich in zwei Minuten verstehen, was er über mich mitbekommt, damit ich entscheiden kann, ob mich das stört.*
2. *Wenn ich ein ungutes Gefühl habe, will ich wissen, welche drei Dinge sich wirklich lohnen, damit ich nicht einen Nachmittag in Menüs verliere.*
3. *Wenn ich eine Einstellung ändere, will ich wissen, was sich dadurch ändert – und was nicht –, damit ich keine falsche Sicherheit habe.*
4. *Wenn ich über einen Wechsel nachdenke, will ich ehrliche Abwägungen sehen, nicht Werbung für Alternativen.*
5. *Wenn mir jemand eine Datenschutz-Website empfiehlt, will ich erkennen können, dass sie selbst nichts über mich sammelt.*

## Wertversprechen

> **Was lernen deine Apps über dich?** Tippe an, was du nutzt – du siehst in zwei Minuten, welche Bereiche deines Lebens deine Apps berühren können, einen belegten Fakt, den die wenigsten kennen, und was du sofort ändern kannst. Ohne Konto, ohne Tracking, mit Quellen.
>
> *(V2-Formulierung; Herleitung und verworfene Varianten: `v2-direction.md`)*

Die vier Leitfragen strukturieren jede Ansicht:

1. **Was erfahren sie?**
2. **Wie erfahren sie es?**
3. **Was bedeutet das?**
4. **Was kannst du tun?**

## Positionierung

| Gegenüber | Durchblick ist … |
|---|---|
| Datenschutzerklärungen | übersetzt und strukturiert, mit Quellen-Link zur Originalstelle |
| Verbraucherschutz-Ratgeber | interaktiv, persönlich relevant, aktuell gehalten (Prüfdatum je Anleitung) |
| Privacy-Guides für Profis | einsteigerfreundlich, ohne „Wechsle sofort alles" |
| Plattform-eigene Privacy-Checkups | neutral und dienstübergreifend; zeigt auch, was die Einstellung *nicht* ändert |
| Datenbroker-Löschdienste | kein Abo, kein Upload persönlicher Daten, EU-Fokus |

Die genaue Wettbewerbsanalyse steht in `docs/research/competitive-analysis.md`, die Lücken in `docs/research/opportunity-map.md`.

## Produktprinzipien

1. **Verstehen vor Bewerten.** Erst Mechanismus, dann Einordnung, nie umgekehrt.
2. **Belegt oder gekennzeichnet.** Jede Aussage trägt Herkunft (angegeben / beobachtet / abgeleitet) und Gewissheit (laut Anbieter / technisch zwangsläufig / Forschung / mögliche Schlussfolgerung). Spekulation wird nie als Tatsache dargestellt.
3. **Ruhig statt Angst.** Gefühlsbogen: Neugier → Wiedererkennen → Überraschung → Verstehen → Kontrolle → Verbesserung. Keine roten Alarmfarben, kein Countdown, keine Schuld.
4. **Handlung schlägt Information.** Jede Erkenntnis endet in einer konkreten, ehrlich beschriebenen Option.
5. **Wir leben, was wir sagen.** Kein Konto, keine Cookies, keine Drittanbieter, keine Tracker; alles Persönliche bleibt im Browser – nachprüfbar in der Transparenzansicht.
6. **Neutral.** Kein „Google = böse". Keine Provisionen, keine Affiliate-Links, keine Rangliste der „schlimmsten" Dienste.
7. **Fortschreitende Tiefe.** Ein Satz → Beispiele → Technik → Quelle. Niemand muss tiefer, alle können.
8. **Frische ist ein Feature.** Einstellungen ändern sich; jede Anleitung zeigt, wann sie zuletzt gegen die offizielle Quelle geprüft wurde.

## Nicht-Ziele (MVP und bewusst darüber hinaus)

- Kein Scan echter Konten, kein Login bei Drittdiensten, kein Browser-Plugin.
- Kein numerischer Gesamt-Score und keine Rangliste (Begründung: `docs/content/assessment-methodology.md`).
- Keine Rechtsberatung, keine DSGVO-Artikel-Lehre als Hauptinhalt.
- Keine Datenbroker-Löschung (US-zentriert, in der EU anders gelagert; siehe Opportunity Map).
- Keine Monetarisierung über Verhaltensdaten, keine Affiliate-Links bei Alternativen.
- Keine „Gamification" mit Punkten, Streaks oder Bestenlisten.

## MVP (dieser Meilenstein)

Ein zusammenhängendes Erlebnis, das das Erfolgskriterium (siehe unten) in ~2 Minuten erfüllt:

1. **Start** mit Signature-Erlebnis im Kleinen: *„Was verraten fünf harmlose Spuren?"* – du wählst Alltagsverhalten, Durchblick zeigt, wie sich schwache Signale zu Einschätzungen verdichten, jeweils mit Gewissheitsstufe.
2. **Mein Digitaler Fußabdruck**: Dienste antippen → persönliche Übersicht (Datenarten, Querverbindungen, größte Hebel). Klar gekennzeichnet als *Einordnung auf Basis deiner Auswahl*, nicht als Scan.
3. **Dienstseiten** (8 Dienste: Google, YouTube, Instagram, Facebook, WhatsApp, TikTok, Amazon, ChatGPT) mit den vier Leitfragen, Datenreise, Datenprofil, Anleitungen, Quellen.
4. **Mein Plan**: persönliche Maßnahmenliste nach Zeitaufwand (5 Min · 30 Min · 1 Std · Weitergehend), Fortschritt nur lokal und nur nach Zustimmung gespeichert.
5. **Alternativen** mit ehrlichen Abwägungen.
6. **Transparenz**: Live-Ansicht, was diese Website gespeichert und welche Netzwerkanfragen sie gestellt hat; Export und Löschen.
7. **Methodik**: Quellenhierarchie, Gewissheitsstufen, Datenprofil-Rubrik, Aktualität.

Begründung der Auswahl der 8 Dienste: höchste Nutzungsreichweite in Deutschland unter den großen Plattformen, Abdeckung der wichtigsten Geschäftsmodelle (Werbung, Handel, Abo/KI) und der wichtigsten Mechanismen (Konzernverknüpfung bei Google/Meta, Ende-zu-Ende-Verschlüsselung bei WhatsApp, Datenübermittlung bei TikTok, Gesprächsinhalte bei ChatGPT). *Nutzungszahlen sind in der Recherche noch zu belegen.*

## Zukunft

- **Datenimport (lokal):** Google Takeout / Meta „Deine Informationen herunterladen" im Browser analysieren (Web Worker, keine Übertragung). Machbarkeit: `docs/architecture/architecture.md`, Bedrohungsmodell: `docs/security/threat-model.md`.
- **Privatsphäre-Beleg** („Meine digitale Privatsphäre – Oktober 2026") als lokal erzeugtes PDF/Bild.
- **Änderungsmonitor:** Datenmodell trägt bereits `reviewedAt`/`checkedAt`; später redaktioneller Prüfrhythmus mit Änderungsprotokoll pro Dienst („Instagram hat eine neue Einstellung eingeführt").
- **Weitere Sprachen** (Englisch zuerst) über Overlay-Dateien.
- **Weitere Dienste** nur in voller Tiefe, nicht als flache Einträge.

## Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Veraltete Anleitungen schaden Vertrauen | Prüfdatum sichtbar, `needs-verification`-Status, Prüfrhythmus |
| Rechtliche Angriffsfläche durch Bewertungen | keine Zahl, keine Rangliste, jede Stufe begründet und belegt; rechtliche Prüfung vor Launch (Entscheidung offen) |
| Übertreibung / Angstmache | Gewissheitsstufen technisch erzwungen (Schema), Red-Team-Review |
| Inhalte zu oberflächlich | 8 Dienste in Tiefe statt 50 flach |
| „Noch eine Datenschutzseite" ohne Wiederkehr | Plan mit Fortschritt; später Änderungsmonitor |
| Vertrauensparadox | Architektur ohne Backend; Transparenzansicht; offener Quellcode (Entscheidung offen) |

## Erfolgskriterien

**Qualitativ (MVP, durch Nutzertests zu prüfen):** Eine neue Besucherin kann innerhalb von ~2 Minuten
1. erklären, warum digitale Privatsphäre sie betrifft,
2. mehrere eigene Dienste wiedererkennen,
3. eine überraschende, belegte Tatsache nennen,
4. einen Datenfluss in eigenen Worten beschreiben,
5. mindestens eine konkrete Maßnahme nennen, die sie umsetzen kann.

**Quantitativ (später, nur datensparsam messbar):** Weil wir nicht tracken, messen wir nicht pro Person. Optionen: freiwillige, anonyme Ein-Klick-Rückmeldung („Hat dir das geholfen?") ohne Kennung; serverseitige, aggregierte Seitenaufrufe ohne IP-Speicherung (Entscheidung offen, siehe `docs/privacy/privacy-architecture.md`).
