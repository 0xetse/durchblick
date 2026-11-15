# Recherche: ChatGPT

Stand: 2026-10-07 · Perspektive: erwachsener Nutzer mit Konto (Free/Plus) in Deutschland

## Wichtiger Hinweis zur Methode

V1: openai.com und help.openai.com lieferten hinter Cloudflare-Bot-Schutz nur HTTP 403 („Just a moment…“); in V2 im gerenderten Browser gelesen, siehe „Nachprüfung V2“. Direktabruf war weder per WebFetch noch per curl möglich; Archiv-Dienste waren ebenfalls nicht erreichbar. Alle Aussagen aus OpenAI-Dokumenten stammen daher aus dem **Suchindex der offiziellen Seiten** (WebSearch mit `allowed_domains: openai.com, help.openai.com`). Deshalb: alle ChatGPT-Anleitungen `steps: []` + `needs-verification`; mehrere Bewertungen mit `medium`/`low`. Ein Mensch sollte die Seiten im Browser gegenlesen.

## Zentrale Befunde

| Aussage | Quelle | Beleg (aus Suchindex) |
|---|---|---|
| Verantwortlich im EWR: OpenAI Ireland Limited, 1st Floor, The Liffey Trust Centre, 117-126 Sheriff Street Upper, Dublin 1 | https://openai.com/policies/eu-privacy-policy/ | „OpenAI Ireland Limited … is the controller …“ |
| Kontodaten | dto. | „name, contact information, account credentials, date of birth, payment information, and transaction history“ |
| Inhalte | dto. | „prompts and other content you upload, such as files, images, audio and video, and data from connected services“ |
| Log/Usage/Device/Location | dto. | IP, Browser, Zeit; genutzte Funktionen, Feedback, Zeitzone, Land; Gerätename, OS, Kennungen; „general area … based on … IP address“, optional präziser Standort (GPS) |
| Training, Rechtsgrundlage berechtigtes Interesse | dto. | „legitimate interests … such as when they train and improve their models“ |
| Weitergabe, Übermittlung USA | dto. | Dienstleister (Hosting, Cloud, Support, Zahlung, „search and shopping providers“), Konzern, Behörden, Business-Admins; SCC/Angemessenheit |
| Training-Opt-out | https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt, …/5722486 | Settings > Data controls > „Improve the model for everyone“ aus; „new conversations won't be used“; alternativ Privacy Portal „do not train on my content“ |
| Temporäre Chats | …/8914046 | nicht im Verlauf, keine Memories, kein Training; Löschung binnen 30 Tagen (außer Sicherheits-/Rechtsgründe) |
| Memory | …/8590148 | „saved memories“ und „chat history“; im EWR ist erweitertes Memory („Reference chat history“) standardmäßig aus |
| Löschung | …/6378407, …/8983778 | Daten binnen 30 Tagen gelöscht, außer rechtliche Pflichten; gleiche E-Mail erst nach 30 Tagen wieder nutzbar |
| Export | …/7260999 | bis zu 7 Tage, Link 24 h gültig, ZIP |
| Werbung | https://help.openai.com/en/articles/20001047-ads-in-chatgpt, https://openai.com/index/chatgpt-ads-expands-across-europe/ | Nur Free/Go; Start Europa 24.08.2026 (31 Märkte inkl. DE); Ad Controls in den Einstellungen; ohne Personalisierung nur aktueller Chat; Werbedaten-Löschung binnen 30 Tagen; keine Gespräche an Werbetreibende |
| Werbung EWR: Einwilligung | Digiday, 18.08.2026 | Einwilligung als Rechtsgrundlage; kontextbezogen: „the live conversation and a rough location while chat history and memory are left out“ |
| NYT-Aufbewahrungsanordnung | Engadget 09.10.2025; Mashable 12.10.2025 | Anordnung vom 13.05.2025; Pflicht zur Aufbewahrung aller neuen Logs endete am 26.09.2025; bereits gesicherte Daten und von der NYT markierte Konten bleiben aufbewahrt |
| Garante (Italien) | https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10085432 | 15 Mio. €; „ha trattato i dati personali degli utenti per addestrare ChatGPT senza aver prima individuato un'adeguata base giuridica“; Abgabe an DPC als federführende Behörde |

## Widersprüche / nicht verifiziert

- **Werbung im EWR:** Die Hilfeseite „Ads in ChatGPT“ sagt laut Suchindex „Personalized ads are not initially available in the EEA or Switzerland“; Digiday (18.08.2026) beschreibt eine Einwilligungs-Wahl zwischen personalisiert und kontextbezogen. Content formuliert daher „personalisiert nur mit Einwilligung“ – das stimmt in beiden Lesarten.
- **NYT-Verfahren 2026:** Kein verlässlicher Beleg gefunden, dass sich die Lage nach Oktober 2025 geändert hat (Ausnahmen für markierte Konten bestehen fort). Ob bis Oktober 2026 weitere Anordnungen ergingen, ist offen.
- Status eines möglichen Rechtsmittels von OpenAI gegen die Garante-Entscheidung nicht geprüft; daher nur als Kontext im Training-Guide genannt.
- Deutsche UI-Bezeichnungen (z. B. für „Improve the model for everyone“, „Ad Controls“) nicht verifiziert – im Content englisch belassen.
- Ob „Improve the model for everyone“ für Erwachsene ab Werk an ist, wird von OpenAI nicht wörtlich gesagt, folgt aber aus dem Opt-out-Modell („unless you opt out“ / Abschalten in Data Controls).

## Offene Fragen

- Unternehmensdatensatz `openai`: EU-Einheit OpenAI Ireland Limited; federführende Aufsicht DPC Irland.
- Funktion „Health in ChatGPT“ (Hilfeseite existiert) nicht untersucht – relevant für `sensitivity`.

## Nachprüfung V2

Stand: 2026-10-07 · gerenderter Browser (Playwright/Chromium über den Proxy, `locale: 'de-DE'`, Viewport 1440×900, Desktop-User-Agent, `Accept-Language: de-DE`). Kein Archivdienst genutzt.

**Abruf:** Der erste Durchlauf mit `waitUntil: 'networkidle'` lief bei den meisten Seiten in Timeouts, bei anderen kam die Cloudflare-Seite „Nur einen Moment…“ (403). Geklappt hat dann: `domcontentloaded`, danach bis zu 60 s warten, bis der Seitentitel nicht mehr die Cloudflare-Prüfung zeigt, und denselben Browser-Kontext für mehrere Seiten weiterverwenden. Damit wurden alle acht englischen Hilfeartikel (7730893, 5722486, 8590148, 8914046, 8983778, 7260999, 6378407, 20001047), die EU-Datenschutzerklärung (de, „Updated: 24. August 2026“) und die Ankündigung „ChatGPT Ads wird in Europa ausgeweitet“ (de, mit Update vom 31.08.2026) vollständig gerendert und gelesen. Deutsche Hilfeartikel: 8914046, 8590148, 7260999, 6378407, 20001047 gerendert; 7730893 (Datenkontrollen, de) blieb in drei Versuchen bei der Cloudflare-Prüfung hängen.

**Ergebnis Anleitungen:** alle 6 auf `verified` mit Schritten aus den gerenderten Hilfeseiten. Deutsche UI-Bezeichnungen aus den deutschen Hilfeartikeln („Datenkontrollen“, „Das Modell für alle verbessern“, „Personalisierung“ > „Erinnerung“, „Werbeeinstellungen“, „Anzeigendaten löschen“, „Konto löschen“). Die Bezeichnungen in der App selbst wurden nicht gesehen (kein Konto). Die deutsche Werbe-Hilfeseite übersetzt „Change plan to go ad-free“ irreführend als „Abo wechseln, um das werbefreie Go-Abo zu nutzen“; maßgeblich ist die englische Fassung (Wechsel zu „Ads-Free“ im Tarif Free).

**Korrekturen gegenüber V1 (aus den gerenderten Seiten):**

| Thema | Vorher | Jetzt laut offizieller Seite |
|---|---|---|
| Werbung EWR | „uneinheitlich dokumentiert“ | Hilfeseite (en und de, Stand Anfang Oktober 2026): „Personalized ads are not initially available in the European Economic Area (EEA) or Switzerland.“ EU-Datenschutzerklärung (24.08.2026), Abschnitt 9: personalisierte Werbung auf Grundlage der Einwilligung, „wenn wir diese … einholen“; generische Werbung auf Grundlage berechtigter Interessen mit „Kontext Ihres aktuellen ChatGPT-Chats, Ihres Standorts und der Tageszeit“ (dazu Gerätetyp). Kein Widerspruch: Einwilligung ist vorgesehen, Personalisierung wird aber zunächst nicht angeboten. Digiday wird im Content nicht mehr als Beleg gebraucht. |
| Werbefrei | „nur bezahlte Tarife wie Plus oder Pro“ | Zusätzlich gibt es im Tarif Free eine werbefreie Option mit weniger Nachrichten und ohne einige Werkzeuge (Hilfeseite; EU-Datenschutzerklärung nennt „die kostenlose, werbefreie Option mit zusätzlichen Einschränkungen“). Guide `chatgpt-ad-controls` neu ausgerichtet: Werbedaten ansehen/löschen, werbefreie Variante. |
| Temporärer Chat | „nutzt und erstellt keine Erinnerungen“; Löschung „spätestens nach 30 Tagen“, länger aus Rechtsgründen | Personalisierte temporäre Chats *können* vorhandene Erinnerungen nutzen; sie erstellen keine. „OpenAI may keep a copy of a temporary chat for up to 30 days for safety purposes.“ |
| Training | – | Auch nach Opt-out: „If you choose to provide feedback [thumbs up/down], the entire conversation associated with that feedback may be used to train our models.“ In den Guide aufgenommen. |
| Daten von Werbetreibenden | linkability-Begründung: „Daten von Werbepartnern über dich sind nicht beschrieben“ | EU-Datenschutzerklärung, Abschnitt 1: „Wir erhalten Informationen von Werbetreibenden und anderen Datenpartnern … Zum Beispiel könnten wir von diesen Werbetreibenden Informationen über Käufe erhalten, die Sie tätigen.“ Daher neuer Datenpunkt `advertiser-data` (offplatform, partners), `linkability` 2 → 4 und `breadth` 3 → 4 nach Rubrik („Daten über dich von … Partnern“ bzw. „inkl. Daten aus anderen Quellen“). Die Ankündigung nennt zudem „OpenAI Pixel“ und eine „Conversions API“ für Werbetreibende. |
| Memory | – | Löschen eines Chats löscht eine daraus gespeicherte Erinnerung nicht; „Reference chat history“ aus → Gemerktes binnen 30 Tagen gelöscht. |
| Kontolöschung | – | Apple-Abos werden durch Kontolöschung nicht gekündigt. App-Schritte stehen auf separaten Artikeln (nicht geprüft). |
| Retention-URL | …/8983778-chat-and-file-retention-policies-in-chatgpt | leitet weiter auf …/8983778-chat-and-file-retention-in-chatgpt (Quelle angepasst). |

**Offen:** Die im Auftrag genannte Fassung der EU-Datenschutzerklärung „vom 2026-08-14“ wurde nicht gefunden; die gerenderte Seite trägt „Updated: 24. August 2026“ (eine „Vorherige Version“ ist verlinkt, nicht geprüft). Ob und wann OpenAI im EWR die Einwilligung für personalisierte Werbung abfragt, bleibt zu beobachten. Kontaktdaten-Abgleich (Adressbuch-Upload, Abschnitt 1) ist in der Datenschutzerklärung beschrieben, aber noch nicht als Datenpunkt erfasst.
