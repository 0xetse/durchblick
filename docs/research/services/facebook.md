# Recherche-Notizen: Facebook (Meta)

Stand: 2026-10-07 · Bearbeitet für `content/services/facebook.yaml`, `content/guides/facebook.yaml`, `content/sources/facebook.yaml` (enthält auch die gemeinsamen `meta-*`-Quellen für Instagram und WhatsApp).

## Methodischer Hinweis (wichtig)

- Alle Meta-Seiten wurden aus einem **US-Netz** abgerufen (Proxy mit US-Ausgang). Meta liefert regional unterschiedliche Fassungen aus. Folgen:
  - Die Datenschutzrichtlinie (https://www.facebook.com/privacy/policy/, deutsch, „Aktualisiert am 23. Juli 2026") enthielt den Abschnitt „Datenschutzhinweise für Personen mit Wohnsitz in den USA" und nannte Meta Platforms, Inc. als Kontakt. Der **EU-spezifische Teil zu Rechtsgrundlagen (Meta Platforms Ireland)** war nicht sichtbar. Die inhaltlichen Kategorien sind nach unserem Verständnis weltweit gleich, das ist aber nicht für die EU-Fassung verifiziert.
  - Mehrere Hilfeartikel tragen den Hinweis „Wenn du dich in der Region Europa … befindest, stehen dir für deine Werbepräferenzen andere Optionen zur Verfügung." → Schritte daraus wurden für die EU **nicht** als verifiziert markiert.
  - EU-spezifische Hilfeartikel („Diese Option ist nur in der Region Europa verfügbar") waren abrufbar und sind die Grundlage für den verifizierten Werbe-Guide.
- Inhalte wurden per `curl` mit Browser-Headern (deutsch) geladen; WebFetch lieferte bei Meta oft nur Titel.

## Kernaussagen mit Beleg

| Aussage | Quelle | Beleg (Zitat/Abschnitt) |
|---|---|---|
| Kategorien: eigene Aktivität/Inhalte, Kontakte, App-/Browser-/Geräteinfos, Infos von Partnern | https://www.facebook.com/privacy/policy/ | „Diese Informationen erheben wir: Deine Aktivität und die von dir bereitgestellten Informationen · Freund*innen, Abonnent*innen und andere Kontakte · App-, Browser- und Geräteinformationen · Informationen von Partnern, Anbietern und sonstigen Dritten" |
| Feinkörnige Beobachtung | dto. | „Was du gerade auf deinem Gerät tust, z. B. ob sich unsere App im Vordergrund befindet oder ob sich deine Maus bewegt"; „Zeitpunkt, Häufigkeit und Dauer deiner Aktivitäten" |
| Nachrichteninhalte | dto. | „Nachrichten, die du sendest und empfängst, einschließlich ihrer Inhalte, vorbehaltlich des anwendbaren Rechts" (Bereitstellung, Sicherheit); bei „Personalisierung" nur „Metadaten zu Inhalten und Nachrichten" |
| Besonders geschützte Daten nicht für Werbung | dto. | „Wir verwenden die von dir für diese Zwecke freiwillig bereitgestellten Informationen mit besonderem Schutz, aber nicht, um dir Werbeanzeigen zu zeigen." Beispiele: „religiösen Ansichten, sexuelle Orientierung, politische Einstellung, Gesundheitszustand …" |
| Interessenbewertung dokumentiert | dto., Abschnitt „Personalisierung der Meta-Produkte" | „… um deine Interessen und Präferenzen zu bewerten und zu verstehen" |
| Werbepräferenzen aus On- und Off-Facebook-Daten | https://www.facebook.com/help/109378269482053 | „… Präferenzen …, die wir basierend auf deinen Profilinformationen, auf Facebook unternommenen Handlungen sowie außerhalb von Facebook verwendeten Websites und Apps für dich erstellt haben" |
| Partnerdaten auch bei Opt-out | https://www.facebook.com/help/568137493302217 | „Unabhängig von der hier gewählten Einstellung können Unternehmen und Organisationen uns Informationen zu deinen Aktivitäten senden, die wir dann möglicherweise anonymisieren bzw. zur Verbesserung unserer Produkte … einsetzen." (→ `surprise`) |
| Kundenlisten / E-Mail-Abgleich | https://www.facebook.com/help/562973647153813 und 568137493302217 | „Informationen, die Werbetreibende … bereits über dich haben und mit uns teilen, z. B. deine E-Mail-Adresse"; „Liste von Personen oder Geräten" |
| Keine direkt identifizierenden Daten an Werbetreibende ohne Zustimmung | https://www.facebook.com/help/562973647153813 | „Sofern du uns keine ausdrückliche Zustimmung dafür erteilst, geben wir keine Informationen weiter, anhand derer du unmittelbar identifiziert oder kontaktiert werden kannst" |
| Meta-Pixel | https://developers.facebook.com/docs/meta-pixel/ | „JavaScript-Code-Schnipsel, der es dir ermöglicht, die Aktivitäten von Besuchern auf deiner Webseite nachzuverfolgen" |
| EU: drei Optionen | https://www.facebook.com/help/631125599118423 | personalisierte Werbung / weniger stark personalisierte Werbung (Werbepausen möglich) / Abo ohne Werbung |
| Weniger personalisierte Werbung: genutzte Daten | https://www.facebook.com/help/825123042877166 | Werbeinteraktionen; „Dein Alter, das von dir angegebene Geschlecht und deinen Standort"; Geräteinformationen; Inhalte der aktuellen Sitzung |
| Schritte Werbeerlebnis (EU) | https://www.facebook.com/help/468797095528474 | „Klicke im linken Menü auf Kontenübersicht. Klicke auf Werbepräferenzen und anschließend im Tab Informationen verwalten auf Werbeerlebnis." |
| Abo-Preise, gilt inkl. WhatsApp | https://www.facebook.com/help/262038446684066 | 5,99 €/Monat (Web), 7,99 € (App), +4 €/+5 € je weiteres Konto; „… solange du deine Facebook-, Instagram-, Threads- oder WhatsApp-Konten nutzt, die sich in derselben Kontenübersicht befinden" |
| Verantwortlicher EU | https://www.facebook.com/help/681634310058367 | „… werden deine Dienste von Meta Platforms Ireland Limited bereitgestellt" |
| DMA-Entscheidung April 2025 | https://ec.europa.eu/commission/presscorner/detail/en/ip_25_1085 | „Meta breached the DMA obligation to give consumers the choice of a service that uses less of their personal data … fined … €200 million" |
| Neue Wahl ab Januar 2026 | https://digital-markets-act.ec.europa.eu/meta-commits-give-eu-users-choice-personalised-ads-under-dma-2025-12-08_en | „Meta will present these new options to users in the EU in January 2026" |
| Stand 2026, Berufung | Meta 10-Q Q2 2026 (SEC) | „made significant modifications to LPA since the European Commission issued its final decision. We appealed … on July 4, 2025"; „the IDPC is continuing to assess the compliance of our ‚subscription for no ads‘ consent model" |
| Geschäftsmodell | dto. | „We generate substantially all of our revenue from advertising." Advertising Q2 2026: 59.363 Mio. USD |
| KI-Training EU | https://about.fb.com/news/2025/04/making-ai-work-harder-for-europeans/ | öffentliche Inhalte Erwachsener + Meta-AI-Interaktionen; Widerspruchsformular; Update 27.03.2026: Nachrichten, die mit KI-Funktionen geteilt werden, können zum Training genutzt werden |
| Trainingsbeginn 27.05.2025 | https://www.dataprotection.ie/news-media/latest-news/dpc-statement-meta-ai | „plans to begin training of its generative AI model(s) on 27 May 2025"; „public content shared by adults on Facebook and Instagram" |
| Kontolöschung | https://www.facebook.com/help/224562897555674 | 30 Tage rückgängig machbar; bis zu 90 Tage Löschdauer; Backups |
| Export | https://www.facebook.com/help/212802592074644 | Schritte über Meta-Konto > Deine Informationen und Berechtigungen > Deine Informationen exportieren; vier Tage Downloadfenster |
| Kontakt-Upload | https://www.facebook.com/help/355489824655936 | „Du kannst das kontinuierliche Hochladen von Kontakten nur über die Facebook-App verwalten." Verwaltung: https://www.facebook.com/mobile/facebook/contacts/?tab=contacts |
| Kontenübersicht | https://www.facebook.com/help/943858526073065 | verknüpfte Konten → „personalisiertere Werbung und Vorschläge"; Meta migriert schrittweise zu „Meta-Konten" |

## Nicht verifiziert / bewusst weggelassen

- **„Deine Aktivitäten außerhalb von Meta-Technologien"**: Die Hilfeartikel (2207256696182627, 1224342157705160, 287199741901674) zeigten beim Abruf nur „Diese Funktion ist in deiner Region nicht verfügbar." Ob das Tool in der EU noch so heißt bzw. existiert, ist offen. Der Guide `facebook-activity-other-businesses` ist deshalb `needs-verification` ohne Schritte.
- **EU-Widerspruchsformular KI**: Kandidaten-URL https://www.facebook.com/help/contact/712876720715583 verlangt Anmeldung; Zweck nicht bestätigt → nicht verwendet.
- **Messenger-Verschlüsselung** (Standard-E2EE): nicht geprüft; im Datenpunkt `fb-messages` offen gelassen.
- **KI-Interaktionen für Werbung** (Newsroom 1.10.2025, ab 16.12.2025 „in most regions"): EU-Status nicht verifiziert → nicht aufgenommen.
- **Änderungen an „weniger personalisierter Werbung" seit Januar 2026**: Laut Sekundärquelle (ppc.land, Metas DMA-Bericht März 2026) nicht wegklickbare Wahl ab Januar 2026, Erinnerung Januar 2027 – nicht auf einer Primärquelle bestätigt.
- DSA Art. 26 Abs. 3 (Verbot von Werbeprofiling mit sensiblen Daten): EUR-Lex war nicht abrufbar (Bot-Schutz) → nicht zitiert.

## Offene Fragen

- EU-Fassung der Datenschutzrichtlinie (Rechtsgrundlagen-Teil) aus einem EU-Netz gegenprüfen.
- Gibt es in der EU noch die Einstellung „Aktivitäten bei anderen Unternehmen" bei personalisierter Werbung, und wo liegt sie?
- Verbleibt die DPC-Prüfung des Abo-Modells (laut 10-Q laufend) – Ergebnis abwarten.

## Nachprüfung V2 (EU-Fassung)

Stand: 2026-10-07 · Methode: gerenderter Browser (Chromium, `locale: de-DE`, Zeitzone Europe/Berlin, `Accept-Language: de-DE`), dazu Websuche. Netz-Ausgang weiterhin USA; eine EU-Ausleitung ist im Proxy nicht wählbar.

**EU-Fassung der Datenschutzrichtlinie: nicht erhalten.**

| Versuch | Ergebnis |
|---|---|
| https://www.facebook.com/privacy/policy/?locale=de_DE (auch `&country=DE`, `?section_id=…`) | gleiche Fassung „Aktualisiert am 23. Juli 2026“ mit „Datenschutzhinweise für Personen mit Wohnsitz in den USA“, Kontakt Meta Platforms, Inc. |
| https://privacycenter.instagram.com/policy/?locale=de_DE, https://www.instagram.com/legal/privacy/ | identisch (US-Fassung) |
| Druckfassung https://www.facebook.com/privacy/policy/printable/ → mbasic | US-Fassung („Menlo Park, CA“) |
| https://www.facebook.com/privacy/explanation/ | Weiterleitung auf dieselbe US-Fassung |
| Rechtsgrundlagen https://www.facebook.com/about/privacy/legal_bases | „Diese Seite ist an deinem Standort nicht verfügbar.“ – bestätigt, dass Meta den EU-Teil nach Standort sperrt |
| `…/privacy/policies/legal-bases/` | 404 |
| translate.goog-Proxy, Wayback-API | 400 bzw. 429 (gesperrt/gedrosselt) |
| https://www.meta.com/de/legal/privacy-policy/ | liefert per Länderpfad eine EU-Fassung, aber nur der **ergänzenden Richtlinie für Meta Platforms Technologies** (Quest, Brillen; „Gültig ab 29. Juni 2026“): „Der Datenverantwortliche bezüglich deiner Informationen ist Meta Platforms Ireland Limited.“ Nicht die Facebook/Instagram-Richtlinie; nicht als Quelle übernommen. |

**Folgen (Option c):**
- `confidence` von `high` auf `medium` gesenkt bei Facebook: `breadth`, `observation`, `linkability` (stützen sich vor allem auf die US-Fassung bzw. global abgerufene Hilfeartikel). `adUse` bleibt `high` (Beleg: 10-Q, unabhängig von der Region).
- Teil-Absicherung (Option a) mit EU-Hilfeartikeln, die wir gelesen haben: `fb-activity` und `observation`/`breadth` zusätzlich mit `meta-help-manage-ad-experience` („Die Inhalte, die du dir in unseren Produkten ansiehst bzw. mit denen du interagierst“); `fb-device` zusätzlich mit `meta-help-less-personalised-ads` („Deine Geräteinformationen, wie etwa das Gerät oder den Browser“) – deckt nur den Gerätetyp ab, nicht Mausbewegung/App-Vordergrund.
- Weiterhin nur auf der US-Fassung beruhend (nicht für die EU geprüft): `fb-content` (Metadaten), `fb-special-category`, `fb-messages`, `fb-connections`, Teile von `fb-device` und `fb-location`, `fb-meta-ai` (Metadaten-Teil), Ableitungen `fb-content-preferences`, `fb-people-you-may-know`, `fb-sensitive-possible`, Zwecke `provide-service`, `personalisation`, `measurement`, `safety`, alle `sharing`-Einträge, `retention`. Keine Hinweise, dass sich die EU-Fassung hier inhaltlich unterscheidet – aber nicht belegt.
- Quellennotiz `meta-privacy-policy` entsprechend ergänzt.

**Anleitungen (gerendert, de-DE):**
- `facebook-less-personalised-ads`: EU-Artikel erneut gerendert, Schritte unverändert, weiter `verified`.
- `facebook-activity-other-businesses`: Hilfeartikel 568137493302217 gerendert; Schritte vorhanden (Profilbild > Einstellungen und Privatsphäre > Einstellungen > Kontenübersicht > Deine Informationen und Berechtigungen > Aktivitäten bei anderen Unternehmen), aber weiterhin mit „Wenn du dich in der Region Europa … befindest, stehen dir für deine Werbepräferenzen andere Optionen zur Verfügung.“ → bleibt `needs-verification`. Artikel 2207256696182627 weiterhin „Diese Funktion ist in deiner Region nicht verfügbar.“
- `facebook-ai-training-objection`: Formular https://www.facebook.com/help/contact/712876720715583 zeigt nur Anmeldehinweis. Die Hamburger Datenschutzbehörde (Tier 1, neue Quelle `meta-hmbbfdi-ai-objection-2025`) nennt diese Formular-Adresse; daher als `officialUrl` gesetzt. Kein offizieller Menüweg → bleibt `needs-verification`, keine Schritte. Zusatzinfo HmbBfDI (nicht in den Text übernommen): Begründung freiwillig, Bestätigung per Pop-up/E-Mail, bei Konten in derselben Kontenübersicht genügt ein Widerspruch.
- `meta-privacy-genai` erneut gerendert: weiterhin kein Link zum EU-Formular.

**Sprache:** Primärtexte in Service- und Anleitungsdatei auf B1–B2 gekürzt (kurze Sätze, Fachwörter erklärt: Begleitdaten statt Metadaten, „Internet-Adresse deines Anschlusses (IP-Adresse)“, „kleine Dateien im Browser (Cookies)“, „Code-Schnipsel (Pixel)“). Fachbegriffe stehen, wo nötig, im Feld `technical`. Keine Fakten geändert.

## Nachprüfung 2026-10-21

Methode: gerenderter Browser (Playwright, de-DE, US-Netz).

- `facebook-activity-other-businesses` → bleibt **needs-verification**. https://www.facebook.com/help/568137493302217 nennt jetzt „Meta-Konto“ statt „Kontenübersicht“, sagt aber weiter: „Wenn du dich in der Region Europa oder im Vereinigten Königreich befindest, stehen dir für deine Werbepräferenzen andere Optionen zur Verfügung.“ Der verlinkte Artikel https://www.facebook.com/help/1241090626576242 ist eine Übersicht zum Abo; die EU-Artikel 468797095528474 und 825123042877166 nennen die Einstellung nicht.
- `facebook-ai-training-objection` → bleibt **needs-verification**. https://www.facebook.com/help/2069235856423257 („Informationen zu Widersprüchen …“) zeigt nur „Diese Informationen sind in deiner Region nicht verfügbar.“ facebook.com/privacy/genai/ (globale Fassung) nennt keinen Menüweg.
- Instagram-Fund zum Werbeerlebnis: https://help.instagram.com/426488546963771 (siehe instagram.md).
