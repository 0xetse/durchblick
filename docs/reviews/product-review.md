# Multi-Perspektiven-Review & Red Team (Produkt)

Datum: 2026-10-07 · Gegenstand: MVP-Stand vom 2026-10-07. Inhaltlicher Faktencheck separat: `content-red-team.md`.

## Rollen-Reviews

| Rolle | Frage | Befund | Konsequenz |
|---|---|---|---|
| **Produkt** | Löst das das Nutzerproblem? | Ja für „verstehen" und „erste Schritte". Schwächer für „dranbleiben": ohne Änderungsmonitor gibt es wenig Grund wiederzukommen. | Änderungsprotokoll als nächstes großes Feature (STATUS). |
| **UX** | Versteht eine normale Person das? | Startseite und Spuren: ja, in Sekunden. Dienstseiten sind lang; durch Sprungnavigation, aufklappbare Datenpunkte und feste Vier-Fragen-Struktur beherrschbar. Badges (Herkunft + Gewissheit + Bedingung) können pro Datenpunkt viel sein. | Badges bleiben, weil sie den Kern (belegt vs. möglich) tragen; Legende direkt darunter. Nutzertest nötig. |
| **Privacy** | Widerspricht etwas unseren Prinzipien? | Nein. Speicherung erst nach Zustimmung, keine Drittanfragen (Test), präzise Formulierung zum Hosting. | – |
| **Research** | Sind Aussagen belegt? | Schema erzwingt Quellen; 179 Quellen, Recherche-Notizen mit Zitatstellen. Schwachstellen: einige OpenAI-Fakten nur über Suchtreffer offizieller Seiten (403 beim Abruf), Meta-Seiten teils in US-Fassung ausgeliefert. | Gekennzeichnet in Notizen und `needs-verification`; manuelle Browserprüfung vor Launch. |
| **Engineering** | Wartbar? | Domain-Logik framework-unabhängig und getestet; Content als Daten; 4 Laufzeitabhängigkeiten. | – |
| **Security** | Risiko? | CSP mit Hashes, keine Inline-Styles, `noreferrer`, Allowlist für offizielle Links, keine Secrets. Dev-Abhängigkeit mit bekanntem DoS-Befund (nicht ausgeliefert). | Header beim Hosting verifizieren. |
| **Accessibility** | WCAG 2.2 AA? | axe-Prüfung (2.0–2.2 A/AA) auf 10 Seiten in hell und dunkel ohne Befund; Tastatur, Skip-Link, Fokus, Reduced Motion, Tabellen statt Nur-Grafik. | Manuelle Screenreader-Prüfung (VoiceOver/TalkBack) noch offen. |

## Red Team: Kritische Fragen

| Frage | Antwort | Maßnahme |
|---|---|---|
| **Übertreiben wir Risiken?** | Tendenz zur Ausgewogenheit: Jede Maßnahme sagt, was sie *nicht* ändert; Ableitungen sind als „möglich" markiert. Risiko liegt im Simulator: Einschätzungen wie „Wahrscheinlich bald Eltern" wirken stark. | Simulator-Texte nennen Unsicherheit und Alternativerklärungen; Hinweis „vereinfachte Lernhilfe, Systeme liegen oft daneben". |
| **Sind Fakten belegt?** | Ja, strukturell erzwungen. | Red-Team-Faktencheck (`content-red-team.md`). |
| **Sind die Einordnungen verteidigbar?** | Besser als ein Score; trotzdem redaktionelle Wertung. | Keine Zahl, keine Rangliste, Rubrik öffentlich; Rechtsprüfung vor Launch (D-N6). |
| **Annahmen als Fakten?** | Gefahrenstelle: „Fußabdruck"-Themen (generische Texte, z. B. „können über ein gemeinsames Konto verbunden sein"). | Formulierungen im Konjunktiv/„können", Verweis auf Dienstseiten mit Belegen. **Behoben:** KI-Thema erschien bei WhatsApp/Instagram, obwohl Meta AI optional ist – jetzt nur für KI-Assistenten. |
| **Erzeugen wir unnötige Angst?** | Farb- und Sprachwahl dagegen; „Wusstest du?"-Fakten sind überraschend, aber sachlich. | – |
| **Hilft es wirklich?** | Ja, wenn Anleitungen stimmen. Nur 28 von 48 Anleitungen haben bestätigte Schritte; der Rest verlinkt nur die offizielle Seite. | Manuelle Verifikation priorisieren (ChatGPT hat 0 geprüfte; TikTok 5 von 6 nach Browser-Prüfung). |
| **Könnte eine Privacy-Aussage irreführen?** | „Keine Tracker"-Hinweis ist wahr für die Seite selbst; Hosting-Logs werden offen erklärt. Die Zählung „0 Anfragen an fremde Server" ist durch Tests belegt, aber nur, solange der Hoster nichts einschleust. | Nach Deployment Trust-Test gegen Produktions-URL laufen lassen. |
| **Verletzt die Seite ihre eigene Philosophie?** | Nein. Externe Links mit `noreferrer`; keine Einbettungen. | – |
| **Ist die UX zu kompliziert?** | Navigation ist schlank (4 Einträge). Der Plan kann bei 8 Diensten ~40 Maßnahmen haben. | Gruppierung nach Zeit; „größte Hebel" im Fußabdruck als Einstieg. Später: „Nur die wichtigsten 5"-Ansicht. |
| **Erklären wir Technik statt Folgen?** | Stufe 1 ist folgenorientiert, Technik erst in Stufe 3. Datenreise ist bewusst technisch – eingebettet in Frage 2. | – |
| **Gibt es ein einfacheres Erlebnis?** | Ja: Start → Spuren → „Was kann ich tun?" (5-Minuten-Plan) erfüllt das Erfolgskriterium ohne Dienstauswahl. | Startseite verlinkt beide Wege prominent. |

## In diesem Durchgang behoben

1. Horizontales Scrollen auf Mobil durch die Datenarten-Matrix (versteckte Tabellenlabels entkamen dem Scroll-Container) → behoben, Test für alle Hauptseiten ergänzt.
2. Ergebnis des Simulators lag auf Mobil weit unter den Auswahl-Chips → klebende Live-Zeile „4 Spuren → 2 Einschätzungen" mit Sprungmarke.
3. Datenreise-Filter mit sehr langen Chips → Filter nach Datenart statt Einzeldatenpunkt.
4. KI-Thema im Fußabdruck fälschlich für Messenger → nur KI-Assistenten.
5. „Kontakte löschen" (Instagram) als Kontolöschung eingestuft → als Einstellung (5-Minuten-Maßnahme).
6. Hydrierungsfehler: „Alles löschen" blieb deaktiviert → Zustand wird nach dem Laden gesetzt; E2E-Test deckt es ab.
7. Startseite ohne überraschenden Fakt → Abschnitt „Drei Dinge, die kaum jemand weiß" mit Belegen.
8. Datenreise zitierte als Ersatz die Quelle eines Datenpunkts → nur noch echte Stationsquellen.
