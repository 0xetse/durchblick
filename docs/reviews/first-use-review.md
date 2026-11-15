# First-Use-Review (V1 → V2)

Datum: 2026-10-07 · Methode: heuristischer Walkthrough des V1-Prototyps auf einem Smartphone-Viewport (Pixel 7, 412 × 915) und Desktop, je Persona der komplette Erstbesuch. **Das ist keine Nutzerforschung** – es sind begründete Hypothesen, die der Nutzertest (`docs/research/usability-test-plan.md`) bestätigen oder widerlegen muss.

## Leitfrage

> Versteht jemand, der normalerweise nicht über Datenschutz nachdenkt, beim ersten Öffnen innerhalb von zwei Minuten, warum dieses Produkt **ihn persönlich** betrifft?

**Antwort für V1: teilweise – und eher zufällig.** Der Aha-Moment existiert („Ungefährer Wohn- und Arbeitsort – direkt ableitbar"), aber er ist nicht mit *den Apps der Person* verbunden, kommt auf dem Handy erst nach ~2 Bildschirmen Scrollen, und danach fehlt die Brücke zur Handlung.

## Die ersten 120 Sekunden in V1 (Smartphone)

| Sekunde | Was die Person sieht | Was sie versteht | Problem |
|---|---|---|---|
| 0–8 | Überschrift „Was erfahren Apps eigentlich über dich?", 4 Zeilen Einleitung, Badge „Keine Tracker" | „Seite über Datenschutz" | Gut: klare Frage, Vertrauenssignal sichtbar. Schwach: Einleitung erklärt („Nicht Geheimnisse … sondern Schlussfolgerungen") statt sofort etwas tun zu lassen. |
| 8–25 | Erste Chips „Folgt Fußballvereinen", „Kauft Laufschuhe online" … 12 Stück, ~2 Bildschirme lang | „Ich soll Verhalten antippen" | Die Chips sind **Verhalten**, die Überschrift spricht von **Apps**. Bruch im mentalen Modell. 12 Chips = Scroll-Ermüdung; das klebende „Noch keine Spur gewählt" verdeckt einen Chip. |
| 25–45 | Tippt 2–4 Chips; Leiste zeigt „3 Spuren → 3 Einschätzungen" | „Es passiert etwas" | Ergebnis liegt ~1,5 Bildschirme tiefer. Die Leiste ist ein Zähler, kein Inhalt. |
| 45–75 | Scrollt: Konstellation (viel leere Fläche, wenige Linien), dann Einschätzungen | „Aus ‚7:40 Uhr am selben Ort' + ‚abends im selben WLAN' folgt mein Wohn- und Arbeitsort" → **erster Aha** | In der Kurzfassung fehlt die Begründung und der Beleg – genau im Moment der Überraschung. „Schläft möglicherweise schlecht" wirkt eher unheimlich als erhellend. |
| 75–120 | Legende, Link „Alle Einschätzungen …", dann drei „Takeaway"-Absätze | „Okay. Und jetzt?" | **Keine Handlung.** Der Weg zu „Was kann ich tun?" liegt weiter unten (Abschnitt Vier Fragen) oder im Menü. Erst ab hier taucht die Dienst-Liste auf. |

**Erster überraschender Inhalt:** ~45–75 s (nur wenn passende Chips gewählt wurden; „Laufschuhe → treibt Sport" überrascht niemanden).
**Erste nützliche Handlung:** in V1 innerhalb von 120 s nicht zuverlässig erreichbar.

## Persona-Walkthroughs

### A – Unbekümmert („Ich nutze Instagram, Google, Amazon. Ich hab nichts zu verbergen.")

| Aspekt | Befund |
|---|---|
| Verwirrung | Warum soll ich Verhalten wählen, wenn ich wissen will, was *Instagram* weiß? |
| Reibung | 12 Chips, langes Scrollen. |
| Vertrauen | unkritisch; „Keine Tracker" fällt kaum auf, stört aber nicht. |
| Langweilig | „Kauft Laufschuhe → treibt Sport" bestätigt nur Erwartetes („na und?"). |
| Zu technisch | „Direkt ableitbar", „Von Werbeplattformen dokumentiert" – unklar, was das für mich heißt. |
| Überraschung | Wohn-/Arbeitsort aus zwei Zeitmustern – **ja, wenn gewählt**. |
| Persönliche Relevanz | gering: die eigenen Apps tauchen erst unten auf. |
| Abbruch | sehr wahrscheinlich nach dem ersten unspektakulären Ergebnis (~40 s). |
| Was V2 braucht | mit **seinen Apps** starten; der erste Fakt muss *über eine App, die er nutzt*, sein und etwas betreffen, das er für privat hält („Google erfährt auch etwas, wenn du gar nicht auf Google bist"). |

### B – Neugierig („Ich weiß, dass gesammelt wird, verstehe aber nicht was.")

| Aspekt | Befund |
|---|---|
| Verwirrung | Zwei Einstiege (Spuren-Experiment vs. „Meine Dienste auswählen") ohne erkennbare Reihenfolge. |
| Reibung | Fußabdruck liegt auf eigener Seite; Matrix (Tabelle mit Punkten) ist korrekt, aber trocken. |
| Überraschung | „Wusstest du?"-Fakten sind stark – aber im Fußabdruck **eingeklappt** und auf Dienstseiten erst nach dem Kopf. |
| Informationsflut | Dienstseiten: 10–12 Datenpunkte mit je 2–3 Etiketten, dann Datenreise, Ableitungen, Zwecke, Weitergabe, Speicherdauer, Datenprofil, Anleitungen, Quellen – ein Lexikon. |
| Persönliche Relevanz | hoch, sobald die Matrix steht – aber erst nach Seitenwechsel. |
| Abbruch | auf langen Dienstseiten nach Frage 1. |
| Was V2 braucht | Auswahl → sofort ein **sichtbares, persönliches Bild**; Dienstseiten mit **„Auf einen Blick"** oben. |

### C – Besorgt („Ich will besser werden, aber alles ändern überfordert mich.")

| Aspekt | Befund |
|---|---|
| Reibung | Plan zeigt bei 2 Diensten 13 Maßnahmen, gruppiert nach Minuten. Gut gemeint, aber „5 Minuten" mit 8 Einträgen ist keine Startempfehlung. |
| Fehlend | „Wenn du nur drei Dinge machst, dann diese." Keine Kennzeichnung, welche Maßnahmen Komfort kosten (z. B. YouTube-Verlauf pausieren → keine Empfehlungen mehr). |
| Positiv | „Was sich nicht ändert" schafft Vertrauen; Abhaken mit Einwilligungsfrage funktioniert. |
| Abbruch | beim Anblick der Liste („mache ich später"). |
| Was V2 braucht | **Start hier: 3** · Danach · Optional (mit Abstrichen) – mit erklärter Priorisierung. |

### D – Skeptisch („Warum sollte ich dieser Seite irgendwas anvertrauen?")

| Aspekt | Befund |
|---|---|
| Vertrauen | Badge „Keine Tracker" führt zu einer guten Transparenzseite (Live-Anfragen, Cookies, Speicher) – stark. |
| Lücke | Die Antwort auf „Was weiß Durchblick jetzt gerade über mich?" ist nicht *dort*, wo die Frage entsteht (beim Auswählen). Transparenzseite zählt Anfragen nur der Transparenzseite selbst. |
| Lücke | Kein Impressum, kein offener Code (bekannt, Entscheidung offen). |
| Positiv | Präzise Formulierung zum Hosting (kein pauschales „Nichts verlässt dein Gerät"). |
| Was V2 braucht | Ein überall erreichbares **„Was weiß Durchblick über mich?"**-Panel mit dem *tatsächlichen* lokalen Zustand und „Alles löschen". |

### E – Nicht technisch („Was sind Metadaten, Pixel, Werbe-IDs?")

| Aspekt | Befund |
|---|---|
| Zu technisch | Etiketten „Beobachtet / Berechnet / Laut Anbieter / Technisch zwangsläufig", Begriffe wie „Datenprofil", „Verknüpfung", „Off-Meta-Aktivitäten", „IP-Adresse", „Pixel" ohne Erklärung in Stufe 1/2. |
| Gut | Ruhige Sprache, Du-Form, keine Alarmwörter. |
| Abbruch | auf Dienstseiten bei Datenpunkten mit Fachbegriffen. |
| Was V2 braucht | Jargon-Prüfung (B1–B2), Fachbegriffe erst nach Alltagserklärung; „Woher wissen wir das?" statt Quellen-Kürzeln. |

## Die fünf größten Schwächen von V1

1. **Bruch zwischen Versprechen und Interaktion.** „Was erfahren Apps über dich?" – aber der Einstieg fragt nach abstraktem Verhalten, nicht nach den eigenen Apps.
2. **Kein Weg von der Überraschung zur Handlung.** Nach dem Aha kommt kein „Das kannst du in 2 Minuten ändern".
3. **Die stärksten Fakten sind versteckt.** Die belegten „Wusstest du?"-Fakten (z. B. Google auf fremden Websites, WhatsApp und Nummern von Nicht-Nutzern) stehen eingeklappt oder tief auf Dienstseiten.
4. **Zu viel Lexikon, zu wenig Antwort.** Dienstseiten und Plan zeigen alles gleichzeitig; es fehlt „Auf einen Blick" und „Start hier".
5. **Vertrauen ist erklärt, aber nicht dort erlebbar, wo es zählt.** Die Transparenz ist eine eigene Seite statt ein Zustand, den man beim Benutzen jederzeit sieht.

## Stärkstes Alleinstellungsmerkmal (bestätigt)

**Belegte Überraschung mit sofortiger Handlung, auf Basis der eigenen Apps – ohne dass die Seite selbst etwas über dich erfährt.** Keiner der analysierten Wettbewerber verbindet *persönliche Relevanz* (deine Apps), *Beleg mit Prüfdatum* und *nachprüfbar datenfreie Architektur*. Die Gewissheitskennzeichnung (belegt vs. möglich) ist der Glaubwürdigkeitsanker.

## Konsequenzen für V2 (umgesetzt, siehe `docs/product/v2-direction.md`)

- Startseite beginnt mit **App-Auswahl**, nicht mit Erklärung.
- Sofortiges, persönliches Bild: **„Dein Datenmuster"** – neun Lebensbereiche, die sich mit jeder gewählten App füllen.
- Direkt darunter **ein belegter Fakt** zu einer gewählten App + **„In 2 Minuten ändern"** mit offiziellem Link.
- **Start hier: 3 Änderungen** als Plan-Kopf, mit Priorisierungsmethodik.
- **„Was weiß Durchblick über mich?"** in der Kopfzeile, auf jeder Seite.
- Dienstseiten mit **„Auf einen Blick"**; Quellen als **„Woher wissen wir das?"**.
- Spuren-Experiment bleibt als Vertiefung („Was sich daraus schließen lässt"), nicht als Einstieg.

## Nachprüfung V2 (Walkthrough nach Umsetzung)

Siehe Abschnitt „V2-Walkthrough" am Ende von `docs/product/v2-direction.md`.
