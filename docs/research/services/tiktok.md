# Recherche: TikTok

Stand: 2026-10-07 · Perspektive: erwachsener Nutzer mit Konto in Deutschland/EWR

## Zentrale Befunde

| Aussage | Quelle | Beleg |
|---|---|---|
| Verantwortlich im EWR ist TikTok Technology Limited, 10 Earlsfort Terrace, Dublin. Letzte Aktualisierung 30.11.2025. | https://www.tiktok.com/legal/page/eea/privacy-policy/de | Kopf der Erklärung |
| Kontodaten | dto. | „Wir erheben Daten, die Sie bei der Einrichtung eines Kontos angeben, wie z.B. Ihr Geburtsdatum, Ihren Benutzernamen, Ihre E-Mail-Adresse und/oder Telefonnummer und Ihr Passwort.“ |
| Inhalte inkl. Metadaten | dto. | „… sowie die zugehörigen Metadaten (z. B. wann, wo und von wem die Inhalte erstellt wurden).“ |
| Nachrichteninhalte | dto. | „Wir erfassen die Inhalte der Nachrichten, die Sie über die Plattform erhalten, sowie die zugehörigen Metadaten …“ |
| Suchverlauf | dto. | „… wie Sie mit angesehenen Inhalten und Anzeigen interagieren, […] und Ihren Suchverlauf.“ |
| Inhaltsanalyse | dto. | „… das Vorhandensein oder die Position eines Gesichts oder anderer Körperteile innerhalb eines Bildes und den Text der in Ihren Nutzerinhalten gesprochenen Wörter.“ |
| Tastenanschlagmuster | dto. | „Gerätemodell, Betriebssystem, Tastenanschlagmuster oder -rhythmen, IP-Adresse“ |
| Ungefährer Standort | dto. | „… ungefähren Standort (z. B. Land, Bundesland oder Stadt) auf der Grundlage Ihrer technischen Daten (z.B. SIM-Karte und IP-Adresse).“ Genauer Standort nur mit Berechtigung. |
| Kontakte | dto. | „Wenn Sie Ihre Kontakte synchronisieren, greifen wir auf Daten aus dem Telefonbuch Ihres Geräts zu …“ |
| Zwischenablage | dto. | „Wir erheben auch Inhalte … aus der Zwischenablage Ihres Geräts, wenn Sie Inhalte auf die Plattform kopieren und einfügen.“ |
| Abgeleitete Merkmale (documented) | dto. | „Wir schließen von den Daten, die wir über Sie vorliegen haben, auf Ihre Eigenschaften (z. B. Altersgruppe und Geschlecht) und Interessen.“ |
| Werbung: generisch ohne, personalisiert mit Einwilligung | dto. | „Mit Ihrer Einwilligung zeigen wir Ihnen auf der Plattform personalisierte Anzeigen, die auf Ihren Aktivitäten auf und außerhalb der Plattform basieren.“ Generische Werbung „damit wir die Plattform weiterhin kostenlos anbieten können“. |
| Partnerdaten (off-TikTok) | dto. | Partner teilen „Informationen über Sie und Ihr Verhalten außerhalb der Plattform“; gehashte E-Mails, Werbe-IDs. |
| Fernzugriff aus China | https://www.tiktok.com/legal/page/eea/transferee-countries/de | „Diese Unternehmen befinden sich in Australien, Brasilien, China, Malaysia, auf den Philippinen, in Singapur und in den Vereinigten Staaten.“ |
| Speicherung | Datenschutzerklärung | Speicherung u. a. in USA, Malaysia, Singapur; Dauer „so lange …, wie es … erforderlich ist“, keine festen Fristen. |
| DPC-Entscheidung | https://www.dataprotection.ie/en/news-media/latest-news/irish-data-protection-commission-fines-tiktok-eu530-million-and-orders-corrective-measures-following | 2. Mai 2025, 530 Mio. € (485 Mio. Übermittlungen, 45 Mio. Transparenz); „TikTok failed to verify, guarantee and demonstrate that the personal data of EEA users, remotely accessed by staff in China, was afforded a level of protection essentially equivalent …“. TikTok meldete im April 2025, dass begrenzte EWR-Daten auf Servern in China gespeichert worden waren. |
| Stand Rechtsstreit | Irish Times 30.04.2026 und 30.06.2026 | Supreme Court ließ den Stay der Suspendierungsanordnung bestehen; High Court (Juni 2026) bestätigte die Verstöße, verlangte aber Neubewertung der Abhilfemaßnahmen; DPC prüft neu. |
| Nicht personalisierter Feed (DSA) | https://newsroom.tiktok.com/en-eu/fulfilling-commitments-dsa-update | 4.8.2023: „allowing them to turn off personalisation“; beliebte Videos aus Region/weltweit; Folge-Feeds chronologisch; keine personalisierte Werbung für 13–17-Jährige im EWR. |
| Empfehlungssignale | https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you | „whether a user finishes watching a longer video from beginning to end“ als starkes Signal. |
| TikTok Pixel | https://ads.tiktok.com/help/article/tiktok-pixel | Ereignis, Zeitstempel, IP-Adresse, User Agent, Cookies, Metadaten und Klicks. |

## Nicht verifiziert

- **Hilfeseiten (support.tiktok.com)** leiten auf `tiktok.com/support/faq_detail?id=…` weiter, die nur clientseitig rendern. Inhalte konnten weder per WebFetch noch per curl gelesen werden. Deshalb haben alle TikTok-Anleitungen `steps: []` und `needs-verification`.
- Über den Suchindex der offiziellen Seite „Control your off-TikTok data“ sichtbar (nicht direkt abgerufen): Aktivitäten lassen sich alle 24 Stunden löschen (App: Profil > Menü > Einstellungen und Datenschutz > Werbung > Aktivität löschen); Trennung kann bis zu 30 Tage dauern; „Disconnect advertisers“ nur sichtbar, wenn personalisierte Werbung an ist. Bitte in der App prüfen, bevor das übernommen wird.
- Aktueller Menüpfad für den nicht personalisierten Feed in Deutschland 2026.
- Löschfrist/Wartezeit bei Kontolöschung (Drittquellen nennen 30 Tage Deaktivierung, offiziell nicht bestätigt).
- Ob die DPC nach dem High-Court-Urteil (Juni 2026) bis Oktober 2026 neue Maßnahmen erlassen hat.

## Offene Fragen

- Ob die personalisierte-Werbung-Einwilligung im EWR beim Onboarding abgefragt wird (Default) – wirkt sich auf `defaults` aus (aktuell `low` confidence).
- Unternehmensdatensatz `bytedance`: EU-Einheit ist TikTok Technology Limited (Dublin).

## Nachprüfung TikTok-Anleitungen (Browser)

Stand 2026-10-07. Hilfeseiten mit Headless-Chromium (Playwright) gerendert, Sprache `de-DE` (sonst liefert `/de/` englischen Text).

| Anleitung | Geprüfte Seite | Ergebnis |
|---|---|---|
| `tiktok-personalised-ads` | https://www.tiktok.com/privacy/ads-and-your-data/de (Abschnitt „EWR, Vereinigtes Königreich und Schweiz“), Menüpfad aus https://support.tiktok.com/de/account-and-privacy/personalized-ads-and-data/targeted-ads | verified – „Einstellungen und Datenschutz > Anzeigen“, Schieberegler „Personalisierung von Anzeigen“; Anzeigen bleiben, nur weniger relevant. Nur App beschrieben → Plattformen auf Android/iOS. |
| `tiktok-off-tiktok-activity` | https://support.tiktok.com/de/account-and-privacy/personalized-ads-and-data/control-your-off-tiktok-data | verified – „Aktivitäten löschen“ → „Bestätigen“; alle 24 h möglich, Trennung dauert bis zu 30 Tage; zusätzlich „Verbindung zu Werbeträgern trennen“. |
| `tiktok-non-personalised-feed` | https://support.tiktok.com/de/using-tiktok/exploring-videos/how-tiktok-recommends-content | needs-verification – Wirkung bestätigt (Feed „Beliebt“, Folge-/Freund*innen-Feed chronologisch, getrennte Einstellung „personalisierte Suche“, nur EU/Kasachstan). Die verlinkte Schritt-Seite `…/managing-personalization-on-tiktok` zeigte nur „Something went wrong“ (en/de, mehrfach). |
| `tiktok-contacts` | https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/suggested-accounts (nur Englisch) + Datenschutzerklärung EWR | verified – „Settings and privacy > Privacy > Sync contacts and Facebook friends“; bereits synchronisierte Kontakte bleiben, bis „Remove previously synced contacts“ genutzt wird. Genauer Standort laut Datenschutzerklärung nur bei aktivierten Standortdiensten in den Geräteeinstellungen. Seite „Location information on TikTok“ renderte keinen Artikeltext. |
| `tiktok-download-data` | https://support.tiktok.com/de/account-and-privacy/personalized-ads-and-data/requesting-your-data | verified – „Konto > Deine Daten herunterladen > Daten anfordern“; einige Tage Vorbereitung, Datei 4 Tage verfügbar, manche Daten fehlen. Nur App beschrieben. |
| `tiktok-delete-account` | https://support.tiktok.com/de/account-and-privacy/deleting-an-account/deleting-an-account | verified – „Konto > Konto deaktivieren oder löschen“. Keine Wartefrist auf der Seite genannt. Nur App beschrieben. |

Nebenbefund: `how-your-ads-are-personalized` behandelt nur Anzeigenthemen und Geschlecht, nicht den EWR-Schalter.
