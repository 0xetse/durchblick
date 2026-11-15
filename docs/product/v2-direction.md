# V2-Richtung: vom Lexikon zum Zwei-Minuten-Erlebnis

Stand: 2026-10-07 · Grundlage: `docs/reviews/first-use-review.md` · Status: umgesetzt, **durch Nutzertests zu validieren**

## 1. Ehrliches Urteil über den MVP (V1)

V1 war fachlich stark und technisch sauber: belegte Inhalte, Gewissheitsstufen, nachprüfbar datenfreie Architektur, gute Barrierefreiheit. **Als Produkt war V1 aber ein gut sortiertes Nachschlagewerk mit einem interessanten Experiment davor.** Es beantwortete „Was sammelt Instagram?" vorbildlich – für Menschen, die diese Frage schon haben. Wer sie nicht hat (die Mehrheit), bekam abstrakte Verhaltens-Chips, eine Überraschung ohne Konsequenz und dann eine Tabelle.

## 2. Die fünf größten Schwächen (Details: First-Use-Review)

1. Versprechen („Was erfahren Apps?") und Einstieg (abstraktes Verhalten) passten nicht zusammen.
2. Keine Brücke von Überraschung zu Handlung.
3. Die stärksten belegten Fakten waren versteckt.
4. Dienstseiten und Plan zeigten alles gleichzeitig („Lexikon").
5. Vertrauen war erklärt, aber nicht beim Benutzen erlebbar.

## 3. Stärkstes Alleinstellungsmerkmal

**Belegte Überraschung über die eigenen Apps, direkt gefolgt von einer ehrlich beschriebenen Zwei-Minuten-Änderung – auf einer Seite, die nachweislich nichts über dich erfährt.** Jedes Element gibt es irgendwo einzeln (Privacy-Checkups der Plattformen, Ratgeber, Privacy-Guides). Die Kombination aus *persönlicher Relevanz ohne Datenerhebung*, *Beleg mit Prüfdatum* und *„Was sich nicht ändert"* hat keiner der analysierten Wettbewerber.

## 4. Wertversprechen

### Kandidaten, geprüft

| Formulierung | Klarheit | Neugier | Glaubwürdigkeit | Emotion | Nicht-alarmistisch | Urteil |
|---|---|---|---|---|---|---|
| „Übernimm die Kontrolle über deine Privatsphäre." | 2 | 1 | 2 | 2 | 4 | generisch, austauschbar |
| „Was erfahren Apps eigentlich über dich?" (V1) | 4 | 4 | 4 | 3 | 5 | gut, aber passiv („erfahren") |
| „Verstehe deinen digitalen Schatten." | 2 | 3 | 3 | 4 | 2 | Schatten = düster, unklar was zu tun ist |
| „Dein digitaler Fußabdruck, erklärt." | 4 | 2 | 4 | 2 | 5 | abgenutzt |
| „Du nutzt die Apps. Sieh, was die Apps lernen." | 4 | 5 | 4 | 4 | 4 | stark, als Unterzeile zu lang |
| **„Was lernen deine Apps über dich?"** | 5 | 5 | 4 | 4 | 5 | **gewählt** |

**Warum „lernen":** Es beschreibt den eigentlichen Mechanismus (Schlussfolgerungen aus Verhalten) besser als „sammeln" oder „erfahren", ist im Alltag verständlich, klingt nicht nach Überwachung und macht neugierig, ohne zu drohen. „Deine Apps" macht es sofort persönlich.

### Gewählte Botschaft

- **Überschrift:** Was lernen deine Apps über dich?
- **Unterzeile:** Tippe an, was du nutzt. Du siehst sofort, was diese Apps erfahren können – und was du in zwei Minuten änderst.
- **Vertrauenszeile (direkt an der Auswahl):** Deine Auswahl bleibt in deinem Browser. Wir haben keine Konten gescannt.
- **Kurzform (Tagline, Meta-Beschreibung):** Sieh, was deine Apps über dich lernen – und was du änderst. Ohne Konto, ohne Tracking.

## 5. Signature-Erlebnis: Vergleich und Entscheidung

| Kriterium | A: „Fünf harmlose Spuren" (V1) | **B: „Dein Datenmuster" (V2)** | C: „Ein Tag in Daten" (Zeitstrahl) |
|---|---|---|---|
| Sofort verständlich? | mittel – Verhalten statt Apps | **hoch – „Welche Apps nutzt du?"** | hoch |
| Überraschung? | hoch, *wenn* die richtigen Chips gewählt werden | hoch: belegter Fakt zu *einer eigenen App* | mittel, erzählerisch |
| Glaubwürdigkeit? | gut (Gewissheitsstufen), aber Schlussfolgerungen sind teils spekulativ | **sehr gut**: nur dokumentierte Kategorien und belegte Fakten | mittel: braucht Annahmen über einen „typischen" Tag |
| Persönlich, ohne Daten zu erheben? | nein (generisch) | **ja** (nur App-Auswahl, lokal) | nein |
| Unsicherheit kommuniziert? | ja | ja („Einordnung deiner Auswahl", Herkunfts-Glyphen) | schwierig |
| Visuell einprägsam? | Konstellation mit wenig Linien | **eigenes Muster aus 9 Sektoren, das mit jeder App wächst** | Zeitstrahl, sehr textlastig |
| Führt zur Handlung? | nein | **ja – Schritt 4 „In zwei Minuten ändern"** | indirekt |
| Würde man es zeigen? | vielleicht | **ja: „Schau mal, mein Muster"** (Screenshot ohne Daten) | eher nicht |
| Aufwand | vorhanden | mittel | hoch (viel neuer Content) |

**Entscheidung:** B wird das Signature-Erlebnis und der Einstieg. A bleibt als Vertiefung („Was sich daraus schließen lässt", `/spuren/`), weil es die *Schlussfolgerung* erklärt, die B nicht zeigt – aber nicht mehr als erster Kontakt. C wird nicht gebaut.

### Aufbau „Dein Datenmuster"

1. **Welche Apps nutzt du?** – acht große Kacheln (2 Spalten, 52 px hoch, daumenfreundlich).
2. **Dein Datenmuster** – „Diese 3 Apps können Informationen aus 9 von 9 Bereichen deines Lebens erhalten." Darunter das Muster: neun Lebensbereiche (Identität, Interessen, Fragen, Kontakte, Orte, Käufe, Geräte, Anderswo, Inhalte) als Sektoren; jede App, die laut Dokumentation Informationen aus einem Bereich bekommen kann, fügt dem Sektor einen Ring hinzu. Daneben (mobil: darunter) die Liste der Bereiche – aufklappbar mit den konkreten Datenpunkten je App und Herkunfts-Glyphe. **Die Liste ist die eigentliche Information; das Muster verstärkt sie nur.**
3. **Das wissen die wenigsten** – ein belegter Fakt zu einer gewählten App (Reihenfolge nach Allgemeingültigkeit: Google → WhatsApp → Instagram → …), „Woher wissen wir das?" aufklappbar, „Nächster Fakt" für weitere gewählte Apps.
4. **In zwei Minuten ändern** – die passende Einstellung mit „Was sich ändert" / „Was sich nicht ändert" und offiziellem Link.
5. Weiter: **Meine 3 ersten Schritte** (Plan) oder **Alle Details zu meinen Apps**.

**Genauigkeitsgrenze, sichtbar formuliert:** „Grundlage: N Arten von Informationen, die diese Anbieter selbst nennen oder die technisch anfallen. Das ist eine Einordnung deiner Auswahl – wie viel davon bei dir tatsächlich anfällt, hängt von Nutzung und Einstellungen ab."

**Bekannte Schwäche:** Schon drei große Apps berühren oft alle neun Bereiche („9 von 9"). Die Aussage ist korrekt, verliert aber Trennschärfe. Das Muster gleicht das teilweise aus (Ringtiefe = Zahl der Apps). Im Nutzertest prüfen, ob „9 von 9" als übertrieben empfunden wird; Alternative: Zahl der Apps je Bereich statt Bereichszahl in die Überschrift.

## 6. Der „Oh"-Moment

Kandidaten aus der Recherche, bewertet nach *Überraschung × Beleglage × Relevanz × Handlungsbezug*:

| Insight | Beleg | Relevanz | Handlung | Rolle in V2 |
|---|---|---|---|---|
| Google erfährt auch etwas, wenn du gar nicht auf Google bist (Werbung/Analytics auf fremden Websites) | Tier 1 (Google) | fast alle | Partner-Werbung/Aktivität begrenzen | **erster Fakt**, wenn Google gewählt |
| WhatsApp erhält auch Nummern von Menschen, die WhatsApp gar nicht nutzen | Tier 1 (WhatsApp) | sehr hoch | Kontakte-Zugriff | erster Fakt ohne Google |
| Kontakte bleiben bei Instagram gespeichert, auch wenn du die Synchronisierung ausschaltest | Tier 1 (Instagram) | hoch | Kontakte löschen | Fakt |
| Werbung abschalten ≠ Datensammlung stoppen | Tier 1 (alle „Was sich nicht ändert"-Felder) | alle | – | **steckt in jeder Handlung** („Was sich nicht ändert") |
| Zwei Zeitmuster verraten Wohn- und Arbeitsort | Tier 2 (Forschung) | alle mit Handy | Standortverlauf | `/spuren/` und Startseiten-Abschnitt „Einzeln harmlos. Zusammen ein Bild." |
| ChatGPT kann Gespräche zum Training nutzen, solange du es nicht abschaltest | Tier 1 (OpenAI, laut eigenen Angaben) | wachsend | Training abschalten | Fakt |

Prinzip: **Der erste Fakt muss eine App betreffen, die die Person gerade angetippt hat.** Das ist der Unterschied zwischen „interessant" und „betrifft mich".

## 7. Optimale erste Nutzerreise (umgesetzt)

| Zeit | Schritt | Ziel |
|---|---|---|
| 0–10 s | Überschrift + Unterzeile + App-Kacheln über dem Falz | sofort handeln statt lesen |
| 10–25 s | 2–4 Apps antippen; Zeile „3 Apps · 9 von 9 Lebensbereichen ↓" erscheint direkt unter den Kacheln | sofortige Rückmeldung am Daumen |
| 25–50 s | Datenmuster + Bereichsliste | „Das betrifft mein ganzes Leben, nicht nur Werbung" |
| 50–80 s | Fakt zu einer eigenen App, „Woher wissen wir das?" | **Überraschung + Glaubwürdigkeit** |
| 80–110 s | „In zwei Minuten ändern" mit „Was sich nicht ändert" + offizieller Link | **erste Handlung** |
| 110–120 s | „Meine 3 ersten Schritte" | Fortsetzung ohne Überforderung |

Vertrauen läuft parallel: „Keine Tracker" in der Kopfzeile öffnet jederzeit „Was weiß Durchblick über dich?" mit dem echten Zustand („Ausgewählt: Instagram, Google, Amazon – steht nur in der Adresszeile, wird nicht an uns gesendet").

## 8. Weitere V2-Änderungen

- **Plan:** „Start hier" (3) · „Danach" · „Optional – mit Abstrichen". Methodik auf der Seite und in `action-plan-methodology.md`.
- **Dienstseiten:** „Auf einen Blick" (vier Fragen in vier Kästen) vor dem Detail; „Das wissen die wenigsten" mit „Woher wissen wir das?"; Datenpunkt-Belege aufklappbar statt Quellenkürzel.
- **Spuren:** neueste Einschätzung erscheint in der klebenden Leiste („Neu: Ungefährer Wohn- und Arbeitsort"); jede Regel kann eine passende Handlung verlinken.
- **Sprache:** Jargon-Prüfung (`docs/content/jargon-audit.md`), B1–B2 für Stufe-1/2-Texte.
- **Alternativen:** Komfort-Abwägungen ausdrücklich („Verzichtest du auf … / Gewinnst du … / Bleibt gleich").

## 9. Bewusst nicht gebaut (Scope-Disziplin)

Konten, Cloud-Profile, Browser-Erweiterung, Newsletter, KI-Assistent, native Apps, Takeout-Import, automatisches Policy-Monitoring, Datenbroker-Löschung, Community-Funktionen.

## 10. V2-Walkthrough (nach Umsetzung, gleiche Methode wie First-Use-Review)

| Persona | V1 | V2 (Hypothese bis zum Nutzertest) |
|---|---|---|
| A Unbekümmert | Abbruch nach ~40 s („na und?") | Tippt Instagram/Google/Amazon → Fakt „Google erfährt auch etwas, wenn du gar nicht auf Google bist" betrifft ihn direkt; Handlung in 2 Min. Risiko: „9 von 9" wirkt übertrieben. |
| B Neugierig | Antwort erst nach Seitenwechsel | Antwort in Sekunden, Bereichsliste mit konkreten Datenpunkten je App. |
| C Besorgt | 13 Maßnahmen ohne Startpunkt | „Start hier: 3", Abstriche getrennt, Fortschritt „1 von 3". |
| D Skeptisch | Vertrauen auf separater Seite | Panel überall, zeigt den tatsächlichen Zustand, „Alles löschen". Offen: Impressum, offener Code. |
| E Nicht technisch | Fachbegriffe in Stufe 1/2 | Lebensbereiche in Alltagssprache („Wo du bist"), Herkunft als „Von dir selbst / Aus deiner Nutzung / Von anderen Firmen", Jargon-Pass im Content. Rest-Risiko: Gewissheits-Etiketten. |
