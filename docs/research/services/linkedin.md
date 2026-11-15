# Recherche-Notizen: LinkedIn (Microsoft)

Stand: 2026-10-08 · Bearbeitet für `content/services/linkedin.yaml`, `content/guides/linkedin.yaml`, `content/sources/linkedin.yaml`.

## Methodischer Hinweis

- Alle LinkedIn-Seiten per `curl` mit Browser-Headern (`Accept-Language: de-DE`) geladen und als Text extrahiert. LinkedIn lieferte die deutschen Fassungen ohne Anmeldung aus, auch den **regionalen europäischen Datenschutzhinweis** (eigene Seite, ausdrücklich für EU/EWR/Schweiz/UK). Netz-Ausgang war nicht in der EU; da der EU-Hinweis ein eigenes Dokument ist, gelten die EU-Aussagen trotzdem als geprüft.
- Mehrere Hilfeseiten tragen den Hinweis, dass sie teils maschinell übersetzt sind (z. B. Privatmodus, importierte Kontakte, „Personen, die Sie vielleicht kennen“). Menü-Namen können in der App leicht abweichen.
- Microsoft-Zahlen aus dem 10-K über SEC EDGAR (Abruf über `data.sec.gov`).

## Kernaussagen mit Beleg

| Aussage | Quelle | Beleg (Zitat/Abschnitt) |
|---|---|---|
| Verantwortlicher in der EU | https://de.linkedin.com/legal/privacy-policy (Fassung „Mit Wirkung vom 3. November 2025“), Einleitung | „Wenn Sie sich in den „designierten Ländern“ befinden, wird LinkedIn Ireland Unlimited Company („LinkedIn Ireland“) zum Verantwortlichen …“ |
| Adresse EU / USA | https://de.linkedin.com/legal/privacy/eu (Fassung „Mit Wirkung vom 21. August 2026“), „Datenverantwortlicher“ | „Wilton Place, Dublin 2, Irland“; LinkedIn Corporation „1000 W Maude Avenue, Sunnyvale, CA“ |
| Konto-Daten | Datenschutzrichtlinie 1.1 „Anmeldung“ | „Ihren Namen, Ihre E-Mail-Adresse und/oder Handynummer, Ihren allgemeinen Standort (z. B. eine Stadt) und ein Passwort“ |
| Alterskontrolle seit 21.08.2026 | https://www.linkedin.com/help/linkedin/answer/a1341216 | „Neue Mitglieder müssen fortan bestätigen, ob sie das Alter der Volljährigkeit … erreicht … haben.“ |
| Profil voll sichtbar | Datenschutzrichtlinie 3.1 | „Ihr Profil ist für alle Mitglieder und Kunden unserer Services vollständig sichtbar.“ |
| Gruppen öffentlich | dto. | „Ihre Mitgliedschaft in Gruppen ist öffentlich und Teil Ihres Profils …“ |
| Dritte liefern Kontaktdaten | Datenschutzrichtlinie 1.2 | „… wenn Dritte ihre Kalenderdaten … synchronisieren, ihre Kontakte mit Mitgliedsprofilen verknüpfen, Visitenkarten scannen und hochladen …“ |
| Adressbuch-Import, regelmäßiges Nachladen | https://www.linkedin.com/help/linkedin/answer/4214 | „… einmalig hoch. Danach können wir in regelmäßigen Abständen Details über Ihre Kontakte importieren und speichern …“ |
| Arbeitgeber/Bewerbungssysteme, Microsoft als Datenquelle | Datenschutzrichtlinie 1.2 | „Dazu zählen Arbeitgeber, potenzielle Arbeitgeber und Bewerbermanagementsysteme …“; „… von Microsoft Informationen über Ihr Engagement mit deren Websites …“ |
| Nutzungsprotokoll | Datenschutzrichtlinie 1.3 | „Wir verwenden Anmeldedaten, Cookies, Geräteinformationen und IP-Adressen, um Sie zu identifizieren und Ihre Nutzung zu protokollieren.“ |
| Geräte-/Netzdaten | Datenschutzrichtlinie 1.5 | „Ihre IP-Adresse, Ihren Proxy-Server, Ihr Betriebssystem, Ihren Webbrowser und Ihre Add-ons, Ihre Gerätekennung …“ |
| GPS nur mit Zustimmung | dto. | „Wir bitten Sie um Ihre Zustimmung, bevor wir GPS oder andere Tools verwenden …“ |
| Nachrichten | Datenschutzrichtlinie 1.6 | „… mit wem Sie wann kommunizieren“; Antwortvorschläge; Moderation |
| Nachrichten-Bilder geprüft | EU-Hinweis, „Öffentliches Interesse“ | „… analysiert LinkedIn Bilder und Videos, die über Nachrichten auf unserer Plattform versendet werden.“ |
| Werbung: genutzte Daten, Ableitungen | Datenschutzrichtlinie 2.4 | Suchverlauf, Feed, Klicks; „Verwendung von Berufsbezeichnungen in einem Profil, um Branche, Karrierestufe und Vergütungsgruppe abzuleiten; Verwendung von Daten zu Ausbildungsabschlüssen, um Schlussfolgerungen in Bezug auf das Alter …“ |
| Werbung EU: Rechtsgrundlagen | EU-Hinweis | Unter „Einwilligung“: personalisierte Anzeigen nach beobachteten/abgeleiteten Nutzungsdaten und nach Daten von Dritten. Unter „Legitimes Interesse“: „personalisierte Anzeigen … basierend auf Angaben in Ihrem LinkedIn Profil und gewissen Daten, die wir über Sie ableiten“ |
| Abgeleitete Merkmale | EU-Hinweis | „Abgeleitete Interessen … und Merkmale (z. B. dass Sie im Ausland leben, viel reisen oder auf Jobsuche sind)“; „Abgeleiteter Standort – Stadt, Land, Kontinent – (basierend auf Ihrer IP-Adresse)“; „Abgeleitetes Geschlecht“; „Abgeleitete Altersgruppe“ |
| Profiling für Feed | EU-Hinweis, „Personalisierung Ihrer User Experience“ | „LinkedIn setzt möglicherweise Profiling-Methoden ein, um dies zu erreichen.“ |
| Schlussfolgerungen (Hilfe) | https://www.linkedin.com/help/linkedin/answer/a1337820 | Sprachen, Alter/Geschlecht, Interessen („Elektrofahrzeugen oder künstlicher Intelligenz“), Jobsuche; „Ihr Profilfoto wird nicht verwendet …“ |
| Demografische Angaben | https://www.linkedin.com/help/linkedin/answer/a1336543 | „Alters- und Geschlechterkategorien (nur männlich oder weiblich) … um Ihnen relevantere Werbung anzuzeigen“; „Wir erlauben kein Anzeigen-Targeting auf der Grundlage von ethnischer Zugehörigkeit, Behinderungen …“ |
| Insight Tag | https://www.linkedin.com/help/linkedin/answer/a426264 | „… ein JavaScript-Code, der Besuche von LinkedIn Mitgliedern auf externen Websites … verfolgt.“; 7 Tage / 180 Tage; Schritte „Werbedaten > Daten von anderen für Anzeigen > Aus“ |
| Anzeigenbörsen, Fristen | https://www.linkedin.com/help/linkedin/answer/a7157083 | acht Börsen (Stand September 2025); Kontaktlisten 30 Tage; Conversions-API 180 Tage; CRM 12 Monate; UET-Tag nur außerhalb Europas |
| Ads-Einstellungen | https://www.linkedin.com/help/linkedin/answer/a1342443 | „Klicken Sie auf Anzeigendaten in der linken Seitenleiste …“; „Keine der Anzeigeneinstellungen sorgt dafür, dass Sie keinerlei Werbung mehr … angezeigt bekommen.“; 72 Stunden |
| Weitergabe an Werbekunden | Datenschutzrichtlinie 2.4 „Informationen für Werbetreibende“ | nur gehashte IDs, mit separater Genehmigung (Lead-Formular) oder bereits öffentliche Daten |
| Export durch Recruiting-/Vertriebskunden | Datenschutzrichtlinie 2.2 | „Unsere Kundschaft kann in begrenztem Umfang Informationen aus Ihrem Profil exportieren … sofern Sie dies nicht ablehnen.“ |
| Arbeitgeber sieht Jobsuche nicht | Datenschutzrichtlinie 3.1 | „Wir zeigen Ihrem Arbeitgeber weder Ihre Jobsuchen noch Ihre persönlichen Nachrichten.“ |
| Microsoft | Datenschutzrichtlinie 3.4; EU-Hinweis „Unsere Muttergesellschaft“, „LinkedIn Unternehmen“ | öffentliche Inhalte an Microsoft; Sicherheit; KI-Training „soweit zulässig“; Speicherung in Rechenzentren der LinkedIn Corporation in den USA |
| Microsoft-Werbedaten nur außerhalb Europas | https://www.linkedin.com/help/linkedin/answer/a1397243 | „In diesem Artikel wird die Datenverarbeitung außerhalb der EU, des EWR, der Schweiz und des Vereinigten Königreichs beschrieben.“ |
| KI-Training EU ab 3.11.2025 | EU-Hinweis (Kopfzeile) | „Am 3. November 2025 haben wir diesen Hinweis aktualisiert, um Informationen über unsere Berufung auf berechtigte Interessen als Rechtsgrundlage für die Schulung von KI-Modellen zur Generierung von Inhalten … bereitzustellen.“ |
| Trainingsdaten / Ausnahmen | https://www.linkedin.com/help/linkedin/answer/a5538339 | Profildaten, KI-Eingaben, Lebensläufe, „Gruppenaktivitäten und Gruppennachrichten“, Beiträge/Kommentare; nicht: „Private Nachrichten (einschließlich Ihrer InMail- und Inbox-Nachrichten)“ |
| Widerspruch nicht rückwirkend | dto. | „Der Widerspruch greift jedoch nicht rückwirkend für ein Training, das vor diesem Zeitpunkt stattgefunden hat.“ |
| Microsoft-Training EU | dto. | „… nur mit Ankündigung für das Training generativer KI-Modelle bereitgestellt.“ |
| Einstellung ab Werk an | https://www.autoriteitpersoonsgegevens.nl/actueel/ap-bezorgd-over-ai-training-linkedin-en-roept-gebruikers-op-om-instellingen-aan-te-passen (24.09.2025) | „De instelling ‚Gegevens voor verbetering van generatieve AI‘ staat standaard aan.“ (→ `surprise`) |
| DPC zum KI-Training | https://dataprotection.ie/en/news-media/latest-news/dpc-statement-linkedin-ai-training (07.11.2025) | Umfang und Zeitraum der Daten reduziert; Filter für Gewerkschafts-Inhalte; „The DPC has not approved, or found compliant …“ |
| DPC-Strafe 2024 | https://www.dataprotection.ie/en/news-media/press-releases/irish-data-protection-commission-fines-linkedin-ireland-eu310-million | 310 Mio. € (24.10.2024); Einwilligung für Drittdaten „not freely given, sufficiently informed or specific, or unambiguous“ |
| Speicherdauer / Kontoschließung | Datenschutzrichtlinie 4.1, 4.3 | „… speichern wir Ihre Daten und halten Ihr Profil aktiv, sofern Sie Ihr Konto nicht schließen.“; 24 Stunden / 30 Tage |
| Export | https://www.linkedin.com/help/linkedin/answer/a1339364 | Schritte; 72 Stunden; „Diese Funktion ist derzeit nicht auf Mobilgeräten verfügbar.“; Kategorien „Schlussfolgerungen“, „Anzeigen-Targeting“; CLEAR |
| Konto schließen | https://www.linkedin.com/help/linkedin/answer/63 | Schritte Desktop/iOS/Android; Wiedereröffnung „weniger als 14 Tage“ |
| Kontakte löschen | https://www.linkedin.com/help/linkedin/answer/a563126 | Synchronisierungsoptionen > Kontakte synchronisieren > Alle entfernen; Vorschläge bis 72 Stunden |
| Privatmodus | https://www.linkedin.com/help/linkedin/answer/a567226 | drei Modi; Einstellungen & Datenschutz > Sichtbarkeit |
| Geschäftsmodell | Microsoft 10-K FY2026 (SEC, eingereicht 29.07.2026) | LinkedIn 19.817 Mio. USD (Vorjahr 17.812); „+11 % with growth across all lines of business“; vier Bereiche |

## Bewusst nicht übernommen / offen

- **Startjahr 2003 für Trainingsdaten:** Die niederländische AP nannte im September 2025 Daten „die teruggaan tot 2003“. Laut DPC (07.11.2025) hat LinkedIn danach den Zeitraum verkleinert, ohne ihn öffentlich zu nennen. → Nicht in den Text übernommen.
- **Weitergabe an Microsoft für Werbung:** gilt laut Hilfeseite nur außerhalb von EU/EWR/Schweiz/UK → für die EU ausdrücklich verneint, nicht als Datenfluss dargestellt.
- **Abschnitt „Teilen von Daten mit Microsoft für KI-Trainings“ im EU-Hinweis:** steht in der Textextraktion direkt unter „Wenn Sie sich im Vereinigten Königreich befinden:“. Zuordnung (nur UK?) nicht sicher → nur die FAQ-Aussage („nur mit Ankündigung“) verwendet.
- **Menüweg KI-Einstellung:** Keine offizielle deutsche LinkedIn-Anleitung gefunden; nur der direkte Link und der niederländische Weg der AP. Sekundärquellen (TechRadar, PCWorld) nicht genutzt. Guide `linkedin-ai-training` bleibt `needs-verification` ohne Schritte.
- **Standardwerte der Werbe-Schalter in der EU:** Ob die einwilligungspflichtigen Schalter ab Werk aus sind, steht in keiner abgerufenen Quelle → `defaults` nur mit „verlangt Einwilligung“ begründet, Konfidenz `medium`.
- **Ende-zu-Ende-Verschlüsselung von Nachrichten:** LinkedIn beschreibt keine; nicht als Tatsache behauptet, nur im Feld `technical` vermerkt.
- **Premium-Preise** nicht recherchiert.
- **Uneinheitliche Menünamen:** „Anzeigendaten“ (a1342443) vs. „Werbedaten“ (a426264) – in den Schritten beide genannt.

## Offene Fragen

- Bericht von LinkedIn an die DPC (fünf Monate nach Trainingsbeginn) – Ergebnis abwarten.
- Menüwege in der deutschen App selbst prüfen (KI-Einstellung, Anzeigendaten).
