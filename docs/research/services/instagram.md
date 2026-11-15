# Recherche-Notizen: Instagram (Meta)

Stand: 2026-10-07 · Dateien: `content/services/instagram.yaml`, `content/guides/instagram.yaml`, `content/sources/instagram.yaml`. Gemeinsame Meta-Quellen (`meta-*`) stehen in `content/sources/facebook.yaml`; Methodik-Hinweis zum US-Abruf siehe `docs/research/services/facebook.md`.

## Kernaussagen mit Beleg

| Aussage | Quelle | Beleg |
|---|---|---|
| Instagram fällt unter die Meta-Datenschutzrichtlinie | https://help.instagram.com/519522125107875 | identischer Text wie facebook.com/privacy/policy („Aktualisiert am 23. Juli 2026") |
| Kategorien, Nutzungsdauer, App-Vordergrund, Hashtags, Kamerafunktion | dto. | siehe Facebook-Notizen; gleiche Formulierungen |
| Kontaktsynchronisierung läuft regelmäßig | https://help.instagram.com/236691729788553 | „… deine Kontaktliste regelmäßig synchronisiert wird und deine Kontakte erneut hochgeladen werden" |
| Abschalten löscht nichts | dto. | „Wenn du das Synchronisieren der Kontakte deaktivierst, werden dadurch keine zuvor synchronisierten Kontakte gelöscht." |
| Nur gesammelt löschbar, bis 90 Tage, weiter Empfehlungen | dto. | „Du kannst keine einzelnen Kontakte von Instagram löschen."; „… bis zur endgültigen Löschung bis zu 90 Tage dauern kann. Während dieses Zeitraums empfiehlt dir Instagram möglicherweise weiterhin Inhalte basierend auf deiner Kontaktliste." (→ `surprise`) |
| Empfehlungen aus Kontaktliste (dokumentierte Ableitung) | dto. | „… erhältst du keine Empfehlungen mehr von Instagram, die auf der Kontaktliste deines Geräts basieren." |
| Schritte Kontakte (App + Computer) | dto. | Profil > Menü > Kontenübersicht > Deine Informationen und Berechtigungen > Kontakte hochladen > Mit Kontakten verknüpfen > Verbindung aufheben; Computer: Profil bearbeiten > Mehr dazu in der Kontenübersicht > … > Kontakte verwalten > Alle löschen |
| Export | https://help.instagram.com/181231772500920 | Mehr > Einstellungen > Meta-Konto > Deine Informationen und Berechtigungen > Deine Informationen exportieren > Export erstellen … Export starten |
| Löschung | https://help.instagram.com/139886812848894 | zwei Menüvarianten über Kontenübersicht; „Der Zeitraum bis zur endgültigen Löschung kann bis zu 90 Tage betragen." |
| Werbethemen gelten für Facebook und Instagram | https://www.facebook.com/help/247395082112892 | „… wovon du auf Facebook und Instagram weniger Werbung sehen möchtest" |
| Kontoübergreifende Werbung | https://www.facebook.com/help/562973647153813 | „Wenn du dein Facebook- und dein Instagram-Konto miteinander verknüpft hast, kann auch eine Aktivität auf Instagram beeinflussen, welche Werbung dir auf Facebook gezeigt wird." |
| EU-Werbewahl, KI-Training, DMA | siehe Facebook-Notizen | gilt für Facebook und Instagram gleichermaßen (DPC: „public content shared by adults on Facebook and Instagram") |

## Nicht verifiziert / bewusst weggelassen

- **Menüweg „weniger personalisierte Werbung" in der Instagram-App**: Der EU-Hilfeartikel beschreibt nur den Facebook-Weg → Guide `needs-verification`, keine Schritte. `accountscenter.instagram.com` nicht offiziell dokumentiert gefunden → nicht als officialUrl gesetzt.
- **Instagram-spezifische Altersschätzung, Karte/Standortteilen mit Freund*innen, Teen-Konten**: nicht recherchiert/verifiziert → nicht aufgenommen.
- **Verschlüsselung von Instagram-Direktnachrichten**: nicht geprüft.
- **Geburtsdatum als Pflichtangabe**: nicht auf einer abgerufenen Quelle bestätigt → weggelassen.

## Offene Fragen

- Instagram-Hilfeartikel zum Werbeerlebnis (EU) suchen und Schritte nachtragen.
- KI-Widerspruch: Formular/Menüweg aus EU-Netz prüfen (Kandidat: https://help.instagram.com/contact/767264225370182, nur angemeldet).

## Nachprüfung V2 (EU-Fassung)

Stand: 2026-10-07 · Methode wie in `facebook.md` (gerenderter Browser, de-DE, US-Netz).

**EU-Fassung der Datenschutzrichtlinie: nicht erhalten.** https://privacycenter.instagram.com/policy/?locale=de_DE und https://www.instagram.com/legal/privacy/ liefern dieselbe US-Fassung wie facebook.com (Details und Versuche: `facebook.md`).

**Folgen (Option c):** `confidence` von `high` auf `medium` gesenkt bei `breadth`, `observation`, `linkability`. `adUse` bleibt `high` (10-Q). Teil-Absicherung mit EU-Hilfeartikeln: `ig-activity` (+`meta-help-manage-ad-experience`), `ig-device` (+`meta-help-less-personalised-ads`, nur Gerätetyp). Die übrigen Aussagen aus `instagram-privacy-policy` (Metadaten, Nachrichten, besonders geschützte Daten, Weitergabe, Speicherdauer) bleiben für die EU ungeprüft.

**Instagram-Direktnachrichten und Ende-zu-Ende-Verschlüsselung (offizielle Quelle):**
- https://help.instagram.com/1165835007222763 („Ende-zu-Ende-Verschlüsselung auf Instagram“, gerendert de-DE): „Ende-zu-Ende-verschlüsselte Nachrichten auf Instagram werden seit dem 8. Mai 2026 nicht mehr unterstützt.“ und „Die anderen Ende-zu-Ende-verschlüsselten Chat-Optionen von Meta findest du auf WhatsApp.“ Kein Regionshinweis – gilt nach Wortlaut allgemein, also auch in der EU.
- Ergebnis: Instagram-Direktnachrichten sind 2026 **nicht** Ende-zu-Ende-verschlüsselt, weder standardmäßig noch optional. Dass die frühere Verschlüsselung nur freiwillig und nur in manchen Regionen verfügbar war, berichten nur Sekundärquellen (ppc.land, Columbia JEL) – nicht übernommen.
- Umgesetzt: neue Quelle `instagram-help-e2ee`; Feld `technical` von `ig-messages` korrigiert (vorher „nicht gesondert geprüft“). Die Stufe für `sensitivity` wurde **nicht** geändert – das entscheidet die Leitung. Ein Argument dafür: Meta kann Inhalte von Direktnachrichten technisch lesen; die Richtlinie nennt Nachrichten „einschließlich ihrer Inhalte, vorbehaltlich des anwendbaren Rechts“.

**Anleitungen (gerendert, de-DE):**
- `instagram-less-personalised-ads`: Keine Instagram-eigene Anleitung gefunden; die EU-Artikel-IDs liefern unter help.instagram.com eine Seite ohne Artikeltext. Bleibt `needs-verification`.
- `instagram-activity-other-businesses`: https://help.instagram.com/2885653514995517 (neue Quelle `instagram-help-activity-other-businesses`) nennt den App-Weg Profil > Menü > Kontenübersicht > Deine Informationen und Berechtigungen > Aktivitäten bei anderen Unternehmen – aber nur für „relevante Inhalte“, nicht für Werbung, und ohne EU-Hinweis. Facebook-Pendant verweist für Europa auf andere Optionen. Bleibt `needs-verification`.
- `instagram-ai-training-objection`: Formular https://help.instagram.com/contact/767264225370182 (Anmeldehinweis) als `officialUrl` gesetzt, belegt durch `meta-hmbbfdi-ai-objection-2025`. Bleibt `needs-verification`, keine Schritte.

**Sprache:** Primärtexte vereinfacht wie bei Facebook. Korrigiert: Export-Anleitung sagte „passwortgeschützt angefordert“ – das stand nicht im Hilfeartikel und wurde entfernt.

## Nachprüfung 2026-10-21

Methode: gerenderter Browser (Playwright, de-DE und en-GB, US-Netz).

- `instagram-less-personalised-ads` → **verified.** Über die Suche im Instagram-Hilfebereich gefunden: https://help.instagram.com/426488546963771 („Verwalten, ob du mehr oder weniger stark personalisierte Werbung sehen möchtest“, neue Quelle `instagram-help-manage-ad-experience`), mit „Diese Option ist nur in der Region Europa verfügbar.“ App (`?cms_platform=android-app` / `iphone-app`): „Tippe in der Instagram-App auf dein Profilbild. Tippe auf Menü und dann auf Kontenübersicht. Tippe auf Werbepräferenzen und anschließend im Tab Informationen verwalten auf Werbeerlebnis. … Tippe zur Bestätigung auf Bestätigen.“ Computer: „Klicke unten links auf Mehr und dann auf Einstellungen. Klicke im linken Menü auf Kontenübersicht. …“ Englisch nennt „Meta Account“.
- `instagram-activity-other-businesses` → bleibt **needs-verification**. https://help.instagram.com/2885653514995517 (Android-Ansicht): Profil > Menü > Meta-Konto > Deine Informationen und Berechtigungen > „Aktivitäten von anderen Unternehmen“; nur „relevante Inhalte“, kein EU-Hinweis. Facebook-Pendant verweist für Europa weiter auf andere Werbeoptionen.
- `instagram-ai-training-objection` → bleibt **needs-verification**. https://help.instagram.com/2060335334241802 (Widerspruch in Meta-Produkten) zeigt „Diese Informationen sind in deiner Region nicht verfügbar.“
