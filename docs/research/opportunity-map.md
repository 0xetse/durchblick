# Opportunity Map „Durchblick“

> Abgerufen am 2026-10-07. Belege zu den Wettbewerbern stehen in `competitive-analysis.md` (dort mit URL). Hier sind nur die Quellen wiederholt, die für ein Argument tragend sind. Einschätzungen ohne Beleg sind als solche formuliert; nicht belegte Fakten sind mit **[nicht verifiziert]** markiert.

## 1. Kernthese in einem Satz

Den Markt für *einzelne* Bausteine gibt es (Hersteller-Checkups, AGB-Noten, Tool-Empfehlungen, DSGVO-Generatoren, Blocker). **Niemand verbindet auf Deutsch** die Erklärung pro Dienst („was wird gesammelt, wie, was lässt sich ableiten“) mit einer visuellen Darstellung der Datenflüsse, einer nachvollziehbaren Bewertung und datierten Handlungsschritten, und zwar ohne Konto und ohne Tracker.

## 2. Marktlücken (belegt)

| Lücke | Beleg | Stärke der Lücke |
|---|---|---|
| Kein unabhängiger, aktiver deutschsprachiger Datenschutz-Ratgeber für Apps und Dienste mehr | mobilsicher.de beendet (https://mobilsicher.de/) | **stark** |
| Kein frei zugänglicher, sortierbarer Datenschutz-Vergleich populärer Produkte mehr | *Privacy Not Included am 11.08.2026 eingestellt, Nachfolger ohne Index (https://discuss.privacyguides.net/t/mozillas-privacy-not-included-has-sunsetted/39887) | **stark**, aber auch ein Warnsignal (Pflegeaufwand) |
| Neutrale Tool-Empfehlungen ohne deutsche Version | Privacy Guides: 8 Sprachen, ohne DE (https://www.privacyguides.org/en/) | mittel. Verlinken statt kopieren; Übersetzen ist deren Aufgabe |
| Inferenzen („was lässt sich ableiten“) erklärt niemand verständlich | Hersteller-Checkups zeigen Schalter, keine Ableitungen (https://safety.google/privacy/privacy-controls/, https://www.facebook.com/help/443357099140264) | **stark**, aber inhaltlich schwer belegbar (siehe Risiken) |
| Selbstauskünfte werden unkritisch dargestellt | Google Play prüft Data safety nicht (https://support.google.com/googleplay/answer/11416267); CMU: < 6 % aktualisieren Labels (https://techxplore.com/news/2022-05-apple-privacy.amp) | mittel. Differenzierung durch Quellenkennzeichnung |
| Vom Wissen zur DSGVO-Handlung fehlt die Brücke | datarequests.org setzt Vorwissen voraus (https://www.datarequests.org/) | mittel. Kooperation statt eigener Generator |
| Suchanfragen wie „Was weiß Google über mich“ landen bei veralteten, werbefinanzierten Artikeln | heise-Artikel vom 11.05.2021 mit DoubleClick (https://www.heise.de/tipps-tricks/Was-weiss-Google-ueber-mich-6043839.html) | mittel. SEO-Chance, aber Google-abhängig |

## 3. Differenzierung: Bausteine im Abgleich

Legende: ● vollständig · ◐ teilweise · ○ nicht vorhanden (nach den in der Analyse abgerufenen Seiten; Einordnung ist eine Bewertung, keine Messung).

| Baustein | Hersteller-Checkups | ToS;DR | Privacy Guides | Verbraucherzentrale | klicksafe | Data Detox Kit | datarequests.org | KI-Scores (Cloaked u. a.) | **Durchblick (Ziel)** |
|---|---|---|---|---|---|---|---|---|---|
| Erklärung pro Dienst | ◐ (Selbstdarstellung) | ◐ (AGB-Punkte) | ○ | ◐ (einzelne Artikel) | ◐ (Eltern) | ○ (allgemein) | ○ | ◐ | ● |
| Persönliche Relevanz (Nutzungsprofil, lokal) | ● (aber mit Konto) | ○ | ◐ (Bedrohungsmodell) | ○ | ○ | ◐ | ○ | ○ | ● |
| Visuelle Datenflüsse/Inferenzen | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● |
| Transparente, zerlegbare Bewertung | ○ | ● | ○ (Kriterien, keine Note) | ○ | ○ | ○ | ○ | ◐ (Blackbox) | ● |
| Handlungsschritte mit Frischedatum | ● (immer aktuell) | ○ | ◐ | ◐ (Artikeldatum) | ◐ | ◐ [nicht verifiziert] | ○ | ○ | ● |
| Neutrale Alternativen | ○ | ○ | ● | ◐ | ○ | ◐ | ○ | ○ | ◐ (verlinken) |
| Prüfbare Quellen pro Aussage | ○ | ● | ◐ | ◐ | ◐ | ◐ | n/a | ◐ (Zitate) | ● |
| Kein Konto, keine Tracker, lokal | ○ | ● (statisch) | ● (Umami selbst gehostet) | ○ (Matomo, VWO) | ○ (Matomo) | [nicht verifiziert] | ● | ○ | ● |
| Deutsch | ● | ◐ | ○ | ● | ● | ● | ● | ○ | ● |

**Die Kombination, die niemand anbietet:** *visuelle Datenflüsse + Inferenzen + zerlegbare Bewertung + datierte Deep-Link-Anleitungen + Quellen pro Aussage + lokal/trackerfrei + Deutsch.* Einzeln ist jeder Baustein vorhanden oder leicht kopierbar. Unterscheiden kann sich Durchblick nur durch die **Kombination und deren Pflegequalität**.

## 4. Wo die Chance schwach oder überfüllt ist (kritisch)

- **Schutz im Browser / Blocker:** überfüllt (DuckDuckGo, Ghostery, Privacy Badger, uBlock Origin). Nicht bauen, nur empfehlen.
- **Datenleck-Check:** gelöst (HIBP, Mozilla Monitor, beide kostenlos). Nur verlinken.
- **Löschung bei Datenhändlern:** in DE schwach relevant (US-Personensuchseiten) und mit einem Vertrauensproblem belastet (Monitor Plus/Onerep, https://krebsonsecurity.com/2025/11/mozilla-says-its-finally-done-with-two-faced-onerep). Nicht bauen; erklären, warum DSGVO-Rechte der bessere Hebel sind.
- **DSGVO-Anfragen generieren:** datarequests.org und My Data Done Right machen das kostenlos und lokal. Ein eigener Generator wäre Doppelarbeit.
- **„KI-Privacy-Score“:** wird zur Massenware (Cloaked, PolicyPal, Privacy Policy Analyzer, Incogni-Rankings). Ein weiterer Score ohne Methodik differenziert nicht.
- **Allgemeine Tipps („Ändere deine Einstellungen“):** Data Detox Kit, klicksafe, BSI und Verbraucherzentrale decken das mit Behörden- bzw. NGO-Glaubwürdigkeit ab. Ein „noch ein Ratgeber“-Ansatz verliert gegen diese Marken.
- **Personalisierung ohne Konto:** Echte Personalisierung („was weiß Google über *mich*“) braucht die Daten des Nutzers, z. B. Takeout-Export. Ohne sie bleibt es eine *Selbsteinschätzung* („ich nutze YouTube täglich, Standortverlauf an?“). Das ist schwächer als es klingt. Eine lokale Takeout-Analyse wäre stark, ist aber technisch aufwendig, wird von wenigen Nutzern gemacht und erweitert die Angriffsfläche (große Archive im Browser).
- **Zahlungsbereitschaft:** Erklärangebote sterben häufig an der Finanzierung (*PNI, mobilsicher; Mine schwenkt Richtung B2B, https://saymine.com/). Ohne Tracker und Konto bleiben Spenden, Förderung, Lizenzen für Bildungseinrichtungen oder B2B. Ein tragfähiges Modell ist **ungeklärt**.

## 5. Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| **Veraltete Anleitungen** | Menüs von Google, Meta und TikTok ändern sich häufig; schon heise 2021 ist teils veraltet. CMU zeigt, dass selbst Hersteller ihre Labels nicht pflegen. | Pro Anleitung `zuletzt geprüft`, Prüfintervall, sichtbare Warnung nach Ablauf, Deep Links statt Klickpfad-Beschreibungen, automatisierte Link-Checks. Lieber weniger Dienste, die dafür frisch sind. |
| **Rechtliches Risiko Bewertung (UWG / §§ 824, 823 BGB)** | Eine negative Bewertung kann in den eingerichteten und ausgeübten Gewerbebetrieb eingreifen. Nach BGH-Rechtsprechung zu Warentests müssen Untersuchungen „neutral, objektiv und sachkundig“ sein (BGH GRUR 1976, 268 – Warentest II; GRUR 1989, 539; zitiert nach https://www.omsels.info/die-verbote-oder-was-darf-ich-nicht/5-uwg-irrefuehrende-werbung/13-einzelfaelle/warentests). Wer Affiliate-Links setzt oder eine Alternative bewirbt, handelt eventuell geschäftlich → UWG (Herabsetzung, Anschwärzung) wird relevanter. | Öffentliche Methodik, Bewertung nur aus belegten Einzelpunkten, Tatsachen (mit Quelle) und Wertung trennen, keine Affiliates, Möglichkeit zur Stellungnahme/Korrektur, juristische Prüfung **vor** dem Launch. Die rechtliche Einordnung hier ist keine Rechtsberatung. |
| **Falsche Sicherheit** | „Ich habe 5 Schalter umgelegt, jetzt bin ich sicher.“ Opt-outs wirken oft nur auf die Personalisierung, nicht auf die Erhebung. | Pro Maßnahme klar sagen, was sie *bewirkt* und was *nicht* („reduziert personalisierte Werbung, Daten werden weiter erhoben“). |
| **Spekulative Inferenzen** | Aussagen wie „Meta kann deine sexuelle Orientierung ableiten“ ohne Beleg wirken wie Panikmache und sind rechtlich angreifbar. | Inferenzen nur mit Quelle (Anbieter-Dokumentation, Studie, Behördenentscheidung); Sicherheitsstufe kennzeichnen („belegt / plausibel / umstritten“). |
| **Neutralität bei Alternativen** | Empfehlungen werden als Werbung wahrgenommen oder sind es. | Kriterien öffentlich machen, auf Privacy Guides/Digitalcourage verweisen, keine Provisionen. |
| **Quellen verschwinden** | PNI wandert ins Wayback-Archiv, Seiten liefern 403/404 (siehe Abrufprotokoll in der Analyse). | Archiv-Links (Wayback) zu jeder Quelle mitspeichern. |
| **Plattform-Abhängigkeit** | Deep Links der Hersteller brechen, Google-SEO schwankt. | Link-Monitoring, Rückfall auf eine textliche Beschreibung des Pfads. |
| **Anspruch „privacy-first“ wird widerlegt** | Ein einziges eingebundenes CDN, Webfont oder Analytics-Skript macht das Versprechen unglaubwürdig. | Strikte CSP, keine Third-Party-Requests, öffentlich prüfbar (z. B. Blacklight-Scan verlinken), reproduzierbarer Build. |

## 6. Priorisierte Chancen

### Must (Kern, ohne den Durchblick austauschbar ist)
1. **Profilseiten pro Dienst auf Deutsch** für 8–10 Top-Dienste (Google, YouTube, Instagram, Facebook, WhatsApp, TikTok, Amazon, ChatGPT): Was wird gesammelt, wie, und was lässt sich ableiten, jeweils mit Quelle und Herkunftskennzeichnung (Anbieterangabe / Messung / Recherche).
2. **Visualisierter Datenfluss pro Dienst** (Quelle → Erhebung → Verknüpfung → Inferenz → Nutzung). Das ist die eigentliche Lücke; keiner der untersuchten Anbieter bietet das.
3. **Handlungsschritte mit Frischedatum + Deep Link** zum offiziellen Schalter, mit ehrlicher Wirkungsangabe („bewirkt / bewirkt nicht“).
4. **Technisch belegbarer Trust:** kein Konto, kein Analytics, keine Third-Party-Requests, öffentlich dokumentiert und prüfbar. Ein Unterscheidungsmerkmal gegenüber Verbraucherzentrale, BSI, klicksafe und Mine, die laut statischem HTML-Check Analytics einsetzen.
5. **Quellen- und Methodikseite** inklusive Archiv-Links.

### Should (verstärkt die Differenzierung, mit Aufwand oder Risiko)
6. **Zerlegbare Bewertung** nach dem ToS;DR-Prinzip (Punkte → Note) mit öffentlicher Methodik. Erst *nach* juristischer Prüfung; alternativ zunächst nur eine „Datenhunger-Skala“ ohne Note.
7. **Lokale Selbsteinschätzung** („Welche Dienste nutzt du, wie?“ → persönliche Prioritätenliste), komplett im Browser.
8. **Brücke zu DSGVO-Rechten:** „Auskunft anfordern“ verlinkt auf datarequests.org bzw. eine Musterbrief-Seite der Verbraucherzentrale. Kooperation anfragen.
9. **Neutrale Alternativen** kuratiert per Link auf Privacy Guides / Digitalcourage statt eigener Testurteile.
10. **Freshness-Prozess als Produkt:** öffentliches Changelog „Was hat sich bei Dienst X geändert?“. Das bindet wiederkehrende Nutzer, ohne dass sie ein Konto brauchen.

### Later (spannend, aber teuer, nischig oder riskant)
11. **Lokale Analyse von Datenexporten** (Google Takeout, Meta „Deine Informationen herunterladen“) im Browser. Die stärkste Personalisierung, aber aufwendig und wenig genutzt; Sicherheitsfolgen beachten.
12. **KI-Dienste als eigene Kategorie** (ChatGPT, Gemini, Meta AI: Training-Opt-out, Speicherung). Die Nachfrage steigt (Incogni-Rankings 2025/2026), Regeln ändern sich aber sehr schnell.
13. **Bildungs-Lizenzen** (Schulen, VHS, Bibliotheken) als Finanzierungsweg. Konkurrenz durch klicksafe ist dort stark.
14. **Einbindung offener Datenquellen** (ToS;DR-API, Exodus-Berichte, WhoTracks.me). Lizenzen prüfen **[nicht verifiziert]**.

### Bewusst nicht
- Eigener Tracker-Blocker, eigener Leak-Check, Löschung bei Datenhändlern, eigener DSGVO-Generator, Blackbox-KI-Score.

## 7. Stärkste Lücke

**„Was weiß Dienst X über mich, wie kommt er dazu und was kann ich heute konkret dagegen tun?“ als visueller, belegter, datierter Erklärer auf Deutsch, ohne Konto und ohne Tracker.** Der Wegfall von mobilsicher.de und *Privacy Not Included in 2026 macht die Lücke aktuell größer. Er zeigt aber auch, dass die eigentliche Herausforderung nicht die Idee ist, sondern **dauerhafte Pflege und Finanzierung**. Das ist der Punkt, an dem Durchblick am ehesten scheitern könnte.
