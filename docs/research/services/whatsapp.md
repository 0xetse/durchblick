# Recherche-Notizen: WhatsApp (Meta)

Stand: 2026-10-07 · Dateien: `content/services/whatsapp.yaml`, `content/guides/whatsapp.yaml`, `content/sources/whatsapp.yaml`. Gemeinsame Meta-Quellen (`meta-*`) in `content/sources/facebook.yaml`.

## Kernaussagen mit Beleg

Hauptquelle: WhatsApp-Datenschutzrichtlinie EWR, deutsch, „Gültig ab 2. Juli 2026" – https://www.whatsapp.com/legal/privacy-policy-eea?lang=de (explizite EWR-URL, daher trotz US-Abruf die EU-Fassung; Verantwortlicher WhatsApp Ireland Limited, vgl. https://faq.whatsapp.com/1013614932324960/).

| Aussage | Abschnitt / Quelle | Beleg |
|---|---|---|
| E2EE, WhatsApp kann nicht mitlesen | „Informationen, die wir erheben" | „Wie immer gilt: Deine persönlichen Nachrichten und Anrufe bleiben Ende-zu-Ende-verschlüsselt. Niemand anders, nicht einmal WhatsApp, kann sie lesen oder anhören." |
| Zwischenspeicherung | „Benutzerinhalte" | nicht zustellbare Nachrichten bis zu 30 Tage verschlüsselt; Medien bis zu 30 Tage verschlüsselt |
| Status E2EE | „Status-Informationen" | „Dieser wird ebenfalls Ende-zu-Ende-verschlüsselt." |
| Unverschlüsselte Angaben | dto. | „Dazu gehören dein Profilbild, deine ‚Info‘ sowie Namen und Beschreibungen deiner Communitys und Gruppen." |
| Kontakt-Upload, Nicht-Nutzer | „Dein Netzwerk" + https://faq.whatsapp.com/423109552047857/ | „WhatsApp greift üblicherweise täglich auf Telefonnummern in deinem Adressbuch zu"; Hashwert-Verfahren (→ `surprise`); „Wir teilen deine Kontaktlisten nicht mit anderen Apps von Meta." |
| Nutzungsdaten/Metadaten | „Nutzungsinformationen"; „Nachrichten" (Aufbewahrung) | online, „Zuletzt online", wann Anrufe/Nachrichten; „Telefonnummer, Datum und Uhrzeit eines Anrufs … Dauer" (ePrivacy-RL 2002/58/EG) |
| Geräte-/Verbindungsdaten | „Geräte- und Verbindungsdaten" | Batteriestand, Signalstärke, ISP, IP, „individueller IDs für Produkte von Meta-Unternehmen" |
| Ungefährer Standort | „Allgemeine Standortinformationen" | „… verwenden wir IP-Adressen und andere Informationen wie Telefonvorwahlen, um deinen ungefähren Standort zu bestimmen" |
| Werbung nur Status/Kanäle | „Cookies"; Rechtsgrundlagen-Abschnitt | „Wenn du optionale Funktionen wie Status oder Kanäle nutzt, erheben wir auch Informationen mithilfe ähnlicher Technologien für Werbeanzeigen."; „Wir gestatten weiterhin keine Werbebanner von Dritten … es kann sein, dass du andere Arten von Anzeigen in Status und Kanälen siehst." |
| Meta als Dienstleister (EU) | „So arbeiten wir mit anderen Meta-Unternehmen zusammen" | Geschäftsanalyse: „Wir teilen Deine Konto-Informationen (Telefonnummer), Geräte- und Verbindungsdaten …, Benutzeroptionen … und Nutzungsinformationen …"; Meta handelt „in unserem Auftrag gemäß unseren Anweisungen" |
| Meta AI über WhatsApp | dto., „Wenn Meta optionale Erfahrungen über WhatsApp anbietet" | Meta erhält allgemeine Standortdaten, Geräte-/Verbindungs-, Protokoll- und Nutzungsdaten |
| Kontenübersicht (EWR) | https://www.whatsapp.com/legal/accounts-centre-supplemental-privacy-policy-eea?lang=de („Gültig ab 25. Februar 2026") | freiwillig; gemeinsame Verantwortlichkeit mit Meta Ireland auf Basis von Einwilligung; „… werden die Infos aus allen Konten in deiner Kontenübersicht genutzt, um diese Anzeigen anzupassen"; Nachrichten, Anrufdaten („mit wem du kommunizierst …") und Kontaktliste werden nicht an Meta weitergegeben; Löschung der Verknüpfungsdaten binnen 90 Tagen |
| Unternehmens-Chats | https://faq.whatsapp.com/791574747982248/ | „… kann es die Chats, die es empfängt, für seine eigenen Marketingzwecke verwenden, einschließlich für Werbung auf Meta." |
| Aufbewahrung/Löschung | „Aufbewahrung …", „Löschen …", „Verwaltung …" | Cookies 90 Tage; Support 30/90 Tage; Löschung bis 90 Tage; inaktive Konten „in der Regel nach einer Inaktivität von 120 Tagen gelöscht. Benutzer*innen werden vorher nicht gewarnt." |
| Konto-Info-Bericht | https://faq.whatsapp.com/526463418847093/ | „Berichte zu Konto-Informationen enthalten weder deine Nachrichten noch Informationen zu Kanälen oder Werbeanzeigen"; Einstellungen > Konto > Konto-Info anfordern |
| Konto löschen | https://faq.whatsapp.com/2138577903196467/ | Einstellungen > Konto > Mein Konto löschen; Nummer im internationalen Format; Google-Backup wird gelöscht |
| Live-Standort | https://faq.whatsapp.com/480865177351335/ | Einstellungen > Datenschutz > Live-Standort > Teilen beenden > Beenden; Android-Berechtigung Standort |
| Geschäftsmodell | Meta 10-Q Q2 2026 | „FoA Other revenue, which consists of revenue from paid messaging from WhatsApp, subscriptions …" |
| EU-Abo umfasst WhatsApp | https://www.facebook.com/help/262038446684066 | „… solange du deine Facebook-, Instagram-, Threads- oder WhatsApp-Konten nutzt, die sich in derselben Kontenübersicht befinden" |

## Status Werbung in „Aktuelles" (EU) – Einordnung

- Weltweit angekündigt Juni 2025; ergänzende Richtlinie „Status and Channels" (WhatsApp LLC, gültig ab 14.07.2025) beschreibt Targeting mit „country code, … language, general (not precise) location, … channels followed and ad interaction information" und „make inferences". **Diese Fassung gilt nicht für die EU**; eine EWR-Fassung war unter der vermuteten URL nicht abrufbar.
- EU: Metas DMA-Compliance-Bericht (6. März 2026) kündigt laut ppc.land (Tier 2) den EU-Start „in the coming weeks" an, inkl. Abo-Preisen für WhatsApp (3 €/4 €). Das Originaldokument haben wir nicht auf einer Meta- oder EU-Seite gefunden.
- Tier-1-Indizien für den EU-Betrieb: EWR-Richtlinie (Cookies für Werbung in Status/Kanälen), Kontenübersicht-Richtlinie („Anzeigen in Status und Kanälen (falls wir dir Anzeigen zeigen)"), Meta-Abo-Hilfe (WhatsApp eingeschlossen), Konto-Info-Hilfe („einen Anzeigenbericht anfordern").
- Formulierung im Content daher vorsichtig: „2026 hat Meta begonnen, Werbung … auch in der EU einzuführen".

## Nicht verifiziert / bewusst weggelassen

- Konkrete Schritte für Kontaktberechtigung (Android/iOS) und zum Entfernen aus der Kontenübersicht → Guides `needs-verification`.
- Standardsichtbarkeit von „Zuletzt online"/Profilbild: nicht geprüft.
- EU-Preis des WhatsApp-Werbe-Abos: nur Sekundärquelle.
- iPhone-Weg für Standortberechtigung nicht separat geprüft.

## Offene Fragen

- EWR-Fassung der „Status and Channels"-Ergänzungsrichtlinie finden (Targeting-Daten in der EU).
- Bestätigung des tatsächlichen EU-Starts der Werbung durch eine Primärquelle (WhatsApp-Blog/Hilfeartikel).

## Nachprüfung V2 (EU-Fassung)

Stand: 2026-10-07 · Methode: gerenderter Browser (de-DE, US-Netz).

**EU-Fassung:** Für WhatsApp nicht nötig – die Inhalte stützen sich bereits auf die explizite EWR-Richtlinie (`whatsapp-privacy-policy-eea`, WhatsApp Ireland) und die EWR-Ergänzung zur Kontenübersicht. Keine `confidence`-Änderung. Bewertungen nutzen `meta-privacy-policy` nicht.

**Anleitungen:**
- `whatsapp-contact-access` → **verified.** https://faq.whatsapp.com/522615322631338/ („Kontaktnamen fehlen“, neue Quelle `whatsapp-help-contact-names`), Android-Ansicht: „Öffne die Einstellungen deines Telefons, tippe auf Apps > WhatsApp > Berechtigungen. Tippe auf Kontakte …“; iOS-Ansicht: „Öffne die Einstellungen deines Geräts > Apps und tippe auf WhatsApp. Tippe auf Kontakte …“ mit „Beschränkter Zugriff“ / „Voller Zugriff“; „Wenn du WhatsApp den Zugriff auf deine Telefonkontakte verweigerst, kannst du trotzdem Kontakte in WhatsApp erstellen …, Nachrichten … empfangen …“. Löschen gespeicherter Kontakte: „Einstellungen > Datenschutz > Kontakte“ (https://faq.whatsapp.com/1191526044909364/, Ziel der Weiterleitung von 423109552047857). Die Beschriftung der Option zum Verweigern nennt die Hilfe nicht; die Schritte nennen daher nur den Weg.
- `whatsapp-accounts-center` → bleibt **needs-verification**. Gefunden: https://www.meta.com/help/accounts-center/589288436078759/ (englisch, global; neue Quelle `meta-help-accounts-center-manage`): „Navigate to Accounts Center. Tap or click Accounts or Manage accounts. Tap or click Remove next to the account you want to remove.“ Deutsche Bezeichnungen und der Einstieg aus WhatsApp sind nicht belegt; `meta.com/de/help/…` und `facebook.com/help/589288436078759` lieferten 404 bzw. „Diese Seite ist nicht verfügbar“.
- **Abweichung global vs. EWR (nicht übernommen):** Der globale Artikel https://www.meta.com/help/accounts-center/860837242806303/ schreibt: „we’ll stop combining your info … within 7 days. If you remove your WhatsApp account, your previously combined info would remain combined.“ Die EWR-Ergänzungsrichtlinie nennt dagegen Löschung der Verknüpfungsdaten binnen 90 Tagen. Der Content folgt der EWR-Fassung; Leitung sollte prüfen, ob „bereits zusammengeführte Infos bleiben zusammengeführt“ auch in der EU gilt.

**Sprache:** Primärtexte vereinfacht (z. B. „Internet-Adresse deines Anschlusses (IP-Adresse)“, „verschlüsselter Code (Hashwert)“, „Nummern, die dein Gerät erkennbar machen“, „Akkustand“); Fachdetails ins Feld `technical`. Keine Fakten geändert.

## Nachprüfung 2026-10-21

Methode: gerenderter Browser (Playwright, de-DE und en-US, US-Netz).

- `whatsapp-accounts-center` → **verified.** https://faq.whatsapp.com/519792767655150/ („WhatsApp in deinem Meta-Konto verwalten“, neue Quelle `whatsapp-help-meta-account`), Android- und iOS-Ansicht gleich: „Tippe auf [Symbol] > Einstellungen > Meta-Konto > Konto verwalten. Tippe neben „WhatsApp“ auf Verwalten > Aus diesem Meta-Konto entfernen. Tippe auf Ja, fortfahren > Weiter > Ja, jetzt verschieben.“ Das Symbol vor „Einstellungen“ benennt der Text nicht; die Schritte sagen daher nur „Öffne die Einstellungen“.
- Zusätzlich https://faq.whatsapp.com/2957533991082921/ (`whatsapp-help-accounts-center-data`): Entfernen „jederzeit in deinen WhatsApp-Einstellungen“; Weitergabe endet „innerhalb von 24 Stunden“, kopierte Verknüpfungen werden binnen „bis zu sieben Tage“ entfernt. **Abweichung:** Die EWR-Ergänzungsrichtlinie nennt 90 Tage für die Löschung; der Guide-Text (`whatChanges`) folgt weiter der EWR-Fassung. Die deutsche Fassung von https://www.meta.com/de-de/help/accounts-center/860837242806303/ sagt ebenfalls: „deine zuvor zusammengeführten Informationen werden beibehalten“ – Leitung sollte prüfen.
