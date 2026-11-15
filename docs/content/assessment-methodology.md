# Methodik: Datenprofil statt Privacy-Score

Stand: 2026-10-07 · Status: v1 (MVP) · Kanonisch für alle Einordnungen in `content/services/*.yaml`

## Entscheidung in einem Satz

Durchblick vergibt **keine Gesamtpunktzahl** (kein „42/100"). Jeder Dienst bekommt ein **Datenprofil** aus zehn Dimensionen in zwei Gruppen – *Wie viel gibst du preis?* und *Wie viel Kontrolle hast du?* –, jede Stufe mit Begründung, Quellen und Konfidenz.

## Warum keine Zahl?

Ursprünglich angedacht war ein „Privacy Factor" von 0–100. Wir haben ihn verworfen (siehe `docs/DECISION_LOG.md`, D-006):

1. **Scheinpräzision.** Ein Unterschied von 42 zu 47 suggeriert eine Messgenauigkeit, die es nicht gibt. Die Eingaben sind redaktionelle Einordnungen öffentlich dokumentierter Praktiken, keine Messungen.
2. **Gewichtung ist Weltanschauung.** Ob „Verknüpfung über Dienste hinweg" schwerer wiegt als „Sensibilität der Inhalte", hängt von der Person ab. Eine einzige Zahl versteckt diese Wertentscheidung.
3. **Falsche Sicherheit.** Eine gute Zahl lädt zu „dann ist ja alles okay" ein – das Gegenteil des Ziels.
4. **Rechtliches Risiko.** Eine Rangliste von Unternehmen nach Punkten ist eine wertende Aussage mit Angriffsfläche (u. a. UWG, Äußerungsrecht). Begründete, quellengestützte Einzelaussagen sind deutlich besser verteidigbar. *(Keine Rechtsberatung – siehe `docs/DECISIONS_NEEDED.md`.)*
5. **Vermischte Richtungen.** „Viele Daten, aber gute Kontrolle" und „wenige Daten, keine Kontrolle" ergäben ähnliche Zahlen, bedeuten aber für Nutzer etwas völlig anderes.

Stattdessen: ein **Datenprofil** im Stil eines Nährwertetiketts. Jede Zeile ist einzeln lesbar, aufklappbar („Warum?") und belegt.

## Die zehn Dimensionen

### Gruppe A – „Wie viel gibst du preis?" (Stufen: gering · mittel · hoch · sehr hoch)

| Dimension | Frage | 1 gering | 2 mittel | 3 hoch | 4 sehr hoch |
|---|---|---|---|---|---|
| `breadth` Umfang | Wie viele Datenarten erfasst der Dienst? | Konto- und technisch nötige Daten | dazu Nutzungsdaten innerhalb eines Produkts | viele Kategorien, u. a. Inhalte, Kontakte oder Standort | sehr breit, inkl. Daten aus anderen Quellen |
| `sensitivity` Sensibilität | Wie privat ist, was typischerweise anfällt? | kaum Persönliches | verrät Vorlieben | regelmäßig private Inhalte (Fotos, Käufe, genauer Standort, Suchanfragen) | regelmäßig intime Inhalte (z. B. Gespräche mit KI, Sprachaufnahmen, Nachrichteninhalte) oder Daten mit Gesundheits-, Religions-, Sexualitätsbezug, die der Anbieter verarbeiten kann |
| `observation` Beobachtung | Wie fein wird Verhalten aufgezeichnet? | kaum | grundlegende Nutzungsstatistik | detaillierte Verlaufsdaten (was, wann, wie oft) | feinkörnig und laufend (z. B. Verweildauer, Wiedergabeverhalten), zentral für Empfehlungen |
| `linkability` Verknüpfung | Wie weit werden Daten verbunden? | bleibt im Dienst | Konto über Geräte hinweg | über mehrere Dienste desselben Konzerns | zusätzlich Daten über dich von fremden Websites/Apps/Partnern |
| `adUse` Werbenutzung | Wie zentral sind persönliche Daten fürs Geschäft? | keine personalisierte Werbung | Werbung mit begrenzter Personalisierung oder Nebengeschäft | personalisierte Werbung ist wichtige Einnahmequelle | personalisierte Werbung ist das Kerngeschäft |
| `sharing` Weitergabe | Wer bekommt Zugriff? | nur Auftragsverarbeiter | zusätzlich innerhalb des Konzerns | zusätzlich Partner/Werbekunden (meist aggregiert) oder Integrationen | breite Weitergabe personenbezogener Daten an Dritte |

### Gruppe B – „Wie viel Kontrolle hast du?" (Stufen: gering · eingeschränkt · gut · sehr gut)

| Dimension | Frage | 1 gering | 2 eingeschränkt | 3 gut | 4 sehr gut |
|---|---|---|---|---|---|
| `defaults` Voreinstellungen | Wie datensparsam ist der Ausgangszustand? | datenintensive Optionen fast alle an | überwiegend an, einzelne Grenzen | mehrere schützende Voreinstellungen (z. B. automatisches Löschen) | datensparsam ab Werk |
| `controls` Einstellungen | Lassen sich die wichtigsten Verarbeitungen begrenzen? | kaum wirksame Optionen | Optionen vorhanden, Kernverarbeitung nicht abschaltbar | die meisten wichtigen Verarbeitungen begrenzbar | fein und wirksam für fast alles |
| `deletion` Löschen & Export | Kommst du an deine Daten und wieder raus? | schwer/unvollständig | mit Aufwand möglich | Selbstbedienung für Löschung und Export | zusätzlich Auto-Löschen bzw. kurze Speicherfristen |
| `reachability` Auffindbarkeit | Wie leicht findest du die Einstellungen? | versteckt, viele Schritte | mit Suchen auffindbar | zentrale Einstellungsseite | zentral, verständlich erklärt |

## Konfidenz

| Stufe | Bedeutung |
|---|---|
| `high` | Stufe folgt direkt aus Tier-1-Quellen (Anbieterdokumentation, Behörde, Gesetz). |
| `medium` | Tier-1-Quellen plus redaktionelle Einordnung oder Tier-2-Quellen. |
| `low` | Dokumentation lückenhaft; Einordnung vorläufig. Wird in der Oberfläche sichtbar markiert. |

## Regeln

1. **Jede Stufe hat eine Begründung in Alltagssprache** (`rationale`), die ohne Fachwissen verständlich ist, und mindestens eine Quelle.
2. **Bewertet wird das Standardverhalten** für Nutzer in der EU/Deutschland mit einem Konto, nicht ein Maximal- oder Minimalfall. Abweichungen (z. B. „ohne Konto deutlich weniger") gehören in die Begründung.
3. **Keine Gesamtnote, keine Rangliste.** Die Oberfläche zeigt keine „schlechtesten Dienste" und sortiert nicht nach Exposition.
4. **Zusammenfassung nur in Worten**, abgeleitet aus den höchsten Stufen: z. B. „Sehr breite Erfassung · gute Kontrollmöglichkeiten". Die Ableitung ist deterministisch (`src/domain/assessment.ts`) und getestet.
5. **Überprüfung** spätestens alle 6 Monate oder bei relevanter Änderung der Datenschutzerklärung (`reviewedAt`).
6. **Präzisierungen (aus dem Red-Team-Review vom 2026-10-07):**
   - Automatisches Löschen zählt bei `defaults` nur dann als schützende Voreinstellung, wenn die Frist **höchstens 18 Monate** beträgt.
   - Bei `sensitivity` führen private Nachrichteninhalte nur dann zu Stufe 4, wenn private Kommunikation eine **Kernfunktion** des Dienstes ist **und** der Anbieter die Inhalte verarbeiten kann (nicht Ende-zu-Ende-verschlüsselt). Offene Prüfung: Instagram-Direktnachrichten im EWR.
   - Dass eine Hilfeseite für automatisierte Abrufe gesperrt war, ist **kein** Kriterium für `reachability`; solche Stufen tragen Konfidenz `low`, bis sie in der App geprüft sind.
7. **Gegenrede erwünscht.** Anbieter und Nutzer können Einordnungen anfechten; Korrekturen werden mit Datum dokumentiert (Prozess: `docs/content/content-guidelines.md`).

## Bekannte Grenzen

- Die Einordnung bewertet **dokumentierte Praktiken**, nicht tatsächliches internes Verhalten, das niemand von außen prüfen kann.
- Unterschiedliche Dienste eines Konzerns teilen oft Konto und Infrastruktur; das bildet `linkability` ab, aber nicht jede konzerninterne Nutzung ist öffentlich dokumentiert.
- Stufen sind ordinal. „Hoch" ist nicht „doppelt so viel" wie „mittel".
