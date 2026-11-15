# Recherche-Notizen: Spotify

Stand: 2026-10-08 · Dateien: `content/services/spotify.yaml`, `content/guides/spotify.yaml`, `content/sources/spotify.yaml` · Perspektive: erwachsene Person mit Konto (Free oder Premium) in Deutschland.

## Methode

Spotify-Seiten (spotify.com, support.spotify.com, ads.spotify.com) am 2026-10-08 per `curl` mit `Accept-Language: de-DE` abgerufen und als Text gelesen. Die Hilfeseiten liefern den Artikeltext serverseitig aus, deshalb waren alle deutschen Fassungen vollständig lesbar. Ausnahmen: ads.spotify.com/en-US/contextual-advertising/ (per WebFetch gelesen, nur englisch) und das Ad-Studio-Hilfe-Center (leitet auf eine JavaScript-Seite um, nicht gelesen, nicht verwendet). Kontoseiten (spotify.com/account/…) brauchen eine Anmeldung und wurden **nicht** gesehen.

## Kernaussagen mit Beleg

Hauptquelle: Datenschutzrichtlinie, deutsch, „Gültig ab dem 12. Juni 2026" – https://www.spotify.com/de/legal/privacy-policy/ (Verantwortlicher: „Spotify AB ist zuständig für die im Rahmen dieser Richtlinie verarbeiteten personenbezogenen Daten.", Regeringsgatan 19, 111 53 Stockholm).

| Aussage | Abschnitt / Quelle | Beleg |
|---|---|---|
| Kontodaten | DSR Abschnitt 3, „Daten zu dir als Nutzer*in" | Anzeigename, E-Mail, Passwort, Telefonnummer, Geburtsdatum, Geschlecht, Adresse, Land, Universität, „Geschätztes oder bestätigtes Alter aus einer Altersprüfung über einen Drittanbieter" |
| Nutzungsdaten | DSR Abschnitt 3, „Nutzungsdaten" | „Suchanfragen", „Streamingverlauf", „Navigationsverlauf", „Prompts in KI-Features", „Transkripte", „Interaktionen mit Ads" |
| Rückschlüsse | dto. | „Rückschlüsse (d. h. unser Verständnis) auf dein Alter, deine Interessen und Präferenzen basierend auf deiner Nutzung des Spotify Dienstes" |
| Geräte | DSR Abschnitt 3, „Deine technischen Daten" | Geräte-IDs, Netzwerkverbindung „(z. B. WLAN, 4G, LTE, Bluetooth)", „Geräte in deinem WLAN (wie Lautsprecher)", „Spotify Partneranwendungen, um festzustellen, ob die Anwendung auf deinem Gerät installiert ist" |
| Ungefährer Standort | DSR Abschnitt 3 | „… geht beispielsweise aus technischen Daten (z. B. deiner IP-Adresse, den Spracheinstellungen deines Geräts) oder der Zahlungswährung hervor." |
| Sensordaten | DSR Abschnitt 3 | „durch Bewegung oder Orientierung generierte Sensordaten des Geräts" |
| Sprache | DSR Abschnitt 3, „Sprachdaten" | „Damit sind Audioaufnahmen deiner Stimme gemeint." |
| Nachrichten | DSR Abschnitt 3, „Nachrichtendaten" | nur wenn Funktion verfügbar und genutzt. Zur Verschlüsselung sagt die DSR nichts |
| Altersprüfung | DSR Abschnitt 3 | Ausweisfoto / Gesichtsfoto; „Alle Altersprüfungsdaten werden sofort nach der Altersprüfung gelöscht." |
| Zahlung | DSR Abschnitt 3 | „Aus Sicherheitsgründen speichert Spotify niemals deine vollständige Kartennummer." |
| Genauer Standort | DSR Abschnitt 3 und 4 | „nur mit deiner Erlaubnis"; „Die Erkenntnisse aus deinen Streams an einem Standort können wir nutzen, um anderen Nutzer*innen in der Nähe ähnliche Inhalte vorzuschlagen." |
| Daten von Werbepartnern | DSR Tabelle „Drittanbieterquellen" | „… einschließlich Gerätekennungen wie gehashte Kontaktinformationen. Außerdem liefern sie uns Rückschlüsse …" |
| dto., an Einstellung gekoppelt | https://www.spotify.com/de/legal/gdpr-article-15-information/ | „Sofern du individuelle Werbeinhalte nicht deaktiviert hast, erhalten wir Daten über dich von bestimmten Werbe- oder Marketingpartnern, einschließlich Gerätekennungen, verknüpfte E-Mail-Adressen und Telefonnummern." |
| Händler-Daten | DSR Tabelle „Zahlungspartner und Händler" | Weiterleitung zu Merch-/Ticket-Seiten, u. a. um „deine Interessen besser verstehen" |
| Werbung: Rechtsgrundlage | DSR Abschnitt 4 | „Andere Marketing- und Werbezwecke, für die das Gesetz keine Einwilligung verlangt" → „Berechtigtes Interesse"; Einwilligung nur für Cookies/E-Mail-Marketing |
| Werbung ohne Personalisierung | DSR Abschnitt 2 | „… basiert auf deinen Registrierungsdaten und Informationen über deine Echtzeitnutzung von Spotify" |
| KI-Training | DSR Abschnitt 4 | „Entwicklung und das Training von algorithmischen und Machine-Learning-Modellen"; „Entwicklung und Bereitstellung von Features wie KI-DJ und KI-Playlist" (berechtigtes Interesse) |
| Empfänger | DSR Abschnitt 5 | Dienstleister (u. a. „reCAPTCHA von Google"), Zahlungspartner, Werbepartner, Marketingpartner („… auch mit anderen Daten kombinieren, die sie über dich sammeln"), Podcast-Hosting („… wie deine IP-Adresse"), Forschende (pseudonymisiert), Spotify-Gruppe (Messunternehmen, Podcast-Unternehmen), Käufer, Behörden; Rechteinhaber erhalten „pseudonymisierte Daten zum Hörverhalten" (Abschnitt 4) |
| Aufbewahrung | DSR Abschnitt 6 | Suchanfragen „nach 90 Tagen gelöscht"; Streamingverlauf bis zur Kontolöschung; danach „gelöscht oder anonymisiert"; Ausnahmen für Rechtspflichten |
| Ext. Werbekunden | https://www.spotify.com/de/legal/cookies-policy/ („Gültig ab dem 23. Oktober 2025") | „Wenn du die Option „Individuelle Werbeinhalte" deaktivierst, wird Spotify deine Daten nicht mehr an externe Werbetreibende weitergeben." |
| Erweiterter Streamingverlauf | https://support.spotify.com/de/article/understanding-your-data/ | „… die du jemals mit deinem Konto angesehen oder -gehört hast"; Felder u. a. „Zum Streamen verwendete IP-Adresse", „Grund für das Ende der Wiedergabe", „Ob der*die Nutzer*in zum nächsten Song gesprungen ist", „Ob der Titel in einer privaten Session abgespielt wurde" (→ `surprise`) |
| Marktsegmente | dto., Paket Kontodaten, „Rückschlüsse" | „Dazu gehört eine Liste von Marktsegmenten, denen du derzeit zugeordnet bist." Dateiname „Inferences.json" laut Art.-15-Seite |
| Kontext-/Stimmungs-Targeting | https://ads.spotify.com/en-US/contextual-advertising/ | „playlist, genre, time of day, device type, and session behavior"; „identify what a listener is doing (e.g. working out, cooking, commuting, relaxing)"; „A lo-fi study mix signals focus and concentration." |
| Geschmacksprofil | https://support.spotify.com/de/article/exclude-playlists-or-tracks-from-your-taste-profile/ | „Mit dem Geschmacksprofil analysiert Spotify deinen Geschmack basierend darauf, was du auf welche Weise hörst." |
| Facebook-Daten | https://support.spotify.com/de/article/data-rights-and-privacy-settings/ | einschränkbar: Facebook-Name, Profilbild, Freund*innen; bleibt: E-Mail, Geburtsdatum, Geschlecht |
| Geschäftsmodell | SEC 6-K, Q2 2026 Update (4. August 2026) | Umsatz 4.777 Mio. €; Premium 4.331 Mio. €; Ad-Supported 446 Mio. € (≈ 9 %); 777 Mio. MAU; 300 Mio. Premium |
| Bußgeld IMY | https://www.imy.se/nyheter/sanktionsavgift-mot-spotify/ (13.06.2023) | 58 Mio. SEK; „bolaget inte informerar tillräckligt tydligt om hur dessa uppgifter används" |
| Bestätigung Gericht | TV4/TT, 03.06.2025 | „Spotify ska betala en sanktionsavgift på 58 miljoner kronor … enligt en dom i kammarrätten i Stockholm" (Urteil selbst nicht eingesehen) |
| Stimm-Patent | Access Now, 19.05.2021 | Patent zu „emotional state, gender, age, or accent"; Spotify: „never implemented … and we have no plans to do so" → nur als `possible` |

## Anleitungen

| Guide | Status | Grundlage |
|---|---|---|
| `spotify-tailored-ads` | verified | Cookie-Richtlinie: „Deaktiviere dazu den Schalter „Individuelle Werbeinhalte" auf der Seite Datenschutzeinstellungen für dein Konto"; Hilfe „Datenrechte …" verlinkt https://www.spotify.com/account/privacy/; Hilfe „Werbeeinstellungen verwalten" (Kategorien). |
| `spotify-download-data` | verified | Hilfe „Datenrechte …" („Deine Daten herunterladen", ZIP, „Bitte zuerst lesen!") + „Informationen zu deinen Daten" (3 Pakete). Dauer der Bereitstellung **nicht** belegt, daher nicht genannt. |
| `spotify-private-session` | verified | Hilfe „So aktivierst du „Privat Musik hören"" (Pfad mobil + Desktop, 6 Stunden, kontoweit). |
| `spotify-social-visibility` | verified | Hilfe „Einstellungen für Datenschutz und soziale Funktionen" + „Kürzlich gehörte Künstler*innen". |
| `spotify-connected-apps` | verified | Hilfe „Spotify mit anderen Apps verknüpfen" („ZUGRIFF ENTFERNEN", Link spotify.com/account/apps/). |
| `spotify-close-account` | verified | Hilfe „Schließen deines Kontos …" (Link spotify.com/account/close/, 7 Tage, 14 Tage). Die Schritte auf der Kontoseite selbst sind nicht beschrieben, deshalb nur „folge den Schritten". |
| `spotify-taste-profile` | verified | Hilfe „Playlist oder Song aus Geschmacksprofil ausschließen" (Menü-Symbol nur als Bild). |

## Widersprüche / nicht verifiziert

- **Standard der Höraktivität:** „Einstellungen für Datenschutz und soziale Funktionen" sagt „Standardeinstellung: „Ein" für Nutzer*innen ab 18"; „Höraktivität" (https://support.spotify.com/de/article/listening-activity/) sagt „Deine Höraktivität ist standardmäßig deaktiviert." Im Content deshalb keine feste Aussage, nur der Hinweis auf den Widerspruch (`defaults`, Guide-Methode). Einheitlich belegt ist nur: kürzlich gehörte Künstler*innen standardmäßig sichtbar.
- **Verschlüsselung von Spotify-Nachrichten:** nicht dokumentiert gefunden; Content sagt nur, dass die DSR dazu nichts sagt.
- **Ob „Individuelle Werbeinhalte" ab Werk an ist:** folgt aus der Widerspruchslogik (berechtigtes Interesse, „Sofern du … nicht deaktiviert hast"), wird aber nicht wörtlich als „Standard: an" formuliert.
- **Ob Premium-Konten Daten an Werbepartner geben:** Die DSR nennt Werbung in Podcasts auch bei Premium; die Hilfe beschreibt die Werbe-Einstellung als Option für „Nutzer*innen von Spotify Free". Content formuliert Werbung „vor allem in der kostenlosen Version".
- **Weitere Instanz zum IMY-Bußgeld** (Högsta förvaltningsdomstolen) nicht geprüft.
- **Ad-Studio-Hilfe** (Interessen-Kategorien wie „Cooking", „Fitness", Echtzeit-Kontexte) nur über Suchindex gesehen, nicht verwendet.
- Präziser Standort: kein Spotify-Hilfeartikel mit Schritten zur Berechtigung gefunden → kein eigener Guide.

## Hinweis zum Unternehmenseintrag

`content/companies.yaml` (`spotify`): „Spotify AB (Schweden)", Sitz Stockholm – stimmt mit der DSR überein. Die Muttergesellschaft ist Spotify Technology S.A. (Luxemburg, siehe SEC-Bericht); für Nutzer*innen ist aber Spotify AB verantwortlich. Keine Korrektur nötig.
