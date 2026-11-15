# D-N24 – Wo lebt die App-Auswahl? (Entscheidungsvorlage)

Stand: 2026-11-12, nach unabhängigem Review korrigiert (Abschnitt 1 und Fußnote zu C) · **Status: entschieden 2026-11-13 (C + D), umgesetzt mit der Stabilisierung – siehe Abschnitt 7.** Grundlage: Messungen in echten Browserprofilen (Chromium 153 als vollwertiger Browser, Firefox 155, WebKit 26.6 über Playwright, Linux) und die Anforderung „Die Auswahl bleibt standardmäßig lokal und wird nicht automatisch in URLs oder dauerhaften Speichern abgelegt“.

## 1. Was heute passiert (gemessen)

Die Auswahl steht als Fragment in der Adresse (`/#d=telegram,instagram`) und wird bei jedem Antippen per `history.replaceState` aktualisiert. Menü-Links tragen sie weiter.

| Frage | Ergebnis | Wie gemessen |
|---|---|---|
| Geht die Auswahl an den Server, in Logs oder in den Referrer? | **Nein.** Fragmente werden nie gesendet; zusätzlich `no-referrer`, CSP sperrt fremde Ziele | Spezifikation; E2E `trust.spec.ts` (fremder `fetch`/Bild/Beacon blockiert, 4 Engines) |
| Landet sie in der **dauerhaften Verlaufsdatenbank** des Browsers? | **Ja – jeder Zwischenstand einzeln**, auch die nur per `replaceState` geänderten Adressen. Nach dem Antippen von Telegram, dann Instagram: `/#d=telegram` **und** `/#d=telegram,instagram` als eigene Einträge | Playwright `launchPersistentContext` mit eigenem Profil (Chromium mit `channel: 'chromium'`, die Headless-Shell führt keinen Verlauf), Telegram und Instagram antippen, Profil schließen, dann Chromium `Default/History` (`select url from urls`) bzw. Firefox `places.sqlite` (`select url from moz_places`) lesen |
| Mit Browser-Sync beim Browserhersteller? | **sehr wahrscheinlich ja** (Chrome-/Firefox-Sync synchronisieren den Verlauf) | **nicht gemessen** (kein Konto in der Testumgebung) |
| Offline-Cache des Service Workers | seit SW v4 **nein** (vorher ja) | E2E `state.spec.ts` |
| Gespeicherte Auswahl („auf diesem Gerät merken“) in der Adresse? | in einem Zwischenstand der Stabilisierung schrieb `/plan/` sie in die Adresse und damit in den Verlauf (unabhängiges Review, in Chromium `History` nachgewiesen); **behoben**: eine gespeicherte Auswahl wird nie mehr in eine Adresse geschrieben, nur was auf der Seite selbst angetippt wird | E2E `state.spec.ts` (P2-4 / review P1-A) |
| Alte Einträge im Verlauf | bleiben, bis die Person den Verlauf löscht – keine Option kann sie nachträglich entfernen | – |
| Adresszeilen-Vorschläge, „Zuletzt besucht“, Screenshots, Bildschirmfreigabe | ja, folgt aus dem Verlauf bzw. der sichtbaren Adresse | abgeleitet, nicht einzeln gemessen |

Bewertung: Das widerspricht dem eigenen Versprechen „gespeichert wird nur nach Zustimmung“. Welche Apps jemand nutzt (Telegram, ChatGPT, PayPal …) ist zwar keine Gesundheits- oder Finanzangabe, aber persönlich – und es landet hier in einem Speicher, den die Person nicht gewählt hat und den „Alles löschen“ nicht erreicht.

## 2. Optionen

Gemessene Eigenschaften (identisch in Chromium, Firefox, WebKit):

| | Neuladen | Andere Seite im selben Tab | Zurück/Vor | Neuer Tab | Tab per Link mit `opener` | Verlaufsdatenbank | Sync | gelöscht wenn |
|---|---|---|---|---|---|---|---|---|
| **A · Fragment `#d=` (heute)** | bleibt | bleibt (über Links) | bleibt | nur über Link | bleibt | **ja** | wahrsch. ja | Verlauf gelöscht wird |
| **B · nur `history.state` / Arbeitsspeicher** | bleibt (`history.state`) | **weg** | bleibt | weg | weg | nein | nein | Tab zu |
| **C · `sessionStorage`** | bleibt | bleibt | bleibt | **weg** (eigener Tab) | wird kopiert | nein | nein | Tab zu, auf der Festplatte erst wenn der Browser die Sitzungsdaten aufräumt* |
| **D · bewusst teilen** (Knopf „Link mit meiner Auswahl kopieren“) | – | – | – | – | – | nur wenn jemand den Link öffnet | – | – |

\* **Auch C schreibt auf die Festplatte:** Das unabhängige Review hat nachgewiesen, dass Chromium `sessionStorage` und `history.state` in den Profildateien `Default/Session Storage/` und `Default/Sessions/` ablegt und Firefox sie in `sessionstore.jsonlz4` sichert (dort fand sich der Prüftext nach normalem Schließen). Das dient der Sitzungswiederherstellung. Unterschied zu A: keine Verlaufsdatenbank, keine Adresszeilen-Vorschläge, kein Sync, und der Browser verwirft die Daten, wenn die Sitzung nicht wiederhergestellt wird. Ob „Tabs wiederherstellen“ die Auswahl zurückbringt, ist auf echten Geräten zu prüfen (Abschnitt 6).

**B allein** reicht nicht: Ohne Adresse oder Speicher kann die Auswahl nicht von der Startseite zum Plan oder zu „Einstellungen ändern“ mitgehen. Jede Seite müsste neu fragen – das bricht den Kernablauf (Schritt 4 → „Mein Plan“), außer man baut die Seite zur Single-Page-App um (unverhältnismäßig).

## 3. Empfehlung: C + D, alte Links lesen und aufräumen

1. **Standard: `sessionStorage`, nur dieser Tab.** Kein `#d=` mehr in Adressen, Menü-Links ohne Fragment. Auswahl übersteht Neuladen, Zurück/Vor und Seitenwechsel im Tab. Kein Eintrag in Verlaufsdatenbank, Sync oder Offline-Cache. **Nicht** „spurlos“: Der Browser hält Sitzungsdaten für die Wiederherstellung auf der Festplatte, bis er sie verwirft.
2. **Geteilte und alte Links bleiben gültig:** Eine Adresse mit `#d=…` wird beim Öffnen gelesen, in den Tab übernommen und sofort aus der Adresse entfernt (`replaceState`). Ehrliche Grenze: Die *geöffnete* Adresse selbst steht dann schon im Verlauf – das hat die Person durch das Öffnen des Links ausgelöst, nicht Durchblick.
3. **Teilen nur auf Wunsch (D):** ein einziger, ruhiger Knopf „Link mit meiner Auswahl kopieren“ – vorgeschlagen nur auf „Mein Plan“, nicht im Wizard (keine zusätzliche Entscheidung im Einstieg). Ob er überhaupt gebraucht wird, im Nutzertest prüfen; bis dahin kann er auch entfallen.
4. **„Merken auf diesem Gerät“** (localStorage nach Zustimmung) bleibt wie heute.
5. **Texte:** „Deine Auswahl bleibt in diesem Tab. Schließt du ihn, ist sie für Durchblick weg – dein Browser kann sie aber noch für „Tabs wiederherstellen“ aufbewahren.“ statt „steht nur in der Adresszeile“. „Alles löschen“ leert auch den Tab-Speicher.

Warum nicht B+D: verliert die Auswahl beim Seitenwechsel. Warum nicht A beibehalten: belegter Eintrag jeder Zwischenauswahl in Verlauf und (wahrscheinlich) Sync.

## 4. Abwägung und Risiken von C

| Thema | Einschätzung |
|---|---|
| **Rechtlich** | `sessionStorage` ist eine Speicherung auf dem Endgerät (§ 25 TDDDG). Plausibel unter die Ausnahme „unbedingt erforderlich für einen ausdrücklich gewünschten Dienst“ (die Person tippt die Apps selbst an, damit die nächsten Seiten sie nutzen). **Einschätzung, keine Rechtsprüfung** – gehört zu D-N6. Heute landet dieselbe Information ohne jede Ausnahme im Verlauf. |
| **Versprechen „nichts ohne Zustimmung“** | muss präzisiert werden: „Ohne Zustimmung merkt sich Durchblick deine Auswahl nur in diesem Tab, bis du ihn schließt.“ |
| **Mehrere Tabs** | jeder Tab hat seine eigene Auswahl. Ehrlicher als heute; kann überraschen, wenn jemand einen zweiten Tab öffnet – im Nutzertest beobachten. |
| **Speicher blockiert** | dann Rückfall auf den Arbeitsspeicher der Seite (Auswahl geht beim Seitenwechsel verloren) – mit Hinweis wie heute auf dem Plan. |
| **Sprachwechsel** | einfacher als heute: gleicher Tab, gleiche Herkunft, die Auswahl ist einfach da. |
| **Ohne JavaScript** | unverändert (der Wizard braucht JavaScript). |
| **Testaufwand** | ~30 Tests prüfen heute `#d=`-Adressen und müssten umgestellt werden. |

## 5. Umfang einer Umsetzung (nach Freigabe)

`storage.ts` (Tab-Speicher-API, `forgetEverything`), `useSelection.ts`, `carry-selection.ts` (entfällt weitgehend), Skript in `Einstellungen.astro`, `PlanView.tsx`, `TrustPanel.tsx`, Texte DE/EN, Transparenzseite, `privacy-architecture.md`, Tests. Geschätzt ein eigener PR mittlerer Größe; keine neue Abhängigkeit, kein Server. Vorschlag: nach Merge von #22/#23, vor Testrunde 2.

## 6. Vor der Entscheidung auf echten Geräten prüfen

- Chrome/Firefox mit aktivem Sync: Taucht `…/#d=…` auf einem zweiten Gerät im Verlauf auf? (Belegt oder widerlegt die Sync-Annahme.)
- Safari iOS: Verlauf nach Auswahl ansehen (Einstellungen → Safari → Erweitert → Website-Daten bzw. Verlaufsliste).
- Absturz/„Tabs wiederherstellen“ in Chrome und Firefox: Kommt der Tab mit Schritt und Auswahl zurück? (betrifft heute `history.state`, künftig auch `sessionStorage`)

## Entscheidung

- [x] C + D wie empfohlen (freigegeben 2026-11-13, D-057)
- [ ] C ohne Teilen-Knopf (D erst nach Nutzertest)
- [ ] A beibehalten (Fragment), Hinweis im Vertrauens-Panel genügt
- [ ] andere: …

## 7. Umsetzung (2026-11-13)

| Anforderung | Umsetzung | Nachweis |
|---|---|---|
| Auswahl nicht automatisch in Adresse oder Verlauf | `src/domain/selection.ts`: Tab-Speicher `durchblick:selection`; keine Stelle schreibt mehr `#d=`; Menü- und Wizard-Links ohne Fragment; „In meinen Plan übernehmen“ ergänzt den Tab statt einen Link mit Auswahl zu öffnen | `selection-privacy.spec.ts`: echtes Chromium-Profil, typische Sitzung (Wizard, Plan, Einstellungen, Matrix, Zurück, Neuladen) – **0** Verlaufseinträge mit `#d=`; derselbe Test auf dem Stand davor: 5 Einträge (`/#d=telegram`, `/#d=telegram,instagram`, …) |
| Erhalten beim Navigieren im selben Tab, Neuladen, Zurück | `sessionStorage` plus Wizard-Schritt in `history.state`; `pageshow` (Back-/Forward-Cache) liest den Tab neu | E2E in Chromium, Firefox, WebKit, iPhone-Emulation |
| Geteilte Links nur nach bewusster Aktion, Inhalt vorher erkennbar | Plan: zugeklappt „Link mit meiner Auswahl teilen“; erst nach dem Aufklappen erscheint der Link, daneben: „Dieser Link enthält deine Auswahl: …“ und wo er landen kann | E2E: vorher kein Link im DOM, Text nennt die Apps, Kopieren (Chromium) |
| Geteilte und ältere Links: übernehmen, dann bereinigen | Seiten mit eigener Auswahl (Start, Detail, Plan, Einstellungen) übernehmen selbst; alle anderen über `src/scripts/links.ts`; `replaceState` ohne neuen Eintrag, `history.state` bleibt | E2E: Adresse danach ohne `#d=`, gleiche Zahl an Verlaufseinträgen wie ohne Link |
| „Alles löschen“ berücksichtigt den neuen Speicher | `forgetEverything()` leert Gerät, Tab und Adresse | Unit + E2E (Vertrauens-Panel und Transparenzseite) |
| Mehrere Tabs | jeder Tab eigene Auswahl; ein Tab, der per Link *mit* `opener` geöffnet wird, erbt sie (Browser-Verhalten, gemessen); Durchblick öffnet eigene Seiten nicht in neuen Tabs | E2E „each tab keeps its own selection“ |
| Datenschutzeigenschaften nicht abgeschwächt | ohne Zustimmung weiterhin nichts in `localStorage`; neu im Tab nur Kennungen der Apps; Transparenzseite, Vertrauens-Panel und Datenschutzerklärung nennen den Tab-Speicher | E2E „nothing on the device“ unverändert |

**Ausdrücklich: `sessionStorage` garantiert keine Spurenfreiheit.** Browser legen den Sitzungsspeicher offener Tabs auf der Festplatte ab, um Tabs nach Absturz oder „Geschlossenen Tab wieder öffnen“ wiederherzustellen (Chromium: `Default/Session Storage/`, Firefox: `sessionstore.jsonlz4`; im unabhängigen Review nachgewiesen). Durchblick vergisst die Auswahl, wenn der Tab geschlossen wird – der Browser kann sie bis zum Verwerfen der Sitzung behalten. Das sagen Vertrauens-Panel, Transparenzseite und Datenschutzerklärung.

**Bleibt bestehen:** Wer einen geteilten Link öffnet, hat genau diese eine Adresse im Verlauf (die Navigation selbst); weitere Einträge entstehen nicht. Alte Einträge aus der Zeit vor der Umstellung bleiben, bis man den Browserverlauf löscht.

**Unabhängiges Review der Umsetzung (2026-11-13):** Anforderung erfüllt – in echten Chromium- und Firefox-Profilen über 24 Seitentypen, alle Sprungwege, Zurück/Vor/Neuladen kein `#d=` in Adressen oder Verlauf, außer beim Öffnen eines `#d=`-Links. Gefunden und behoben:
- *Zurück nach „Alles löschen“* brachte die gelöschte Auswahl aus dem Back-/Forward-Cache zurück (Chromium) → Seiten gleichen sich bei `pageshow` immer mit dem Tab ab, auch wenn er leer ist. Test mit echtem Chromium-Cache (`persisted` geprüft).
- `/transparenz/` sprach beim Tab-Eintrag von Zustimmung → Tab und Gerät getrennt gezählt; „Alles löschen“ sagt, dass andere offene Tabs ihre Auswahl behalten.
- Ein geteilter Link ersetzte die nach Zustimmung gespeicherte Auswahl → Links füllen nur den Tab; gespeichert wird erst, wenn die Person die Auswahl ändert.
- Unbekannte Kennungen aus Links und „In meinen Plan übernehmen“ wurden übernommen → nur bekannte Apps.
- Strg-/Mittelklick auf „In meinen Plan übernehmen“ öffnete einen neuen Tab ohne Auswahl → öffnet den Plan im selben Tab.
- Chromium legte den Wert des Teilen-Felds in den Sitzungsdateien ab (beobachtet vom Review) → `autocomplete="off"` an Feld und Fortschritts-Kästchen. **In meinem eigenen Versuch trat der Eintrag weder mit noch ohne diese Änderung auf; die Wirksamkeit ist daher nicht belegt.**

**Nicht automatisiert prüfbar** (Gerätetest): ob „Tabs wiederherstellen“ die Auswahl tatsächlich zurückbringt; Verhalten von Safari iOS.
