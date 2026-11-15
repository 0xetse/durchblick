# Alternativen – V2-Review

Stand: 2026-10-07. Betrifft `content/alternatives.yaml` und `content/sources/alternatives.yaml`.

## V2-Review (Komfort-Abwägungen)

**Leitlinie:** Alternativen sind keine Empfehlung. Jede Alternative nennt in `tradeOffs` konkret, worauf man im Alltag in Deutschland verzichtet oder was man gewinnt – im Format „Verzichtest du auf: …“, „Gewinnst du: …“, „Bleibt gleich: …“.

### Was geändert wurde

- **Komfort-Abwägungen ergänzt (alle 27 Alternativen):**
  - Karten: Live-Verkehr, Bus und Bahn mit Fahrplan, Öffnungszeiten und Bewertungen, Street View, CarPlay und Android Auto, Offline-Karten.
  - Messenger: Verbreitung der Kontakte, Backup, Desktop-App, Kosten.
  - E-Mail: Kalender und Kontakte, Speicher, eigene Domain, Preis, Mailprogramme.
  - Suche: lokale Treffer, Karten, Preisvergleich, Bilder.
  - Browser: Erweiterungen, Synchronisierung, Google-Konto.
  - Cloud: Office-Bearbeitung, Foto-Backup, Familien-Tarif.
  - KI: Antwortqualität, Dateien und Sprache, Training-Voreinstellung.
  - Video: Inhaltsauswahl – ehrlich: Für YouTube gibt es keinen gleichwertigen Ersatz.
- **„Ohne Wechsel“ konkretisiert:** Jede Kategorie nennt jetzt Einstellungen beim etablierten Dienst mit Namen. Beispiele: Drittanbieter-Cookies in Chrome, „Web- & App-Aktivitäten“, „Mein Anzeigen-Center“, „Intelligente Funktionen“ in Gmail, „Zeitachse“ und Inkognitomodus in Maps, Ende-zu-Ende-verschlüsseltes Chat-Backup und Datenschutz-Optionen in WhatsApp, „Erweiterter Datenschutz“ für iCloud, „Das Modell für alle verbessern“ und Memory in ChatGPT, YouTube-Verlauf. Menüpfade stehen nur dort, wo sie durch bestehende Anleitungen oder bekannte Oberflächen gedeckt sind.
- **Wertende Formulierungen neutralisiert:** Zum Beispiel „Starke Verzahnung mit Googles Werbegeschäft“, „Viel Werbung und eigene Dienste prominent platziert“, „Oberfläche wirkt weniger modern“, „Google ist meist deutlich besser“ und „Starke Ökosystem-Bindung“. Sie sind jetzt sachliche Beschreibungen.
- **Veraltetes korrigiert:**
  - Posteo bietet für 1 €/Monat jetzt 4 GB statt 2 GB.
  - Apple Karten bietet laut Apples Verfügbarkeitsliste in Deutschland Bus und Bahn, Fahrradrouten und „Umsehen“.
  - CoMaps unterstützt seit August 2025 CarPlay.
  - Signal hat ein verschlüsseltes Cloud-Backup: kostenlos 100 MiB und Medien der letzten 45 Tage, mehr für 1,99 USD/Monat.
  - Google Maps bietet herunterladbare Offline-Karten. Der frühere Hinweis „nur eingeschränkt“ ist jetzt präzisiert.
- **Neue Quellen:**
  - `alt-apple-feature-availability`
  - `alt-duckduckgo-apple-maps`
  - `alt-comaps-carplay`
  - `alt-osmand-android-auto`
  - `alt-signal-secure-backups`
  - `alt-winfuture-signal-backups` (Tier 2)
  - `alt-threema-desktop`
- **`needsVerification` auf `true` gesetzt:** Gmail, DuckDuckGo, Apple Karten, CoMaps, Signal, mailbox.org und PeerTube. Grund: Neue Komfort-Aussagen sind nicht vollständig mit Tier-1-Quellen belegt.

### Was ungeprüft bleibt

- **Preise:** Brave Search Premium, Tuta Revolutionary, Proton Drive Plus und Family, Tresorit, OsmAnd Maps+/Pro, Lumo Plus, ChatGPT Go, YouTube Premium, Nebula sowie Euro-Preise bei Signal, DuckDuckGo und Duck.ai.
- **Lokale Suche:** Wie gut Brave Search, Startpage und Ecosia lokale Infos liefern (Öffnungszeiten, Bewertungen, Preisvergleich), ist nicht systematisch getestet. Das gilt auch für DuckDuckGo-Fahrpläne.
- **Karten:**
  - Wie viele Bewertungen und Öffnungszeiten Apple Karten im Vergleich zu Google hat.
  - Echtzeitdaten für Bus und Bahn in Apple Karten je Region.
  - Android Auto bei CoMaps.
  - Ob CarPlay bei OsmAnd kostenpflichtig ist.
- **Messenger:** Ob Signal Secure Backups auf dem iPhone verfügbar ist, ist nur über WinFuture belegt (Tier 2). Threema Safe ist nicht in den Inhalt aufgenommen.
- **Cloud:** Funktionsumfang von Foto-Backup und Familien-Tarif bei Proton Drive; Office-Funktionen bei Tresorit; Office und Foto-Upload bei Nextcloud je Hoster.
- **KI:** Sprachfunktionen bei Lumo.
- **Video:** Apps für Smart-TV und Handy bei PeerTube.
- **Menüpfade:** Die genauen Pfade für „Intelligente Funktionen“ in Gmail, personalisierte Suchergebnisse bei Google und das WhatsApp-Chat-Backup sind nicht im Browser nachgeprüft.

## Nachprüfung 2026-10-21

Alle 25 Einträge mit `needsVerification: true` sind gegen Quellen der Anbieter (Tier 1) geprüft. Die oben genannten offenen Preise sind belegt, abgesehen vom YouTube-Premium-Preis: Dafür gibt es keine offizielle Preisseite, deshalb ist er entfernt. Die Foto-Backups und der Familientarif bei Proton Drive sind bestätigt. Bei Nextcloud nennt der Hoster nur Kalender, Kontakte und Aufgaben, deshalb fehlen dort jetzt die Office-Funktionen. Die Angabe „Sprachfunktionen nicht geprüft“ bei Lumo ist entfernt. 24 Einträge stehen jetzt auf `needsVerification: false`. Startpage bleibt offen: Dass die Ergebnisse von Google stammen, ist nicht offiziell belegt, und der Abo-Preis fehlt.
