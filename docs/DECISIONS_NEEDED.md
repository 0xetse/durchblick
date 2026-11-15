# Offene Entscheidungen

Nicht blockierend, solange das Produkt nicht veröffentlicht wird. Für jede Frage ist eine Annahme gesetzt, mit der weitergearbeitet wird.

## Blockierend für den nächsten externen Schritt

| ID | Frage | Empfehlung | Alternative | Warum wichtig | Annahme ohne Entscheidung |
|---|---|---|---|---|---|
| D-N1 | ✅ **Erledigt 2026-10-07:** eigenes Repository für das Produkt (D-001). | – | – | – | – |
| D-N2 | ✅ **Erledigt:** Durchblick wird als eigenständiges Projekt geführt. | – | – | – | – |

## Vor einer Veröffentlichung

| ID | Frage | Empfehlung | Alternative | Warum wichtig | Annahme |
|---|---|---|---|---|---|
| D-N3 | **Produktname / Domain** | Namens- und Markenprüfung für „Durchblick" (sehr generisch, wahrscheinlich nicht schützbar) oder eigenständigeren Namen wählen | „Datenspur", Kunstwort | Marke, Domain, Verwechslung | Arbeitstitel bleibt |
| D-N4 | **Betreiber, Impressum, Kontakt, security.txt** | Betreiber festlegen (Privatperson vs. Organisation); eigene Kontaktadresse für Korrekturen/Sicherheit | – | gesetzliche Pflicht (DDG), Vertrauen | Platzhalter, als Vorabversion gekennzeichnet |
| D-N5 | **Hosting** | EU-Static-Host mit abschaltbaren bzw. IP-gekürzten Logs, ohne Skript-Injektion, `_headers`-Support | US-CDN (schneller, aber Drittlandtransfer und mögliche Skript-Injektion) | einzige echte personenbezogene Verarbeitung | für Tests gewählt: ein EU-Static-Host (D-055); für den Start offen (Kandidaten u. a. EU-Static-Hosts, Uberspace, Bunny) – Log-Speicherung und AV-Vertrag vor dem Launch klären |
| D-N6 | **Rechtliche Prüfung** der Dienst-Einordnungen (Datenprofil) und Formulierungen | Prüfung durch Anwalt für Medien-/Wettbewerbsrecht vor Launch | Launch ohne Datenprofil (nur Fakten) | Bewertungen von Unternehmen sind angreifbar (UWG, Äußerungsrecht) | Datenprofil bleibt, mit Methodik |
| D-N7 | ✅ **Entschieden 2026-11-14 (D-058):** Quellcode unter MIT, eigene Inhalte und Dokumentation unter CC BY 4.0, Material Dritter ausgenommen (`LICENSE-CONTENT.md`); Veröffentlichung als neues öffentliches Repository mit neuer Historie. — **Open Source?** | – | – | stärkstes Vertrauenssignal („prüf den Code“); Community-Korrekturen | – |
| D-N8 | **Finanzierung / Pflege** | Förderung (z. B. Prototype Fund), Spenden, keine Werbung | Freemium-Funktionen | Wettbewerbsanalyse: Mozilla *Privacy Not Included und mobilsicher.de sind an Pflegeaufwand/Finanzierung gescheitert | keine |

## Fachlich (keine Eile)

| ID | Frage | Empfehlung | Annahme |
|---|---|---|---|
| D-N9 | Nächste Dienste | LinkedIn, Microsoft (Konto/Windows/Bing), Apple, Spotify | Branch `v4-weitere-dienste` (2026-10-08): Spotify, LinkedIn, Telegram, Snapchat, PayPal, Netflix ergänzt (14 Dienste); offen: Microsoft (Konto/Windows/Bing), Apple |
| D-N10 | ✅ **Erledigt 2026-10-19 (D-054):** komplette englische Fassung unter `/en/` mit Sprachumschalter, Inhalte als Overlays (ADR-0004). — Englisch als zweite Sprache | nach Inhaltsstabilisierung | nur Deutsch |
| D-N11 | Prüfrhythmus der Anleitungen | quartalsweise + anlassbezogen; Verantwortliche Person | „Möglicherweise veraltet" nach 6 Monaten |
| D-N12 | Anonymes Feedback („Hat das geholfen?") | ja, ohne Kennung, nach eigenem ADR | kein Feedback-Kanal |

## Aus dem inhaltlichen Red-Team-Review (`docs/reviews/content-red-team.md`)

| ID | Frage | Empfehlung | Annahme |
|---|---|---|---|
| D-N13 | Meta-Datenschutzrichtlinie wurde nur in der US-/globalen Fassung abgerufen | aus einem EU-Netz neu abrufen und Facebook/Instagram gegenprüfen (O-01) | Aussagen bleiben, Konfidenz-Hinweis in Recherche-Notizen |
| D-N14 | Soll die aufgehobene Garante-Entscheidung gegen OpenAI erwähnt werden? | nein, solange keine Primärquelle zum Urteil vorliegt (O-03) | nicht erwähnt |
| D-N15 | Aussagen zu laufenden Verfahren (TikTok/DPC) | vor Launch gegen Urteil bzw. DPC-Mitteilung prüfen; bis dahin „laut Berichten" (O-04) | „laut Berichten" |
| D-N16 | Einordnung `chatgpt.sharing` (2 → 3?) | anheben, sobald ein Tier-1-Beleg zu Werbekunden-Berichten vorliegt (A-02) | 2 |

## Neu aus der Validierungsphase (V2)

| ID | Frage | Empfehlung | Alternative | Warum wichtig | Annahme ohne Entscheidung |
|---|---|---|---|---|---|
| D-N17 | **Nutzertest durchführen** (5–8 Personen, `docs/research/usability-test-plan.md`): wer rekrutiert, Aufwandsentschädigung? | 8 Sitzungen à 30 Min, 20–30 € Gutschein je Person, Rekrutierung im erweiterten Umfeld (keine IT/Datenschutz-Profis) | Guerilla-Tests (5 × 10 Min) | ohne echte Nutzer bleibt V2 eine Hypothese | Plan liegt bereit, Test findet nicht statt |
| D-N18 | **Produktname** aus der Shortlist (`docs/product/naming-exploration.md`) | Lichtung, Mirala oder Spurlicht in eine professionelle Markenrecherche geben; „Durchblick" nicht als Marke | „Durchblick" behalten (schwer schützbar, bestehende App gleichen Namens) | Domain, Marke, Wiedererkennung | Arbeitstitel |
| D-N19 | Darf Durchblick die **Nutzertests datensparsam protokollieren** (Bildschirmaufzeichnung)? | nur Notizen, Aufzeichnung nur mit schriftlicher Einwilligung und Löschung nach Auswertung | gar keine Aufzeichnung | Glaubwürdigkeit des Produkts gilt auch für seine Forschung | nur Notizen |
| D-N20 | ⏸ **Abgelöst durch D-N23** (Tunnel war mehrfach offline; Test-Link jetzt bei einem EU-Static-Host, D-055). Vorher vorläufig entschieden 2026-10-08 (D-047): Remote-Tests über einen Cloudflare Quick Tunnel vom eigenen Rechner (Zufallsadresse, `noindex`, nur solange Rechner und Tunnel laufen). EU-Hoster bleibt das Ziel. — **Remote-Tests:** temporäre, nicht öffentlich verlinkte Vorschau-Adresse für den Test-Build? | nur falls Remote-Teilnehmende nötig: privater Vorschau-Link bei einem EU-Hoster ohne Analyse-Skripte, nach dem Test wieder löschen | nur Vor-Ort-Tests (WLAN) bzw. Bildschirmfreigabe vom eigenen Gerät | eine erreichbare Adresse ist eine Veröffentlichung (bewusste Freigabe nötig) | nur Vor-Ort/Bildschirmfreigabe |
| D-N21 | ✅ **Erledigt 2026-10-07:** V3 übernommen, als Testbuild 0.3.0 markiert, Testunterlagen angepasst (D-046). — **Testbuild:** Nutzertest mit V2 (Testbuild 0.2.0) oder mit der V3-Oberfläche (eigener Branch)? | V3 übernehmen, als Testbuild 0.3.0 markieren und die zwei geänderten Beschriftungen im Moderationsblatt/Beobachtungsbogen anpassen – getestet werden soll, was ausgeliefert würde | V2 testen wie eingefroren, V3 danach separat prüfen | V3 ändert die Darstellung des Kernerlebnisses (Matrix statt Grafik); Ergebnisse aus V2 übertragen sich nur teilweise | Test mit V2, V3 bleibt auf dem Branch |
| D-N22 | **Instagram-Kanal** als zweiter Weg zu den Menschen (Konzept und Entwürfe liegen nicht öffentlich vor)? | ja, mit offen benanntem Meta-Widerspruch, ohne bezahlte Werbung und Tracking-Links; Handle reservieren, sobald der Name steht (D-N18); Start mit oder kurz vor der Webseite | kein Social Media; anderer Kanal (Mastodon, Newsletter) | erreicht „Unbekümmerte“, die nie nach der Webseite suchen würden; Glaubwürdigkeitsrisiko, weil Meta selbst beschrieben wird | Konzept und Entwürfe liegen bereit, kein Konto, nichts veröffentlicht |
| D-N23 | ✅ **Entschieden 2026-10-19 (D-055):** Test-Link bei einem **EU-Static-Host** statt Cloudflare Pages, automatischer Upload nach grüner CI auf `main`; keine Links je Branch, Branches per manuellem Workflow-Lauf. Der Deploy ist im veröffentlichten Quellcode nicht enthalten. — **Test-Link statt Tunnel:** dauerhafter Test-Hoster mit `noindex`? | ja, für die Testphase | Cloudflare Pages (Link je Branch, aber USA); oder weiter Tunnel | zwei Testpersonen fanden die Seite offline vor; ohne stabilen Link keine verlässlichen Remote-Tests | – |

## Neu aus dem Audit 2026-11 (`docs/reviews/audit-2026-11.md`)

| ID | Frage | Empfehlung | Alternative | Warum wichtig | Annahme ohne Entscheidung |
|---|---|---|---|---|---|
| D-N24 | ✅ **Entschieden 2026-11-13 (D-057): `sessionStorage` + Teilen nur auf Wunsch, umgesetzt mit der Stabilisierung (November 2026).** — **Entscheidungsvorlage mit Messungen: [`docs/privacy/d-n24-entscheidungsvorlage.md`](privacy/d-n24-entscheidungsvorlage.md)** (2026-11-12: gemessen, dass jeder Zwischenstand der Auswahl in der Verlaufsdatenbank von Chromium und Firefox landet; Empfehlung `sessionStorage` + Teilen nur auf Wunsch). — **Auswahl im Browserverlauf:** Die App-Auswahl steht in der Adresse (`#d=…`). Sie geht nie an den Server, aber der Browser kann sie im Verlauf behalten und mit Browser-Sync beim Browserhersteller ablegen. Soll die Auswahl ohne Zustimmung nur noch im Arbeitsspeicher leben? | vorerst behalten und offen benennen (umgesetzt: Hinweis im Vertrauens-Panel, „Alles löschen“ leert auch die Adresse); vor dem Launch im Nutzertest prüfen, ob geteilte Links genutzt werden | Auswahl beim Öffnen aus der Adresse lesen und sofort entfernen; Weitergabe zwischen Seiten über `history.state`/`sessionStorage`; Teilen nur über einen Knopf „Link mit meiner Auswahl kopieren“ | Datensparsamkeit vs. einfaches Teilen und Weitergeben ohne Speicher; `sessionStorage` wäre eine Speicherung, die heute ausgeschlossen ist | Fragment bleibt, Hinweis sichtbar |
| D-N25 | ✅ **Umgesetzt 2026-11-12, Nachpflege offen:** `actions/checkout` und `actions/setup-node` auf v4.4.0 per Commit-SHA gepinnt (CI und Deploy), `persist-credentials: false` in allen Checkouts. — **Wie Aktualisierungen kommen:** Dependabot für `github-actions` (eine Datei `.github/dependabot.yml`, GitHub-eigen, kein Drittanbieter) oder manuell vierteljährlich per `git ls-remote` | Dependabot aktivieren | manuell | gepinnte SHAs veralten still; v4 läuft auf Node 20, das GitHub nur noch erzwungen auf Node 24 ausführt (Warnung im CI-Log) – Umstieg auf v5 ist ein eigener Schritt | gepinnt, manuelle Pflege |
| D-N26 | ✅ **Entschieden 2026-11-14 (D-059):** Kontakt `etse@posteo.de` für Verhaltenskodex und als Ausweichweg für Sicherheitsmeldungen. — **Kontakt für den Verhaltenskodex** (vertrauliche Meldungen) | – | – | Meldungen müssen vertraulich möglich sein | – |
| D-N27 | **HSTS `preload`** in `public/_headers` | erst setzen, wenn eine eigene Domain dauerhaft feststeht; bis dahin `preload` streichen oder bewusst behalten | sofort behalten | Preload-Listen sind praktisch nicht rückholbar | unverändert, wirkt erst mit eigener Domain |
