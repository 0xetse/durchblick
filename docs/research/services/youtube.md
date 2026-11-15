# Recherche: YouTube

Stand: 2026-10-07 · Perspektive: erwachsene Person in DE/EU mit Google-Konto · Inhalte: `content/services/youtube.yaml`, `content/guides/youtube.yaml`, `content/sources/youtube.yaml` (nutzt zusätzlich Google-Quellen aus `content/sources/google.yaml`)

## Kernbefunde mit Beleg

| Aussage | Quelle | Beleg |
|---|---|---|
| Verlauf → Empfehlungen | https://support.google.com/youtube/answer/95725?hl=de | „Wenn er aktiviert ist, können wir dir relevante Videoempfehlungen geben“ |
| Ohne Verlauf keine Startseiten-Empfehlungen | ebd. | „werden YouTube-Funktionen wie Empfehlungen auf der YouTube-Startseite entfernt“ (wenn deaktiviert und kein nennenswerter bisheriger Verlauf) |
| Schritte pausieren/auto-löschen (Computer) | ebd. | Meine Aktivitäten → Tab „Steuerung“ → „Deaktivieren“; YouTube-Verlauf → „Verlauf verwalten“ → „Automatisch löschen“ → Zeitraum → „Weiter“ → „Bestätigen“; „LÖSCHEN“ entfernt auch Suchverlauf des Zeitraums |
| Suchverlauf | https://support.google.com/youtube/answer/57711?hl=de (Android) | Schritte bis „Suchanfragen bei YouTube speichern“; „Gelöschte Suchanfragen wirken sich nicht mehr auf Empfehlungen aus.“ |
| Erfasste Daten, Standort | https://support.google.com/youtube/answer/10364219?hl=de | „YouTube schätzt deinen aktuellen Standort anhand des Gerätestandorts, der in deinem Google-Konto gespeicherten Privat- oder Arbeitsadresse und deiner IP‑Adresse“ |
| Werbung auch in anderen Google-Diensten | ebd. | „Deine Aktivitäten und Informationen können außerdem zur Personalisierung von Anzeigen auf YouTube und in anderen Google-Diensten verwendet werden.“ |
| Kein Verkauf | ebd. | „YouTube verkauft deine personenbezogenen Daten nicht.“ |
| Kanal löschen | ebd. | „Dadurch werden deine Inhalte endgültig gelöscht, einschließlich aller Videos, Kommentare, Nachrichten und Playlists.“ |
| Kanal löschen – Schritte (2026-10-21) | https://support.google.com/youtube/answer/55759?hl=de | YouTube Studio → „Einstellungen“ → „Kanal“ → „Erweiterte Einstellungen“ → „YouTube-Inhalte entfernen“ → „Ich möchte meine Inhalte endgültig löschen“ → „Inhalte löschen“; laut Seite nicht über Mobilgeräte möglich |
| Werbefaktoren (angemeldet) | https://support.google.com/youtube/answer/3181017?hl=de | Sinngemäß (Abruf 2026-10-07): angesehene Videos, Apps auf dem Gerät und ihre Nutzung, besuchte Websites, gerätebezogene anonyme Kennungen, frühere Interaktionen mit Google-Werbung, Standort, Altersgruppe, Geschlecht und Interaktionen mit Videos. **Nachprüfen:** Am 2026-11-14 nannte die Seite im abgerufenen Text nur Google-Ads-Einstellungen, YouTube-Verlauf und Kontostatus; die Liste war dort nicht (mehr) zu finden. |
| Werbung ohne Anmeldung | ebd. | „Auch wenn du nicht angemeldet bist, hängen die eingeblendeten Anzeigen von den Inhalten der Videos ab, die du dir angesehen hast.“ |
| Empfehlungssignale | https://www.youtube.com/howyoutubeworks/product-features/recommendations/ | „viewing behavior, likes, dislikes, subscriptions, and feedback, including from satisfaction surveys“ |
| Werbung in der App ausschalten | https://support.google.com/My-Ad-Center-Help/answer/12155656?hl=de | YouTube-App Android (angemeldet): Konto → Einstellungen → Datenschutz → „Einstellungen für Werbung bei Google“ → Personalisierte Werbung An/Aus → bestätigen |
| Auto-Löschen 36 Monate | https://blog.google/intl/de-de/unternehmen/technologie/neue-funktionen-privatsphare (2020) | „das Zeitfenster für das automatische Löschen der Daten auf 36 Monate gesetzt wird, wenn ihr euch dort neu anmeldet oder den YouTube-Verlauf das erste Mal aktiviert“ |
| DMA-Verknüpfung | https://support.google.com/accounts/answer/14202510?hl=de | YouTube ist unter den verknüpfbaren Diensten |
| Umsatz | SEC 8-K Exhibit 99.1, Q4 2025 | „YouTube ads 11,383“ (Mio. USD, Q4 2025); „YouTube revenue across ads and subscriptions exceeded $60 billion for the full year 2025“ |

## Nicht verifiziert / bewusst weggelassen

- **Jugendschutz/Altersschätzung:** Altersschätzung per ML ist offiziell nur für die USA beschrieben (Google-Blog 02/2025); EU-Status nicht belegt → nicht aufgenommen. Keine belastbare offizielle Quelle zu „keine personalisierte Werbung unter 18“ in der EU abgerufen → weggelassen.
- **Verweildauer/Wiedergabezeit als Signal:** auf der abgerufenen „How YouTube Works“-Seite nicht wörtlich gefunden; nur „viewing behavior“.
- **Suchverlauf-Schritte für iOS/Computer** nicht abgerufen (nur Android).
- **Kanal löschen:** Schrittfolge nicht abgerufen → `needs-verification`.
- **Takeout-Produktname „YouTube und YouTube Music“** nicht geprüft; Guide formuliert neutral.
- Ob die YouTube-spezifische 36-Monats-Voreinstellung 2026 unverändert gilt, ist nur über den Blogbeitrag von 2020 belegt.

## Offene Fragen

- `defaults` = 2 ist redaktionell: Auto-Löschen existiert als Voreinstellung, aber mit 36 Monaten lang; Verlauf standardmäßig aktiv ist nicht explizit belegt (abgeleitet aus Funktionsweise).
- Gibt es eine eigene YouTube-Datenschutzerklärung? Nicht geprüft; Inhalte stützen sich auf die Google-Datenschutzerklärung und YouTube-Hilfeseiten.
