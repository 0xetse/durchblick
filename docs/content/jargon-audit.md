# Fachwort-Audit (Jargon-Audit)

Stand: 2026-10-07. Zielgruppe: kluge Erwachsene ohne Datenschutz-Vorwissen (Sprachniveau B1–B2). Grundregel: Ein Fachwort steht im Primärtext nur, wenn es vorher in Alltagssprache erklärt ist. Die genaue Fachformulierung darf ins Feld `technical` (Stufe 3) wandern.

## Vorgehen

- **Content:** alle YAML-Dateien unter `content/` außer `content/sources/`. Gezählt wird nur **Primärtext**: `title`, `detail`, `summary`, `text`, `goal`, `whyItMatters`, `whatChanges`, `whatDoesNotChange`, `rationale`, `recipient`, `intro`, `explanation`, `label`, `observedAs`, `description` sowie die Textfelder in `alternatives.yaml`. Nicht gezählt werden `technical`, `note`, `method`, `steps` und Quellen.
- **Zählstand:** nach der Überarbeitung von Google, YouTube, TikTok, Amazon, Simulator und Unternehmen (2026-10-07). Die Zahlen sind Treffer ohne Groß- und Kleinschreibung. „Server“ trifft auch „Browserverlauf“. Die Treffer bei Amazon sind deshalb Fehltreffer.
- **UI:** `src/i18n/de.ts`, `src/pages/**/*.astro`, `src/islands/*.tsx`. Nur lesend geprüft. Ersetzungsvorschläge stehen in Tabelle B, umsetzen muss sie das Lead-Team.

## A. Fachwörter im Content

| Begriff | Fundstellen (Datei: Anzahl im Primärtext) | Nötig? | Erklärung zuerst (Alltagssprache) | Entscheidung |
|---|---|---|---|---|
| Metadaten | alternatives.yaml: 5; tiktok.yaml: 0 (nur noch in `technical`) | nein | „Angaben rund um die Nachricht: wer, wann, an wen“ | In TikTok erledigt. In `alternatives.yaml` ersetzen oder in Klammern erklären, z. B. „Angaben wie Absender, Empfänger und Zeitpunkt (Metadaten)“. |
| Inferenz | 0 | nein | „Schluss“, „Einschätzung“, „was sich daraus ablesen lässt“ | Nicht verwenden. |
| Identifikator / Kennung | amazon.yaml: 4, guides/amazon.yaml: 2, google.yaml: 3, youtube.yaml: 1, alternatives.yaml: 2 | ja (kurz) | „eine feste Nummer, an der ein Gerät oder Browser wiedererkannt wird“ | Bleibt nur mit Erklärung im selben Datenpunkt (z. B. „Kennungen aus Cookies – kleinen Dateien …“). Bei Google, YouTube und Amazon erledigt. |
| Werbe-ID | tiktok.yaml: 0 (nur `technical`) | nein | „die Werbe-Nummer deines Handys“ | Erledigt. |
| Auftragsverarbeiter | 0 | nein | „Firmen, die im Auftrag und nach Anweisung des Anbieters mit Daten arbeiten“ | Nicht verwenden. Google-Empfänger heißt jetzt „Dienstleister im Auftrag von Google“. |
| Pixel / Tracking-Pixel | tiktok.yaml: 3, guides/tiktok.yaml: 1, facebook.yaml: 2, instagram.yaml: 2, guides/facebook.yaml: 1, guides/instagram.yaml: 1 | ja (Produktname) | „ein kleines, unsichtbares Code-Stück auf fremden Websites, das sogenannte Pixel“ | Bleibt, weil Anbieter es so nennen. Es muss bei der ersten Nennung im Abschnitt erklärt werden. TikTok und Meta haben das schon. |
| SDK | facebook.yaml: 1, instagram.yaml: 1, guides/instagram.yaml: 1 | nein | „Code-Bausteine, die App-Entwickler einbauen“ | Nur in Klammern nach der Erklärung (Meta macht das schon so). |
| Profiling / profilingbasiert | simulator.yaml: 0 (vorher 4) | nein | „Werbung nach einem Profil über dich auswählen“ | Im Simulator ersetzt. Gesetzesnähe bleibt über „(DSA Art. 26 Abs. 3)“. |
| Telemetrie | 0 | nein | „Nutzungs- und Fehlerdaten, die eine App automatisch sendet“ | Nicht verwenden. |
| dienstübergreifend / serviceübergreifend | guides/amazon.yaml: 1 + 1 | teils | „Daten aus einem Dienst werden in einem anderen genutzt“ | „serviceübergreifend“ steht nur noch im Titel der Amazon-Anleitung (Amazons eigener Begriff). „dienstübergreifend“ wird direkt danach erklärt. Sonst „über Dienste hinweg“ schreiben. |
| Werbe-Ökosystem / Ökosystem | alternatives.yaml: 5 | nein | „alle Geräte und Dienste eines Konzerns, die zusammenarbeiten“ | In `alternatives.yaml` ersetzen, z. B. „Teil der Apple-Welt aus Geräten und Diensten“. |
| Datenhändler / Data Broker | 0 | nein | „Firmen, die Daten über Menschen sammeln und verkaufen“ | Nicht verwenden. |
| Personalisierung / personalisiert | tiktok-Anleitung: 1, chatgpt.yaml: 1, alternatives.yaml: 4; „personalisierte Werbung“ häufig | teils | „auf dich zugeschnitten“, „passend zu dem, was der Dienst über dich weiß“ | „Personalisierte Werbung“ bleibt (Begriff in den Einstellungen). Das Hauptwort „Personalisierung“ nur, wenn es so in der Einstellung heißt (TikTok „Personalisierung von Anzeigen“, „personalisierte Suche“). |
| Hash / Hashwert / gehasht | whatsapp.yaml: 2, guides/whatsapp.yaml: 1, facebook.yaml: 1, instagram.yaml: 1; tiktok.yaml: 0 (nur `technical`) | nein | „unlesbar gemachte Form, die sich trotzdem abgleichen lässt“ | Bei TikTok erledigt. WhatsApp und Meta prüfen. |
| Cookies | google.yaml: 3, amazon.yaml: 3, guides/amazon.yaml: 1, facebook.yaml: 1, instagram.yaml: 1, whatsapp.yaml: 1, alternatives.yaml: 4 | ja | „kleine Dateien im Browser, an denen eine Website ihn wiedererkennt“ | Bleibt (Alltagswort durch Cookie-Banner). Bei der ersten Nennung im Datenpunkt einmal erklären. Für Google und Amazon erledigt. |
| IP-Adresse | in fast allen Diensten (google.yaml: 8, tiktok.yaml: 2 …), simulator.yaml: 2 | ja | „die Internet-Adresse deines Anschlusses“ | Bleibt. Bei der ersten Nennung pro Dienst, Anleitung und Simulator-Signal erklären. Bei Google, YouTube, TikTok, Amazon und im Simulator erledigt. |
| API / Schnittstelle | alternatives.yaml: 1 | nein | „Zugang für Programme, über den Firmen den Dienst nutzen“ | In `alternatives.yaml` mit Erklärung in Klammern. |
| Server | alternatives.yaml: 8, tiktok.yaml: 1 | teils | „Rechner des Anbieters im Internet“ | TikTok: „auf Rechnern (Servern)“. Sonst „bei Google speichern“ statt „auf Google-Servern“. |
| Algorithmus | alternatives.yaml: 1 | nein | „Rechenregel, nach der ausgewählt wird“ | Ersetzen. |
| Cloud | alternatives.yaml: 19, amazon.yaml: 1, whatsapp.yaml: 1, companies.yaml: 1, guides/youtube.yaml: 0 | teils | „Speicher im Internet“; bei Amazon: „Rechenleistung und Speicher, die Firmen mieten“ | „Cloud-Speicher“ als Kategoriename ok. Amazon: erklärt, und „Amazons Cloud“ ist im Primärtext durch „Amazons Rechner im Internet“ ersetzt. |
| Clickstream / Klickpfad | amazon.yaml: 0 (nur `technical`), guides/amazon.yaml: 0 | nein | „dein Weg durch die Website: was du in welcher Reihenfolge ansiehst“ | Erledigt. |
| Mouse-over | amazon.yaml: 0 | nein | „worauf du mit der Maus zeigst“ | Erledigt. |
| Scoring | amazon.yaml: 1 | ja (in Klammern) | „ein Punktwert dafür, wie wahrscheinlich du zahlst“ | Bleibt in Klammern nach der Erklärung. |
| Segment / In-Market / Affinität | simulator.yaml: 2 (nur in Klammern) | nein | „Zielgruppe für Werbung“ | Im Simulator ersetzt. Englische Google-Namen bleiben als Zitat. |
| Targeting | simulator.yaml: 0 | nein | „gezielte Werbung“ | Erledigt. |
| Demografie | simulator.yaml: 0 | nein | „Angaben wie Alter, Geschlecht, Einkommen“ | Erledigt. |
| anonymisiert / pseudonymisiert | google.yaml: 1, youtube.yaml: 1, guides/whatsapp.yaml: 1, alternatives.yaml: 4 | teils | „ohne Bezug zu dir als Person“ / „unter einer Nummer statt unter deinem Namen“ | Nur in Klammern nach der Erklärung. Bei Google, YouTube und Amazon erledigt. |
| personenbezogen / nicht personenbezogen | youtube.yaml: 1 (Zitat), alternatives.yaml: 1 | teils | „Angaben, die auf dich als Person verweisen“ | Google und YouTube umformuliert. „personenbezogene Daten“ bleibt nur als Zitat. |
| EWR | chatgpt.yaml: 10, google.yaml: 4, youtube.yaml: 4, tiktok.yaml: 3, companies.yaml: 2 u. a. | ja | „EU plus Island, Liechtenstein und Norwegen“ | Bleibt (rechtlich genau). In der UI einmal global erklären (siehe B), dazu einmal in `companies.yaml`. |
| DSA / DSGVO | simulator.yaml: 3 + 1, guides/tiktok.yaml: 1 + 1, alternatives.yaml: 4 | ja | „EU-Gesetz über digitale Dienste“ / „EU-Datenschutzgesetz“ | Bleibt als Rechtsbezug. Den vollen Namen bei der ersten Nennung in der Anleitung ausschreiben (TikTok erledigt). |
| berechtigtes Interesse | guides/amazon.yaml: 1, facebook.yaml: 1, instagram.yaml: 1, chatgpt.yaml: 1 | ja | „eine Rechtsgrundlage, für die der Anbieter keine Einwilligung braucht“ | Bei Amazon erklärt. Meta und ChatGPT prüfen. |
| Widerruf / widerrufen | guides/amazon.yaml: 0, guides/tiktok.yaml: 0 | nein | „Einwilligung zurücknehmen“ | Erledigt. |
| Synchronisierung | instagram.yaml: 5, alternatives.yaml: 7, google.yaml: 1, tiktok.yaml: 1, Anleitungen: 2 | teils | „Abgleich“ (Kontakte), „Abgleich zwischen Geräten“ (Chrome) | Wo es der App-Begriff ist (Chrome-Synchronisierung, „Kontaktsynchronisierung“), bleibt es. In TikTok-Texten steht jetzt „abgleichen“. |
| Werbetreibende / Publisher | facebook.yaml: 9, chatgpt.yaml: 8, instagram.yaml: 3, whatsapp.yaml: 1; google/youtube: 0 | nein | „Werbende“, „Firmen, die Werbung schalten“, „Website-Betreiber“ | Bei Google, YouTube und TikTok ersetzt. Für die anderen Dienste empfohlen. |
| Interaktion | youtube.yaml: 1 (Titel „Wie du … reagierst“ ok), alternatives.yaml: 1 | nein | „was du anklickst, likest, kommentierst“ | Durch Verben ersetzen. |
| Moderation | tiktok.yaml: 0 | nein | „Regelverstöße finden“ | Erledigt. |
| Ende-zu-Ende-Verschlüsselung | alternatives.yaml: 37, whatsapp.yaml: 4, instagram.yaml: 1 | ja | „nur Absender und Empfänger können mitlesen, auch der Anbieter nicht“ | Bleibt (Kernbegriff). Erklärung einmal pro Seite, am besten als UI-Hinweis (siehe B). |
| Tracking / Tracker | alternatives.yaml: 6 | teils | „Mitverfolgen, was du auf vielen Websites tust“ | In `alternatives.yaml` beim ersten Vorkommen erklären. „Tracking-Schutz“ ist ein Browser-Begriff und bleibt. |
| Drittanbieter / Drittanbieter-Cookies | alternatives.yaml: 4 | teils | „andere Firmen“ / „Cookies fremder Firmen, die auf vielen Websites eingebunden sind“ | Google-Anleitung: „andere Firmen“ (erledigt). „Drittanbieter-Cookies“ ist der Chrome-Menübegriff und bleibt mit Erklärung. |
| Opt-out / Opt-in | alternatives.yaml: 3 + 1 | nein | „du musst es selbst abschalten“ / „nur, wenn du zustimmst“ | In `alternatives.yaml` ersetzen. |
| Plattform | simulator.yaml: 7, tiktok.yaml: 4 | ja | „große Apps und Websites wie Google, Meta, TikTok“ | Bleibt. Das Wort ist verständlich und im DSA der Rechtsbegriff. |
| Datenprofil | 0 im Content | teils | „Einordnung in zehn Punkten“ | UI-Begriff, siehe B. |
| Ableitung / ableiten | 0 als Hauptwort, Verb verbreitet | teils | „schließen“, „schätzen“, „ablesen“ | Verb ok, wenn gemeint ist „aus Daten schließen“. Wo „schätzt“ genauer ist, „schätzt“ schreiben (TikTok, Amazon erledigt). |
| Herkunft | google.yaml: 1 („ethnische Herkunft“, fachlich nötig) | – | – | Im Content kein Jargon. UI-Begriff, siehe B. |
| Gewissheit | 0 im Content | nein | „Wie sicher ist das?“ | UI-Begriff, siehe B. |
| Mechanismus | 0 im Primärtext (nur Feldname `mechanisms`) | – | „Wie die Daten zum Dienst kommen“ | Nur ein Feldname, Anzeige über `de.mechanisms` (siehe B). |

## B. Fachwörter in UI-Texten (src/) mit Ersetzungsvorschlag

| Begriff | Wo (Datei: Anzahl) | Nötig? | Erklärung / Ersatz | Konkreter Vorschlag |
|---|---|---|---|---|
| Datenprofil | pages/methodik.astro: 2 (Titel, H2 „4. Datenprofil statt Punktzahl“); pages/dienste/[id].astro: 1 (H3 „Datenprofil“) | nein | Klingt nach „Profil über dich“. Gemeint ist aber unsere Einordnung des Dienstes | `dienste/[id].astro` H3: „Unsere Einordnung in 10 Punkten“. `methodik.astro` H2: „4. Einordnung statt Punktzahl“, Titel: „Methodik: Quellen, Sicherheit der Aussagen, Einordnung“. Anker `#datenprofil` darf bleiben. |
| Herkunft | pages/methodik.astro: 2 (H2 „2. Herkunft: Wie kommen Daten zustande?“, Absatz Z. 38); pages/datenschutz.astro: 1 / transparenz.astro: 1 („Herkunftsangabe (Referrer)“) | teils | Frage statt Fachwort | methodik H2: „2. Woher stammen die Daten?“. Z. 38: „Ein Inhalt ohne Angabe, woher die Daten stammen, wie sicher die Aussage ist und welche Quelle sie belegt, lässt sich gar nicht veröffentlichen …“. Datenschutz und Transparenz: „Wir verraten der anderen Seite nicht, dass du von Durchblick kommst (kein „Referrer“).“ |
| Gewissheit / Gewissheitsstufen | pages/methodik.astro: 3; pages/spuren.astro: 1 (Meta-Beschreibung); islands/PlanView.tsx: 1 („**Gewissheit**: Schritte, die wir … geprüft haben“) | nein | „Wie sicher ist das?“ | methodik H2: „3. Wie sicher ist die Aussage?“. spuren.astro description: „… mit Angabe, wie sicher die Einschätzung ist, und mit Belegen.“ PlanView: „**Geprüft**: Schritte, die wir an der offiziellen Hilfe geprüft haben, kommen bei Gleichstand zuerst.“ |
| Mechanismus | i18n/de.ts: nur Typname; sichtbar als „Wie:“ in dienste/[id].astro | – | – | Kein Handlungsbedarf. Optional „Wie:“ → „So kommt es zum Dienst:“. |
| Ableitung / „Was sich daraus ableiten lässt“ | pages/dienste/[id].astro: 1 (H3) | teils | „schließen“ | H3: „Was der Dienst daraus über dich schließen kann“. |
| Datenpunkte | pages/dienste/[id].astro: 1 („Vereinfachte Zusammenfassung der in Frage 1 belegten Datenpunkte.“) | nein | „Angaben“ | „Vereinfachte Zusammenfassung der Angaben aus Frage 1.“ |
| Dimensionen / Rubrik | pages/methodik.astro: 2 („in zehn Dimensionen“, „Stufenbeschreibung (Rubrik)“) | nein | „Punkte“, „Bewertungsraster“ | „… ordnen wir jeden Dienst in zehn Punkten ein, jeweils in vier Stufen …“. „Die genaue Beschreibung der Stufen ist öffentlich im Quellcode dokumentiert.“ |
| Sensibilität | i18n/de.ts: 1 (`dimensions.sensitivity.label`) | teils | „Wie privat“ | Label: „Wie privat“ (Frage bleibt). |
| Beobachtung | i18n/de.ts: 1 (`dimensions.observation.label`) | teils | „Aufzeichnung“ | Label: „Aufzeichnung“. |
| Werbenutzung | i18n/de.ts: 1 (`dimensions.adUse.label`) | teils | – | Label: „Nutzung für Werbung“. |
| Datensparsam | i18n/de.ts: 1 (`dimensions.defaults.question`) | teils | „sammelt wenig“ | „Wie wenig wird ab Werk gesammelt?“ |
| Verarbeitungen | i18n/de.ts: 1 (`dimensions.controls.question`) | nein | – | „Lässt sich das Wichtigste abschalten oder begrenzen?“ |
| Beobachtet / Berechnet (Herkunfts-Badges) | i18n/de.ts: `provenance.*` | ja | Hinweise sind schon gut | `provenance.derived.hint`: „… z. B. ungefährer Ort aus der IP-Adresse (der Internet-Adresse deines Anschlusses).“ |
| „Vom Anbieter beschrieben“ / „Vom Dienst berechnet“ | i18n/de.ts | ja | ok | Keine Änderung. |
| Tracking / Tracker | i18n/de.ts: 2 (`site.description` „ohne Tracking“, `nav.trustBadge` „Keine Tracker“); islands/TrustPanel.tsx: 2; pages/index.astro: 1 | teils | „Werkzeuge, die mitverfolgen, was du tust“ | Badge bleibt kurz („Keine Tracker“). TrustPanel `<dt>`: „Tracker (Mitverfolgen) und Werbung“. `site.description`: „Ohne Konto, ohne Mitverfolgen.“ |
| Cookies | i18n/de.ts: 1; pages/index.astro: 2; datenschutz.astro: 1; transparenz.astro: 2; islands/TransparencyLive.tsx: 3 sichtbar; TrustPanel.tsx: 1 sichtbar | ja | „kleine Dateien, mit denen Websites dich wiedererkennen“ | Einmal erklären, am besten auf transparenz.astro, H3 „Cookies“ in TransparencyLive: Untertitel „kleine Dateien, mit denen Websites deinen Browser wiedererkennen“. |
| Server / fremde Server | pages/index.astro: 2; datenschutz.astro: 2 (inkl. H2 „Server-Zugriffsdaten“); transparenz.astro: 4; islands/TransparencyLive.tsx: 2; TrustPanel.tsx: 1; PlanView.tsx: 1 | teils | „Rechner anderer Firmen im Internet“ | index.astro Statistik: „0 Verbindungen zu anderen Firmen“. datenschutz H2: „Was beim Aufruf der Seite anfällt“. Sonst „Server“ beim ersten Vorkommen pro Seite erklären: „Server (die Rechner, die Websites ausliefern)“. |
| IP-Adresse | i18n/de.ts: 1; datenschutz.astro: 1; transparenz.astro: 1 | ja | „die Internet-Adresse deines Anschlusses“ | transparenz.astro Z. 26: „… deine IP-Adresse (die Internet-Adresse deines Anschlusses) …“. Für datenschutz.astro genauso. |
| Hosting / Hosting-Anbieter | datenschutz.astro: 1; transparenz.astro: 2 | ja | „die Firma, auf deren Rechnern diese Website liegt“ | transparenz.astro: „… der Server, der die Dateien ausliefert (die Firma, bei der diese Website liegt, „Hosting“) …“. |
| lokaler Speicher / Zwischenspeicher | datenschutz.astro: 2; TransparencyLive.tsx: 2; PlanView.tsx: 1 | ja | ok, schon alltagsnah | Keine Änderung. |
| Kennungen | islands/PlanView.tsx: 1 („Gespeichert würden nur die Kennungen der erledigten Schritte …“) | nein | – | „Gespeichert würden nur Kürzel für die erledigten Schritte und deine Apps …“. |
| Referrer | datenschutz.astro: 1; transparenz.astro: 1 | nein | siehe „Herkunft“ | siehe oben. |
| Netzwerkanfragen / Reiter „Netzwerk“ | transparenz.astro: 1 (Meta-Beschreibung); TransparencyLive.tsx: 1 | teils | „Verbindungen, die dein Browser aufbaut“ | transparenz description: „Live-Ansicht: Verbindungen, Cookies und gespeicherte Daten dieser Website …“. Der Reiter „Netzwerk“ bleibt (echter Menüname). |
| Primärquellen / Sekundärquellen | methodik.astro: 2; dienste/[id].astro: 1 | teils | „Quellen direkt vom Anbieter oder von Behörden“ | dienste/[id].astro: „Wir nutzen vor allem Quellen direkt vom Anbieter (Datenschutzerklärung, Hilfeseiten), von Behörden und Gesetze.“ |
| Signale | pages/spuren.astro: 1 sichtbar („sehr viel mehr Signalen“) | nein | „Spuren“, „Hinweise“ | „… mit sehr viel mehr Spuren“. |
| Plattformen / Online-Plattformen | islands/Spuren.tsx: 1; i18n/de.ts: 1 (`simLevels.documented`) | ja | ok | Spuren.tsx Hinweis: „Sensibles Thema: In der EU dürfen große Online-Plattformen Werbung nicht nach einem Profil auswählen, das auf solchen besonders geschützten Daten beruht. Technisch möglich bleibt der Schluss trotzdem.“ |
| Datenreise | islands/DataJourney.tsx: 1 (aria-label) | ja | bildhaft und verständlich | Keine Änderung. |
| EWR | nicht in UI | – | „EU plus Island, Liechtenstein und Norwegen“ | Vorschlag: im Glossar oder in der Methodik einmal erklären, weil viele Content-Texte „im EWR“ sagen. |
| Ende-zu-Ende-Verschlüsselung | nur Content (`alternatives.astro` zeigt `encryption`) | ja | „nur Absender und Empfänger können mitlesen“ | Vorschlag: in `alternativen.astro` über der Tabelle eine Zeile „Ende-zu-Ende-verschlüsselt = nur Absender und Empfänger können mitlesen, auch der Anbieter nicht.“ |

## C. Offene Punkte für andere Content-Dateien

- [x] `content/alternatives.yaml` (erledigt 2026-10-07): Metadaten → „Begleitdaten (Metadaten)“, Ökosystem → „Angebot“/„weitere Dienste aus einer Hand“, Tracking/Tracker und Drittanbieter-Cookies erklärt („Cookies fremder Firmen“, „verfolgen dich über Websites“), Opt-out → „widersprechen (Opt-out)“, API → „Zugang für andere Programme (API)“, Werbealgorithmus umschrieben, Server → „Rechner“, Ende-zu-Ende je Produkt erklärt („nur Absender und Empfänger können mitlesen“ bzw. „der Anbieter kann nicht mitlesen“). Offen: Die Felder `tradeOffs` blieben unangetastet und enthalten noch „Tracking-Schutz“ (Chrome) und „Opt-out“ (ChatGPT).
- [x] `content/services/facebook.yaml`, `instagram.yaml`, `whatsapp.yaml`, `chatgpt.yaml` und zugehörige Guides (erledigt 2026-10-07): „Werbetreibende“ → „Werbekunden“ (wörtliche Zitate in `sources.note` unverändert). „Hashwert“ erklärt als „eine Art verschlüsselter Fingerabdruck der Nummer“ (WhatsApp-Dienst und -Guide). „berechtigtes Interesse“ erklärt (ChatGPT, Widerspruchshinweis war schon vorhanden). Facebook/Instagram „berechtigte Zwecke“ (Speicherdauer) bewusst belassen.
