# Recherche-Notizen: Telegram

Stand: 2026-10-08 · Dateien: `content/services/telegram.yaml`, `content/guides/telegram.yaml`, `content/sources/telegram.yaml`.

## Kernaussagen mit Beleg

Hauptquelle: Telegram-Datenschutzerklärung, deutsche Fassung – https://telegram.org/privacy/de (letzte Änderung laut Abschnitt 11: „21. August 2026“). Unter https://telegram.org/privacy wurde beim Abruf ebenfalls die deutsche Fassung ausgeliefert; Zitate daher deutsch. Verantwortlicher: Telegram Messenger Inc., Sitz Britische Jungferninseln; EWR-Vertreter nach Art. 27 DSGVO: EDPO, Brüssel (Abschnitt 1.4). Ergänzend die FAQ englisch (https://telegram.org/faq) und deutsch (https://telegram.org/faq/de, für deutsche Menünamen).

| Aussage | Abschnitt / Quelle | Beleg |
|---|---|---|
| Kontodaten, öffentliches Profil | DSE 3.1, 3.1.1, 3.2 | „Du gibst deine Handynummer und grundlegende Kontodaten … an“; Anzeigename, öffentliche Profilbilder, Benutzername „auf Telegram immer öffentlich“; optional Geburtstag, E-Mail für Wiederherstellung/Anmeldecodes |
| Cloud Chats bei Telegram gespeichert | DSE 3.3.1, 3.3.4 | „Wir speichern Nachrichten, Fotos, Videos und Dokumente aus deinen Cloud Chats auf unseren Servern“; „Alle öffentlichen Chats sind Cloud Chats“ |
| Cloud Chats nicht Ende-zu-Ende (→ `surprise`) | FAQ „So how do you encrypt data?“ | „Server-client encryption is used in Cloud Chats (private and group chats), Secret Chats use an additional layer of client-client encryption.“ |
| Telegram hat Schlüssel für Cloud Chats | Durov, telegra.ph (14.08.2017), aus der FAQ verlinkt | „in cloud chats our servers do have access to the encryption key“ |
| Unabhängige Einordnung | Matthew Green, 25.08.2024 | „it does not end-to-end encrypt conversations by default“; E2E „never for group chats with more than two people in them“ |
| Geheime Chats | DSE 3.3.2, 4.2; FAQ „How are secret chats different?“ | „Wir speichern deine Geheimen Chats nicht auf unseren Servern.“; „device-specific and are not part of the Telegram cloud“ |
| Anrufe E2E | DSE 4.2; FAQ (Abschnitt zu Anrufen) | Inhalt von Anrufen nur auf den Geräten verarbeitet; Gruppenanrufe „also protected by end-to-end encryption“ |
| Kontakte | DSE 3.4 | „Wir bitten um deine Einwilligung, bevor deine Kontakte synchronisiert werden.“; „nur die Nummer und den Namen“; „anonymisierte Reihen von Telefonnummern …“ für „Freunde einladen“ |
| Benachrichtigung bei Neuanmeldung | FAQ „What happens if I delete my account?“ | „People, who have your phone number in their contacts, will be notified.“ |
| Metadaten, 12 Monate | DSE 5.2 | „… Metadaten wie deine IP-Adresse, Geräte und Telegram Apps, die du verwendet hast, den Verlauf der Änderungen von Nutzernamen usw. …“; „für maximal 12 Monate“ |
| Gemeldete Nachrichten, automatische Prüfung | DSE 5.3 | Moderatoren prüfen gemeldete Nachrichten; „automatisierte Algorithmen …, um Cloud Chats zu analysieren“ |
| Häufige Kontakte | DSE 5.5 | „… berechnen wir eine Bewertung, die anzeigt, welche Personen du häufig anschreibst“; abschaltbar über „Häufige Kontakte vorschlagen“ (FAQ-de: „Vorschläge für häufige Kontakte“) |
| Werbung | DSE 5.6, 5.6.1 | Kanäle ab 1.000 Abonnenten, Bots, Storys, Suche; standardmäßig nach Thema/Suchbegriff; zusätzlich Land/Stadt aus Vorwahl oder IP; Werbung nach abonnierten Kanälen und Kategorien; „Diese Daten werden niemals an Werbetreibende weitergegeben.“; Premium ohne Werbung |
| Geschäftsmodell | FAQ „How are you going to make money out of this?“ | Sponsored Messages 2021, Premium 2022 |
| Standort | DSE 3.5 | geteilter Standort wie Nachricht; Live-Standort/„Mich sichtbar machen“ „auch, wenn die App geschlossen ist“ |
| Bots | DSE 6.1–6.5; FAQ „Are bots safe?“, „What are mini apps?“ | Bots sehen öffentliches Profil + Nachrichten an sie; ggf. IP über Links; in Gruppen mit Zugriff alles; „Sie sind völlig unabhängig von uns.“ |
| Zahlungen | DSE 7.1–7.4 | „Deine Zahlungsdaten erreichen nie die Server von Telegram.“ |
| Konzernfirmen | DSE 8.2 | Telegram Group Inc., Telegraph Inc. (BVI), Telegram FZ-LLC (Dubai); Standardvertragsklauseln |
| Behörden | DSE 8.3 (geändert 23.09.2024) | „… können deine IP-Adresse und Telefonnummer an die zuständigen Behörden weitergeben“; vierteljährlicher Transparenzbericht unter t.me/transparency |
| Behörden – Kontext | Engadget 23.09.2024; TechCrunch 07.01.2025 | Policy-Wechsel nach Festnahme Durovs; 2024: USA 900 Fälle/2.253 Nutzer*innen, Indien 14.641/23.535, UK 142/293 |
| Übersetzung/Transkription | DSE 8.4, 8.5 vs. FAQ (Cocoon) | DSE: Text/Audio „an Google weitergegeben“; FAQ: „translation … run on Cocoon and never send any data to third parties“ → Widerspruch, im Content offen benannt |
| EWR-Speicherort | DSE 4.1 | „Rechenzentren in den Niederlanden“ |
| Aufbewahrung/Löschung | DSE 10.1–10.4; FAQ | Löschen für beide Seiten ohne Zeitlimit (Einzelchats); Supergruppen 48 h Admin-Protokoll; Selbstzerstörung Konto standardmäßig nach 18 Monaten (seit 29.09.2024) |
| Telefonnummer sichtbar | FAQ-de „Wer kann meine Nummer sehen?“ | „Standardmäßig ist deine Nummer nur für Personen sichtbar, die du als Kontakte gespeichert hast. Unter Einstellungen → Privatsphäre und Sicherheit → Telefonnummer …“ |
| Geheimen Chat starten | FAQ-de | „Bei iOS und Android im Cloud Chat auf das Profilbild tippen → ‚…‘ → ‚Geheimen Chat starten‘.“; Timer: iOS Stoppuhr im Eingabefeld, Android Profilbild oben |
| Daten löschen ohne Konto | FAQ-de „Kann ich meine Daten löschen …?“ | „Einstellungen → Privatsphäre und Sicherheit (bei iOS … ‚Dateneinstellungen‘)“; „Synchronisierte Kontakte löschen“ |
| Konto löschen | FAQ-de; my.telegram.org | Deaktivierungsseite; Code „per Telegram …, nicht per SMS“; telegram.org/deactivate → my.telegram.org/auth?to=delete |
| Export | Telegram-Blog 27.08.2018; FAQ | Desktop „Settings > Export Telegram data“ (alt); FAQ: Desktop „can also be used to export your Telegram data“; @EURegulation für „a copy of all your data“ |

## Anleitungen

- **verified:** `telegram-secret-chat`, `telegram-phone-number`, `telegram-contact-sync`, `telegram-frequent-contacts`, `telegram-delete-account` – jeweils nur gegen offizielle Texte (FAQ de/en, DSE), nicht in der App. Labels der Auswahl-Optionen (Telefonnummer) und des Sync-Schalters nennen die Quellen nicht; die Schritte bleiben daher allgemein.
- **needs-verification:** `telegram-export-data` (Menüpfad nur aus Blog von 2018; @EURegulation-Ablauf nicht beschrieben), `telegram-account-self-destruct` (offiziell nur „in den Einstellungen“; Drittquellen nennen „Privatsphäre und Sicherheit → Konto löschen, wenn inaktiv für“ – nicht übernommen).

## Bewertung – Begründungen

- `sensitivity` 4: Regel aus der Methodik (private Kommunikation ist Kernfunktion und Anbieter kann Inhalte verarbeiten). Cloud Chats und alle Gruppen nicht E2E; Telegram hat die Schlüssel (Durov).
- `deletion` 4: Löschen für beide Seiten ohne Zeitlimit, Selbstzerstörungs-Timer, automatische Kontolöschung, Metadaten max. 12 Monate. Export nur Desktop – Konfidenz medium.
- `reachability` 3, Konfidenz low: nicht in der App geprüft (Methodik-Regel).
- `defaults` 2: Hauptpunkt ist fehlende E2E ab Werk; 18-Monats-Frist betrifft nur inaktive Konten.

## Widersprüche / offene Fragen

- FAQ (en) „Do you process data requests?“ sagt weiterhin, für Daten seien „several court orders from different jurisdictions“ nötig, und „0 bytes of user messages“ seien herausgegeben worden; die deutsche FAQ schreibt sogar „0 Byte Nutzerdaten“. Das passt nicht zu DSE 8.3 und den Transparenzzahlen (IP/Telefonnummer). Im Content folgen wir der DSE und den Transparenzzahlen; die FAQ-Aussage wird nicht übernommen.
- Übersetzung: DSE (Google) vs. FAQ (Cocoon, keine Dritten). Offen, welche Angabe aktuell gilt.
- Transparenzbericht selbst (Bot t.me/transparency) nicht abgerufen – nur mit Telegram-Konto und nur für die eigene Region; Zahlen aus TechCrunch.
- Deutsche Werte aus dem Transparenzbericht nicht gefunden.
- Unternehmenseintrag (`companies.yaml`): Verantwortlicher laut DSE ist Telegram Messenger Inc. mit Sitz auf den Britischen Jungferninseln; „Dubai“ ist laut FAQ der Sitz des Entwicklungsteams (Telegram FZ-LLC). Eine EU-Gesellschaft gibt es nicht, nur den EWR-Vertreter EDPO. „Kryptowährungs-Geschäfte“ als Einnahmequelle belegt die DSE nicht; die FAQ nennt nur Werbung und Premium.
