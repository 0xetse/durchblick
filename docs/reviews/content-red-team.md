# Red-Team-Review der Inhalte

Stand: 2026-10-07 · Prüfumfang: `content/services/*.yaml`, `content/guides/*.yaml`, `content/simulator.yaml`, `content/alternatives.yaml`, `content/companies.yaml`, Quellen in `content/sources/`, Recherche-Notizen in `docs/research/`. Maßstab: `docs/content/assessment-methodology.md`, `docs/content/content-guidelines.md`, `src/domain/schema.ts`.

*Keine Rechtsberatung. Punkte mit rechtlicher Tragweite stehen unter „Offene Punkte“ und brauchen eine menschliche bzw. anwaltliche Entscheidung.*

## Zusammenfassung

Der Inhalt ist insgesamt sorgfältig: Ableitungen sind fast überall sauber als `possible` markiert und ausdrücklich als „technische Möglichkeit, keine dokumentierte Praxis“ formuliert, Anleitungen ohne bestätigte Schritte stehen konsequent auf `needs-verification` mit leeren `steps`, und Alarmsprache („Datenkrake“, „ausspionieren“) kommt nicht vor. Die Datenprofile sind weitgehend rubrikkonform.

Die gewichtigsten Funde:

1. **Veralteter, rechtlich heikler Beleg (behoben):** Der ChatGPT-Trainings-Guide stützte sich auf das 15-Mio.-€-Bußgeld der italienischen Datenschutzbehörde. Laut Berichterstattung hat das Tribunale di Roma diesen Bescheid am 18. März 2026 aus Zuständigkeitsgründen aufgehoben. Den Satz haben wir entfernt.
2. **„darf“-Formulierungen bei ChatGPT (behoben):** „Ohne Widerspruch darf OpenAI …“ ist eine rechtliche Wertung, keine dokumentierte Tatsache. Jetzt heißt es „nutzt/kann … laut eigenen Angaben“.
3. **TikTok: veralteter Verfahrensstand und fehlende China-Speicherung (behoben):** Der Hinweis „Rechtsstreit läuft noch“ war unscharf. Außerdem fehlte, dass die irische Datenschutzbehörde (DPC) selbst schreibt, TikTok habe im April 2025 eingeräumt, dass begrenzte EWR-Daten auf Servern in China lagen.
4. **WhatsApp: Werbestart in der EU als Tatsache, belegt nur über eine Tier-2-Ankündigung (behoben):** Die Formulierung ist jetzt „angekündigt“ und zusätzlich mit der EWR-Richtlinie belegt. Die Aussage „WhatsApp kann Chats nicht lesen“ steht jetzt mit „laut WhatsApp“.
5. **ChatGPT-Werbung im EWR widersprüchlich dokumentiert (teilweise behoben):** Laut Hilfeseite sind personalisierte Anzeigen im EWR „zunächst nicht verfügbar“, laut Digiday gibt es eine Einwilligungsabfrage. Das wird jetzt offen benannt.
6. **Meta-Datenschutzrichtlinie nur in der US-Fassung abgerufen (offen):** Facebook und Instagram stützen fast alle Aussagen darauf. Methodisch soll aber das EU-Standardverhalten bewertet werden.

Geändert haben wir rund 20 Stellen in 14 Content-Dateien, alles Formulierungs- oder Präzisierungsfixes (RT-01 bis RT-16). **Keine Datenprofil-Stufe wurde geändert**, weil es für keine Abweichung eine eindeutige Rubrik- und Quellenbasis gab. Sie stehen als Vorschläge unten. `npx vitest run tests/content` läuft grün (49/49).

## Stichproben gegen Primärquellen (WebFetch, 2026-10-07)

| # | Aussage | Quelle | Ergebnis |
|---|---|---|---|
| 1 | TikTok: 485 Mio. € wegen Übermittlungen, Gesamt 530 Mio. €, 2. Mai 2025 | DPC-Pressemitteilung | bestätigt; zusätzlich: TikTok räumte China-Speicherung ein (fehlte im Content → ergänzt) |
| 2 | TikTok-Verfahrensstand Juni 2026 | Irish Times 30.06.2026 | High Court bestätigt Feststellungen/Bußgeld, Aussetzungsanordnung neu zu prüfen → Content präzisiert |
| 3 | Meta: Unternehmen dürfen trotz Einstellung weiter Daten senden; Anonymisierung/Produktverbesserung | Facebook-Hilfe 568137493302217 | bestätigt |
| 4 | Weniger personalisierte Werbung: Datenliste | Facebook-Hilfe 825123042877166 | bestätigt (Werbeinteraktionen, Alter/Geschlecht/Standort, Gerät, Sitzungsinhalt) |
| 5 | Facebook-Guide „weniger personalisierte Werbung“: Menüpfad | Facebook-Hilfe 468797095528474 | bestätigt, EU-spezifischer Artikel |
| 6 | Meta-KI-Training: öffentliche Inhalte Erwachsener, Meta-AI-Interaktionen, Update zu geteilten Nachrichten | Meta Newsroom 04/2025 | bestätigt |
| 7 | DMA-Zusage: Wahl „weniger personalisiert“ ab Januar 2026 | EU-Kommission (DMA-Seite) | bestätigt |
| 8 | WhatsApp: 120 Tage Inaktivität, 30 Tage für nicht zustellbare Nachrichten, Fassung 2. Juli 2026 | WhatsApp-EWR-Richtlinie | bestätigt |
| 9 | WhatsApp: EU-Werbung „hat begonnen“ | PPC Land (Tier 2) | Quelle sagt nur „in the coming weeks“ → Content abgeschwächt; die EWR-Richtlinie erwähnt Anzeigen in Status/Kanälen |
| 10 | Google: keine personalisierte Werbung nach sensiblen Kategorien; KI-Training mit öffentlich verfügbaren Daten; Fassung 1. Oktober 2026 | Google-Datenschutzerklärung | bestätigt |
| 11 | Google: Alter/Geschlecht „angegeben oder abgeleitet“; Partnerwerbungs-Schritte | Mein-Anzeigen-Center-Hilfe | bestätigt; die Hilfe verlinkt direkt `adssettings.google.com/partnerads` → officialUrl korrigiert |
| 12 | Zeitachse standardmäßig aus, Speicherung auf dem Gerät, verschlüsselte Sicherung | Google-Maps-Hilfe 6258979 | bestätigt; „3 Monate Auto-Löschen beim Einschalten“ steht dort **nicht** (nur im Blog von 2023) |
| 13 | YouTube: Standortschätzung, „verkauft keine personenbezogenen Daten“ | YouTube-Hilfe 10364219 | bestätigt |
| 14 | Instagram: Kontakte, keine Einzellöschung, nur am Computer, 90 Tage | Instagram-Hilfe 236691729788553 | bestätigt |
| 15 | ChatGPT-Werbung in Europa: Start August 2026, Free/Go, Einwilligung | Digiday; Euronews/TechRepublic (Suche) | Start bestätigt; EWR-Personalisierung widersprüchlich berichtet |
| 16 | Garante-Bußgeld gegen OpenAI | Suche (u. a. Reuters über freevacy, digitalpolicyalert) | **am 18.03.2026 aufgehoben** → aus dem Guide entfernt |
| – | Amazon-Werbehinweis, OpenAI-Hilfeseiten | – | nicht abrufbar (HTTP 503 bzw. 403), nicht geprüft |

## Befunde

| ID | Datei / Stelle | Problem | Schwere | Status / Änderung |
|---|---|---|---|---|
| RT-01 | `guides/chatgpt.yaml` › `chatgpt-training-opt-out.whyItMatters` | Beruft sich auf den Garante-Bescheid 2024, der laut Berichterstattung im März 2026 gerichtlich aufgehoben wurde. Eine Behördenbeanstandung als Tatsache darzustellen, die nicht mehr besteht, ist ein Äußerungsrisiko. | hoch | **behoben:** Satz und Quellenverweis entfernt; Hinweis im Quelleneintrag `chatgpt-garante-2024` ergänzt (nicht mehr als Beleg verwenden) |
| RT-02 | `services/chatgpt.yaml` › `summary`, `surprise`; `guides/chatgpt.yaml` › `chatgpt-training-opt-out.whyItMatters` | „darf OpenAI … nutzen“ ist eine rechtliche Wertung (Zulässigkeit), keine Tatsache. | hoch | **behoben:** „nutzt/kann … laut eigenen Angaben“ |
| RT-03 | `services/tiktok.yaml` › `surprise` | „Rechtsstreit läuft noch“ ist unscharf. Der High Court hat laut Bericht die Feststellungen bestätigt, nur die Aussetzungsanordnung wird neu geprüft. „Beanstandet“ ohne den Gegenstand. | mittel | **behoben:** Verfahrensstand mit „laut Berichten“ präzisiert |
| RT-04 | `services/tiktok.yaml` › `sharing.corporate-group` | Laut DPC hat TikTok im April 2025 eingeräumt, dass begrenzte EWR-Daten entgegen früheren Angaben auf Servern in China gespeichert waren. Der Content nannte nur USA, Malaysia und Singapur – Whitewashing durch Weglassen. | mittel | **behoben:** ergänzt, als Aussage der DPC und mit TikToks Angabe zur Löschung |
| RT-05 | `services/whatsapp.yaml` › `businessModel` | „2026 hat Meta begonnen, Werbung … in der EU einzuführen“ stützt sich auf PPC Land (Tier 2), und die Quelle spricht nur von einer Ankündigung. | mittel | **behoben:** „im März 2026 angekündigt“ plus Tier-1-Beleg aus der EWR-Richtlinie |
| RT-06 | `services/whatsapp.yaml` › `summary`, `wa-message-content.title` | „WhatsApp kann sie nicht lesen“ steht als absolute Tatsache da, obwohl Belege wie bei Anbieter-Zusagen nur Anbieteraussagen sind. Ausnahmen (Meldungen, Meta AI, Backups) fehlen im Titel. | mittel | **behoben:** „laut WhatsApp“. Ausnahme „Meldungen“ offen (siehe O-05) |
| RT-07 | `guides/whatsapp.yaml` › `whatsapp-request-account-info.whatDoesNotChange` | „Nachrichten … liegen nur auf deinen Geräten“ ignoriert Cloud-Backups und die Zwischenspeicherung bis zur Zustellung. | niedrig | **behoben:** „nach der Zustellung … und ggf. in deinem Backup“ |
| RT-08 | `services/chatgpt.yaml` › `ad-interactions`, Ableitung `ad-topics`; `guides/chatgpt.yaml` › `chatgpt-ad-controls` | Die Personalisierung über frühere Chats/Erinnerungen ist als für EU-Nutzer geltend dargestellt. Die Hilfeseite sagt aber, personalisierte Anzeigen seien im EWR „zunächst nicht verfügbar“ (Widerspruch zu Digiday). | mittel | **behoben:** „laut OpenAI“ ergänzt, Widerspruch offen benannt. Endgültige Klärung offen (O-02) |
| RT-09 | `services/amazon.yaml` › Ableitung `credit-risk.title` | „Amazon bewertet dein Kreditrisiko.“ ist absolut formuliert; die Quelle sagt „gegebenenfalls“, je nach Zahlungsart. | niedrig | **behoben:** „Amazon kann dein Kreditrisiko bewerten.“ |
| RT-10 | `guides/facebook.yaml`, `guides/instagram.yaml` › `whatChanges` (Partnerdaten, KI-Widerspruch) | Die Wirkung ist als Tatsache formuliert, obwohl sie nur als Zusage von Meta belegt ist (und nicht von außen prüfbar). | niedrig | **behoben:** „laut Meta“ / „laut eigener Aussage“ |
| RT-11 | `guides/tiktok.yaml` › `tiktok-personalised-ads.whatChanges`; `guides/amazon.yaml` › `amazon-cross-service.whatChanges` | Dasselbe Muster: Die Wirkung einer Einstellung ist ohne Zuschreibung zum Anbieter formuliert. | niedrig | **behoben:** „Laut TikTok“ / „laut eigenem Hinweis“ |
| RT-12 | `guides/google.yaml` › `google-partner-activity` | `verified` mit dem Methodenvermerk „Lage im Menü nicht selbst geprüft“; officialUrl führte nur allgemein zu Mein Anzeigen-Center. | niedrig | **behoben:** Schritte und Labels gegen die Hilfe geprüft (wörtlich identisch), officialUrl → `adssettings.google.com/partnerads`, Methode aktualisiert |
| RT-13 | `simulator.yaml` › Ableitung `gesundheitsbewusst`, Takeaway 3 | „In der EU ist Werbung … mit Gesundheitsdaten ohnehin untersagt“ ist zu weit gefasst: Art. 26 Abs. 3 und Art. 28 Abs. 2 DSA gelten für **Online-Plattformen**, nicht für jede Werbung. | mittel | **behoben:** auf „Online-Plattformen dürfen … nicht“ präzisiert |
| RT-14 | `simulator.yaml` › Takeaway 2 | „Mein Werbecenter“ weicht vom Google-Namen „Mein Anzeigen-Center“ ab, der sonst überall im Content steht. | niedrig | **behoben** |
| RT-15 | `alternatives.yaml` › `messaging.incumbent.tradeOffs` | „Metadaten fließen dort [bei Meta] ein“ widerspricht `services/whatsapp.yaml`: Meta-Unternehmen arbeiten als Dienstleister, eigene Personalisierung gibt es nur mit Kontenübersicht. Das ist eine pauschale, vorwurfsnahe Aussage. | mittel | **behoben:** an die WhatsApp-Dienstseite angeglichen |
| RT-16 | `services/instagram.yaml` › Ableitung `ig-content-preferences.title` | „welche Inhalte dich fesseln“ ist leicht wertend (Suchtnarrativ). | niedrig | **behoben:** „interessieren“ |
| RT-17 | `services/google.yaml` › `retention` | „Wer die Zeitachse neu einschaltet, startet mit 3 Monaten“ ist nur im Blog von 12/2023 belegt; die aktuelle Hilfeseite nennt keine Standardfrist. | niedrig | offen (O-08) |
| RT-18 | `services/facebook.yaml`, `services/instagram.yaml` (fast alle Datenpunkte) | `meta-privacy-policy` wurde aus einem US-Netz abgerufen (US-Regionalhinweis, EU-Rechtsgrundlagen nicht sichtbar). Die Methodik verlangt aber das EU-Standardverhalten. | mittel | offen (O-01) |
| RT-19 | `alternatives.yaml` › `startpage` (Eigentümer System1 „Werbetechnik-Unternehmen“), `firefox` (85 % Umsatz über Google), `nebula` (Preis) | Diese Aussagen über Anbieter stehen nur auf Tier-3-Quellen (Wikipedia, Blog, Resubs). Das verstößt gegen die Leitlinie, dass Tier 3 nie alleiniger Beleg sein darf. | mittel | offen (O-06) |
| RT-20 | `services/tiktok.yaml` › `assessment.reachability` | Die Begründung stützt sich teils darauf, dass *unsere* Abrufe scheiterten. Das ist kein Rubrikkriterium (Auffindbarkeit für Nutzer). | niedrig | offen (A-03) |
| RT-21 | Datenprofile `google.defaults` (3) vs. `youtube.defaults` (2) | Gleiches Konto, gleiche EWR-Verknüpfungsabfrage. Der Unterschied beruht nur auf 18 vs. 36 Monaten Auto-Löschen; die YouTube-Begründung erwähnt die Verknüpfungsabfrage nicht. | niedrig | offen (A-01) |
| RT-22 | Datenprofil `chatgpt.sharing` (2) | Vergleichbare Dienste mit Werbekunden (aggregierte Berichte) und Integrationen stehen auf 3. Seit August 2026 hat ChatGPT Werbekunden und App-Integrationen. | mittel | offen (A-02) |

Bewusst **nicht** beanstandet: der Satz „Meta teilt … konzernweit“ (belegt), die Simulator-Ableitungen mit `documented` (gestützt auf Googles öffentliche Segmentlisten; Google ist im Text als dokumentierender Anbieter genannt), die TikTok-Formulierung „laut TikTok eingeschränkt per Fernzugriff“ (Anbieterzitat plus Behördenentscheidung).

## Konsistenz der Datenprofile

Matrix (Stufe + Konfidenz h/m/l):

| Dienst | breadth | sensitivity | observation | linkability | adUse | sharing | defaults | controls | deletion | reachability |
|---|---|---|---|---|---|---|---|---|---|---|
| Amazon | 4h | 3m | 4m | 4h | 3h | 3h | 2m | 3h | 3h | 3m |
| ChatGPT | 3m | 4h | 3m | 2m | 2m | 2m | 2m | 3m | 3m | 3l |
| Facebook | 4h | 3m | 4h | 4h | 4h | 3m | 2m | 3m | 3m | 3m |
| Google | 4h | 3m | 3h | 4h | 4h | 3m | 3m | 3h | 4h | 4m |
| Instagram | 4h | 3m | 4h | 4h | 4h | 3m | 2m | 3m | 3m | 3m |
| TikTok | 4h | 3m | 4h | 4h | 4m | 3m | 2l | 3m | 3l | 2l |
| WhatsApp | 3h | 2m | 3h | 3m | 2m | 2m | 3m | 3m | 4m | 3m |
| YouTube | 4m | 3m | 4h | 4h | 4h | 3m | 2m | 3h | 4h | 3m |

Die meisten Stufen folgen der Rubrik konsistent: `linkability` 4 bei allen, die Daten von fremden Websites erhalten (Meta, Google, TikTok, Amazon über Partner-Shops); `observation` 4 bei Feed-/Klickpfad-Diensten (inkl. Amazon mit Mouse-over, analog zu Metas Mausbewegung); `sensitivity` 4 nur bei ChatGPT (Gespräche mit KI, explizit in der Rubrik genannt). Vorschläge zur Angleichung:

| ID | Dimension | Aktuell | Vorschlag | Begründung |
|---|---|---|---|---|
| A-01 | `youtube.defaults` vs. `google.defaults` | 2 vs. 3 | beide 3 **oder** beide 2; mindestens die EWR-Verknüpfungsabfrage auch in der YouTube-Begründung nennen | Gleiche Fakten (Auto-Löschen ab Werk, EWR-Verknüpfungswahl) → gleiche Stufe. Wenn 36 Monate bewusst nicht als „schützend“ zählen sollen, muss das in der Rubrik stehen. |
| A-02 | `chatgpt.sharing` | 2 | 3 (medium) | Rubrik 3 = „zusätzlich Partner/Werbekunden (meist aggregiert) oder Integrationen“. Seit August 2026 Werbung; App-/Connector-Integrationen. Voraussetzung: Tier-1-Beleg, dass Werbetreibende aggregierte Berichte erhalten (OpenAI-Hilfe war nicht abrufbar). |
| A-03 | `tiktok.reachability` | 2 (low) | nach App-Prüfung neu einstufen, vermutlich 3 | TikTok bündelt Optionen unter „Einstellungen und Datenschutz“; das Scheitern unserer Abrufe ist kein Kriterium. Ohne Prüfung in der App bleibt 2/low vertretbar, die Begründung sollte aber den Nutzerblick beschreiben. |
| A-04 | `google.reachability` (4) vs. `youtube.reachability` (3) | 4 vs. 3 | prüfen | Gleiche Kontoeinstellungen (Privatsphärecheck, Mein Anzeigen-Center) gelten auch für YouTube. Der Unterschied ist vertretbar, wenn er auf der App-Navigation beruht; das sollte dann in der Begründung stehen. |
| A-05 | `instagram.sensitivity` | 3 | 3 lassen, aber prüfen | Falls Instagram-Direktnachrichten im EWR standardmäßig nicht Ende-zu-Ende-verschlüsselt sind und Meta Inhalte verarbeiten kann, deutet die Rubrik („Nachrichteninhalte, die der Anbieter verarbeiten kann“) auf 4. Gleiche Logik bei TikTok (Inhalt „laut Datenschutzerklärung erfasst“) – dort ist 3 mit „nicht Kern der Nutzung“ begründet. Bitte eine einheitliche Regel festlegen. |

## Offene Punkte (menschliche bzw. rechtliche Entscheidung)

- **O-01 Meta-EU-Fassung:** `meta-privacy-policy` aus einem EU-Netz neu abrufen (EU-Rechtsgrundlagen, Meta Platforms Ireland) und die Facebook- und Instagram-Datenpunkte dagegen prüfen. Bis dahin ist die Konfidenz `high` bei `observation`/`breadth` streng genommen zu hoch.
- **O-02 ChatGPT-Werbung im EWR:** Klären, ob personalisierte Anzeigen im EWR aktiv sind (EU-Datenschutzerklärung vom 14.08.2026 direkt lesen). Davon hängen `ad-interactions`, `ad-topics` (`documented` für EU-Nutzer?) und der Guide `chatgpt-ad-controls` ab.
- **O-03 Garante/OpenAI:** Wir haben den Hinweis entfernt. Ob der Content den Vorgang überhaupt erwähnen soll (etwa „aufgehoben aus Zuständigkeitsgründen, Verfahren bei der DPC“), ist eine redaktionelle und rechtliche Entscheidung. Primärquelle (Urteil oder Reuters) beschaffen. Der Quelleneintrag `chatgpt-garante-2024` ist derzeit nirgends referenziert und könnte gelöscht werden.
- **O-04 TikTok-Verfahren:** Die Aussage zum High-Court-Urteil stützt sich auf die Irish Times (Tier 2). Vor Veröffentlichung gegen das Urteil bzw. eine DPC-Mitteilung prüfen, ob „Feststellungen bestätigt“ (inkl. Bußgeld) exakt stimmt, und ob die DPC bis Oktober 2026 neu entschieden hat. Ein Äußerungsrisiko besteht bei Aussagen über Rechtsverstöße eines Unternehmens, die noch nicht rechtskräftig sind; der Content formuliert daher mit „laut Berichten“.
- **O-05 WhatsApp-Meldungen:** WhatsApp-Hilfeartikel (Tier 1) suchen, der bestätigt, dass beim Melden die letzten Nachrichten an WhatsApp gehen. Dann als Ausnahme in `wa-message-content` aufnehmen; ohne sie ist „kann nicht lesen“ unvollständig (derzeit nur Tier-2/3-Belege gefunden).
- **O-06 Tier-3-Alleinbelege in `alternatives.yaml`:** Startpage/System1 (Wikipedia), Firefox-Umsatzanteil (Blog), Nebula-Preis (Resubs). Entweder Tier-1/2-Beleg ergänzen (Startpage-Blog zur Beteiligung 2019, Mozilla-Jahresbericht) oder die Aussage streichen. Besonders „Werbetechnik-Unternehmen“ ist eine Charakterisierung eines Dritten und sollte belegt oder neutral formuliert werden.
- **O-07 Rangfolge-Wirkung:** Die Matrix oben ist nur für die interne Prüfung gedacht. Sie darf nicht in die Oberfläche (Methodik Regel 3: keine Rangliste).
- **O-08 Google-Zeitachse:** Die 3-Monats-Voreinstellung in einer aktuellen Hilfeseite bestätigen oder streichen.
- **O-09 Meta AI und Werbung:** Seit dem 16.12.2025 nutzt Meta KI-Chats „in den meisten Regionen“ für Werbung, laut Recherche-Notiz für die EU nicht verifiziert. Den EU-Status prüfen, weil er `fb-meta-ai`/`ig-meta-ai` und `controls` berührt.
- **O-10 Datenprofil-Angleichungen A-01 bis A-05:** Redaktionelle Entscheidung, gegebenenfalls mit einer Präzisierung der Rubrik (Zählt ein Auto-Löschen nach 36 Monaten als „schützend“? Wie werden nicht E2E-verschlüsselte Direktnachrichten bei der Sensibilität gewichtet?).

## Prüfung

- `npx vitest run tests/content`: 3 Testdateien, 49 Tests grün.
- Nicht verändert: `src/`, `tests/`, Dokumente außer diesem Bericht.
