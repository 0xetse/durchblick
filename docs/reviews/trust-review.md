# Trust-Review

Datum: 2026-10-07 · Prüffrage einer skeptischen Besucherin:

> **„Warum sollte ich einer Website vertrauen, die mir sagt, ich soll Websites meine Daten nicht anvertrauen?"**

## Antwort in einem Satz

Weil Durchblick so gebaut ist, dass es deine Daten gar nicht bekommen *kann* – und weil du das selbst nachprüfen kannst, statt es glauben zu müssen.

## Prüfung nach fünf Ebenen

| Ebene | Was die Skeptikerin prüfen kann | Befund | Bewertung |
|---|---|---|---|
| **Architektur** | Gibt es einen Ort, an dem meine Daten landen könnten? | Kein Backend, keine Datenbank, keine Konten, keine Formulare mit Serverziel. Statische Dateien. Berechnung im Browser. | ✅ stark |
| | Laden Dritte mit? | Null Anfragen an fremde Server – auch keine Schriften. Durch CSP technisch begrenzt und durch E2E-Test für alle Hauptseiten belegt (`tests/e2e/trust.spec.ts`). | ✅ stark |
| **Verhalten** | Wird ohne Zustimmung gespeichert? | Nein. Erst beim ersten „Erledigt" kommt die Frage; „Nein, nur für jetzt" funktioniert vollwertig. Auswahl lebt im URL-Fragment, das Browser nicht senden. Test vorhanden. | ✅ stark |
| | Kann ich alles löschen? | Ein Klick auf `/transparenz/`; Widerruf löscht automatisch alles. Export als JSON. | ✅ |
| **Transparenz** | Sehe ich, was passiert? | `/transparenz/` zeigt live Anzahl und Ziel aller Netzwerkanfragen, Cookies (0) und jeden gespeicherten Schlüssel mit Klartext-Erklärung und Inhalt. | ✅ Alleinstellungsmerkmal |
| | Ist die Formulierung ehrlich? | Wir sagen bewusst **nicht** „Nichts verlässt dein Gerät", weil das Hosting beim Seitenabruf die IP sieht. Wir sagen: „Deine Auswahl, deine Antworten und dein Fortschritt verlassen dein Gerät nicht." | ✅ |
| **Copy** | Klingt die Seite nach Angst oder Verkauf? | Ruhig, du-Form, keine Alarmfarben, keine „Datenkrake". Kein Upsell, kein Newsletter-Popup, keine Affiliate-Links. | ✅ |
| **Design** | Wirkt es wie ein Sicherheits-Produkt, das Angst verkauft? | Warme Papierfarbe, Serifen-Typo, keine Schlösser/Hacker-Motive; „Keine Tracker"-Hinweis ist ein ruhiges Etikett, das auf Beweise verlinkt. | ✅ |
| **Inhalte** | Woher weiß ich, dass die Aussagen stimmen? | Jede Aussage über Dienste hat Quelle + Abrufdatum; Gewissheit sichtbar; Anleitungen mit Prüfstatus. Methodik offen. | ✅ |

## Schwachstellen, ehrlich benannt

| # | Schwachstelle | Warum es zählt | Maßnahme |
|---|---|---|---|
| W1 | **Kein Impressum/Betreiber** sichtbar (Vorabversion) | Anonyme Datenschutz-Seiten wirken unseriös; in DE Pflicht | vor Launch: D-N4 |
| W2 | **Quellcode nicht öffentlich** | „Prüf es selbst" endet an der Netzwerkansicht; Fortgeschrittene wollen Code sehen | Empfehlung Open Source (D-N7) |
| W3 | **Hosting unbekannt** | Der einzige echte Datenfluss (IP beim Abruf) hängt am Hoster; ein CDN mit Skript-Injektion würde das Versprechen brechen (CSP würde es zwar blockieren, aber die Anfrage wäre schon erfolgt) | D-N5; E2E-Test gegen die Produktions-URL nach Deployment |
| W4 | Die Live-Ansicht misst nur die aktuelle Seite | Eine Skeptikerin könnte fragen: „Und auf den anderen Seiten?" | Text erklärt das; Test deckt alle Hauptseiten ab. Später: Ergebnis des CI-Tests öffentlich verlinken |
| W5 | Viele Anleitungen „noch nicht geprüft" (TikTok, ChatGPT, Teile von Meta), weil Hilfeseiten für automatisierte Abrufe gesperrt waren | Ehrlich gekennzeichnet, aber weniger hilfreich | manuelle Prüfung im Browser vor Launch (siehe STATUS) |
| W6 | Keine Finanzierung erkennbar | „Wovon lebt ihr?" ist eine legitime Vertrauensfrage | D-N8; sobald entschieden, auf `/methodik/` offenlegen |

## Urteil

Die Architektur- und Verhaltens-Antwort ist **überzeugend und nachprüfbar** – stärker als bei allen analysierten Wettbewerbern, von denen mehrere selbst Analyse-Skripte laden (siehe `docs/research/competitive-analysis.md`). Für eine Veröffentlichung fehlen die **organisatorischen** Vertrauenssignale (W1, W2, W6). Diese sind Entscheidungen des Maintainers, nicht technische Lücken.

## Trust-Review 2.0 (V2, 2026-10-07)

**Änderung:** Die Antwort auf die Skepsis ist jetzt dort, wo sie entsteht. „Keine Tracker" in der Kopfzeile ist kein Siegel mehr, sondern öffnet auf jeder Seite **„Was weiß Durchblick über dich?"** mit dem tatsächlichen, live gemessenen Zustand:

| Zeile | Quelle des Werts | Wahr per Konstruktion oder gemessen? |
|---|---|---|
| Konto: keins | Architektur (kein Backend) | per Konstruktion |
| Cookies: 0 | `document.cookie` | gemessen |
| Tracker und Werbung: keine | Architektur + E2E-Test | per Konstruktion, getestet |
| Verbindungen zu fremden Servern (diese Seite): 0 | Resource Timing des Browsers | gemessen |
| Auf diesem Gerät gespeichert: nichts / n Einträge | `localStorage`, Namensraum `durchblick:` | gemessen |
| „Durchblick weiß gerade: Ausgewählt: Instagram, Google – steht nur in der Adresszeile, wird nicht an uns gesendet" | URL-Fragment + gespeicherte Auswahl | gemessen |

Dazu „Alles löschen" direkt im Panel. Die Formulierung „Nichts verlässt dein Gerät" wird weiterhin **nicht** pauschal verwendet.

**Neue Schwachstelle:** Das Panel ist auf einen Knopf angewiesen, der wie ein Siegel aussieht („Keine Tracker"). Hypothese für den Nutzertest: Wird er als klickbar erkannt? Alternative: Beschriftung „Was weiß Durchblick?".

**Unverändert offen:** Impressum/Betreiber (W1), offener Quellcode (W2), Hosting (W3), Finanzierung (W6).
