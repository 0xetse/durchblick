# Recherche: Simulator „Was verraten fünf harmlose Spuren?“

Stand: 2026-10-07. Inhalte: `content/simulator.yaml`, Quellen: `content/sources/simulator.yaml`.

## Methode

- Jede Quelle wurde am 2026-10-07 abgerufen (WebFetch/curl). Zitate unten sind wörtlich aus der abgerufenen Seite übernommen.
- Stufen der Schlussfolgerungen:
  - `derived`: aus den Daten nahezu zwingend (regelmäßige Orte → Wohn-/Arbeitsort). Beleg: Forschung.
  - `documented`: nur, wenn eine Plattform offiziell dokumentiert, dass sie diese Art von Merkmal schätzt (Google-Ads-Segmente).
  - `possible`: plausibel und in der Forschung als machbar gezeigt, aber nicht als Plattform-Praxis dokumentiert.
- Keine Aussage behauptet, dass ein bestimmtes Unternehmen ein bestimmtes sensibles Merkmal über eine bestimmte Person abgeleitet hat.

## Offizielle Quellen (Tier 1)

### sim-google-ads-audience-segments — Google Ads Help: „About audience segments“
URL: https://support.google.com/google-ads/answer/2497941?hl=en

- „audiences are made up of segments, or groups of people with specific interests, intents, and demographic information, as estimated by Google.“
- „Audiences are determined by people's activity using Google products and third-party websites, or estimated based on content certain groups of people are likely to be interested in.“
- Life events: „Engage with viewers on YouTube, Gmail and Display around important life milestones, like graduating from college, moving homes, or getting married.“ und „someone who's about to move will likely buy new furniture, moving services, mortgages, and other moving-related items during the months of their move.“
- In-market: „researching products and are actively considering buying a service or product like yours.“
- Detailed demographics: „Detailed demographic segments include college students, homeowners, or new parents.“
- Health-Abschnitt: „Google will never use sensitive information like health, race, religion, or sexual orientation to tailor ads to users.“
- Die auf der Seite verlinkten CSV-Listen (storage.googleapis.com/support-kms-prod/…) enthalten u. a.:
  - Affinity: `/Sports & Fitness/Sports Fans/Soccer Fans`, `/Sports & Fitness/Sports Fans/Running Enthusiasts`, `/Sports & Fitness/Health & Fitness Buffs`, `/Banking & Finance/Avid Investors`
  - In-market: `/Real Estate/Moving & Relocation`, `/Real Estate/Residential Properties/Residential Properties (For Rent)/Apartments (For Rent)`, `/Baby & Children's Products`, `/Apparel & Accessories/Shoes/Athletic Shoes`, `/Sports & Fitness/Fitness Products & Services/Gyms & Athletic Clubs`, `/Financial Services/Investment Services`
  - Detailed demographics: `/Parental Status/Parents/Parents of Infants (0-1 years)`, `/Homeownership Status/Homeowners`, `/Homeownership Status/Renters`, `/Marital Status/Married`
- Stützt: fussballfan, sportlich-aktiv, interesse-babyausstattung, bald-eltern, bald-umzug, interesse-geldanlage, gesundheitsbewusst (Google-Zitat).

### sim-google-ads-demographics — Google Ads Help: „About demographic targeting“
URL: https://support.google.com/google-ads/answer/2580383?hl=en

- Kategorien: Alter, Geschlecht, „Household income“ (Top 10 % … Lower 50 %, regional begrenzt), „Parental status: Parent, Not a parent, Unknown“.
- „We sometimes also estimate people's demographic information based on their activity from Google properties or the Display Network.“
- „Google Ads can't know or infer the demographics of all people“ (Grund für die Kategorie „Unknown“).
- Stützt: bald-eltern (Elternstatus aus Aktivität geschätzt), einkommen, Takeaway 3 (Grenzen).

### sim-google-ads-personalized-policy — Google Advertising Policies: „Restricted targeting in Personalized advertising“
URL: https://support.google.com/adspolicy/answer/143465?hl=en

- Liste „Sensitive interest categories“ u. a.: Health, Negative financial status, Relationship hardships, Political affiliation, Religious beliefs, Sexual orientation.
- „Advertisers promoting products and services that fall within sensitive interest categories are unable to use advertiser-curated audiences.“
- „Users under the age of 18 are not eligible for personalized advertising of any kind“.
- Stützt: finanzielle-sorgen (negativer finanzieller Status als sensible Kategorie).

### sim-google-my-ad-center — My Ad Center Help: „How personalized ads work“
URL: https://support.google.com/My-Ad-Center-Help/answer/12155656?hl=en

- „Information, such as your age and gender, that you've provided in your Google Account or that Google has estimated about you.“
- „Activity saved to your Google Account, including things you've looked for on Google Search, videos you've watched on YouTube, apps you've installed on your Android device, ads or content you've interacted with …“
- Stützt: Takeaway 2 (selbst nachsehen und ändern).

### sim-meta-sensitive-targeting-2021 — Meta for Business, 9.11.2021
URL: https://www.facebook.com/business/news/removing-certain-ad-targeting-options-and-expanding-our-ad-controls

- „Starting January 19, 2022 we will remove Detailed Targeting options that relate to topics people may perceive as sensitive, such as options referencing causes, organizations, or public figures that relate to health, race or ethnicity, political affiliation, religion, or sexual orientation.“
- „the interest targeting options we are removing are not based on people's physical characteristics or personal attributes, but instead on things like people's interactions with content on our platform.“
- Beispiele: „Lung cancer awareness“, „World Diabetes Day“, „LGBT culture“, „Catholic Church“.
- Stützt: gesundheitsbewusst.
- Hinweis: about.fb.com-Variante der Ankündigung lieferte 404; die facebook.com/business-Seite ist erreichbar.

### sim-meta-why-ads-2019 — Meta Newsroom, 11.7.2019
URL: https://about.fb.com/news/2019/07/understand-why-youre-seeing-ads/

- „more detailed targeting, including the interests or categories that matched you with a specific ad“ und „where that information came from (e.g. the website you may have visited or Page you may have liked)“.
- Stützt: Takeaway 2. Achtung: Stand 2019; aktuelle Bezeichnungen der Menüs können abweichen.

### law-dsa — Digital Services Act, Verordnung (EU) 2022/2065
URL: https://eur-lex.europa.eu/eli/reg/2022/2065/oj

- Art. 26 Abs. 3: „Providers of online platforms shall not present advertisements to recipients of the service based on profiling as defined in Article 4, point (4), of Regulation (EU) 2016/679 using special categories of personal data referred to in Article 9(1) of Regulation (EU) 2016/679.“
- Art. 28 Abs. 2: „Providers of online platform shall not present advertisements on their interface based on profiling as defined in Article 4, point (4), of Regulation (EU) 2016/679 using personal data of the recipient of the service when they are aware with reasonable certainty that the recipient of the service is a minor.“
- Stützt: bald-eltern, schlafprobleme, gesundheitsbewusst, Takeaway 3.

### law-gdpr — DSGVO, Verordnung (EU) 2016/679
URL: https://eur-lex.europa.eu/eli/reg/2016/679/oj

- Art. 4 Nr. 4: „'profiling' means any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person, in particular to analyse or predict aspects concerning that natural person's performance at work, economic situation, health, personal preferences, interests, reliability, behaviour, location or movements“
- Art. 9 Abs. 1: „Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data …, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited.“
- Wichtig für finanzielle-sorgen: Die finanzielle Lage gehört **nicht** zu den besonderen Kategorien nach Art. 9 – deshalb verweist diese Regel nur auf Googles Richtlinie, nicht auf DSA Art. 26 Abs. 3.

## Forschung (Tier 2)

### sim-kosinski-2013 — Kosinski, Stillwell, Graepel, PNAS 110(15), 2013
URL: https://www.pnas.org/doi/10.1073/pnas.1218772110 (DOI 10.1073/pnas.1218772110; Abstract via Crossref/Europe PMC, PMC3625324)

- Sinngemäß: Aus Facebook-Likes lassen sich automatisch sehr sensible Merkmale vorhersagen – u. a. sexuelle Orientierung, ethnische Herkunft, religiöse und politische Einstellungen, Persönlichkeit, Intelligenz, Zufriedenheit, Substanzkonsum, Trennung der Eltern, Alter und Geschlecht.
- Trefferquoten laut Abstract: homo- vs. heterosexuelle Männer 88 %, afroamerikanisch vs. weiß (US) 95 %, Demokrat vs. Republikaner 85 %.
- Datengrundlage: mehr als 58.000 Freiwillige.

### sim-de-montjoye-2013 — de Montjoye, Hidalgo, Verleysen, Blondel, Scientific Reports 3:1376, 2013
URL: https://www.nature.com/articles/srep01376 (PMC3607247)

- Sinngemäß: Vier Orts-Zeit-Punkte reichen, um 95 % der Personen eindeutig zu erkennen.
- Auch vergröberte Daten bieten kaum Anonymität (Eindeutigkeit sinkt nur langsam mit gröberer Auflösung).
- Datengrundlage: 15 Monate, 1,5 Mio. Personen, stündliche Position auf Antennen-Auflösung.

### sim-krumm-2007 — John Krumm, „Inference Attacks on Location Tracks“, Pervasive 2007
URL: https://www.microsoft.com/en-us/research/publication/inference-attacks-location-tracks/

- Sinngemäß: Untersucht wird, wie gut vier Algorithmen aus Standortdaten von Freiwilligen zuerst den Wohnort und dann die Identität bestimmen (mit einer frei verfügbaren Websuche).
- Ergebnis: Ein kleiner Teil der Personen und ein größerer Teil der Wohnadressen ließ sich ermitteln (keine Prozentangaben im Abstract).
- Stützt: wohn-und-arbeitsort, wiedererkennbar (derived).

### sim-staab-2024 — Staab, Vero, Balunović, Vechev, ICLR 2024
URL: https://arxiv.org/abs/2310.07298 (ICLR-2024-Poster: https://iclr.cc/virtual/2024/poster/17964)

- Sinngemäß: Erste umfassende Studie dazu, wie gut vortrainierte Sprachmodelle persönliche Merkmale aus Texten ableiten (Datensatz aus echten Reddit-Profilen).
- Ergebnis: u. a. Ort, Einkommen, Geschlecht mit bis zu 85 % Top-1- und 95 % Top-3-Genauigkeit, bei etwa 1/100 der Kosten und 1/240 der Zeit menschlicher Auswertung.
- Stützt: jobwechsel, finanzielle-sorgen (possible).

### sim-paparrizos-2016 — Paparrizos, White, Horvitz, Journal of Oncology Practice 12(8), 2016
URL: https://doi.org/10.1200/JOP.2015.010504 (Abstract via Europe PMC, PMID 27271506)

- Sinngemäß: Online-Aktivitäten können Hinweise auf beginnende Erkrankungen geben.
- Aus zeitlichen Mustern in Suchanfragen ließ sich eine spätere Diagnose von Bauchspeicheldrüsenkrebs teilweise vorhersagen: 5–15 % der Fälle bei sehr niedriger Falsch-positiv-Rate (0,00001–0,0001).
- Stützt: schlafprobleme, gesundheitsbewusst (possible). Die Studie betrifft eine schwere Erkrankung, nicht Schlaf – sie belegt nur, dass Gesundheitsrückschlüsse aus Suchverläufen grundsätzlich machbar sind.

## Was nicht verifiziert werden konnte / bewusst weggelassen

- **EUR-Lex direkt:** eur-lex.europa.eu lieferte nur eine WAF-Challenge (HTTP 202, leerer Inhalt). Der Wortlaut von DSA Art. 26(3), 28(2) und DSGVO Art. 4(4), 9(1) wurde über die Spiegel eu-digital-services-act.com bzw. gdpr-info.eu geprüft; zitiert wird trotzdem die offizielle EUR-Lex-ELI-URL. Vor Veröffentlichung einmal manuell im Browser gegen EUR-Lex (DE-Fassung) abgleichen.
- **NYT 2012 / Target-Schwangerschaftsscore** (Duhigg, „How Companies Learn Your Secrets“): nytimes.com und web.archive.org waren nicht abrufbar; nur Sekundärquellen gefunden. Die bekannte Teenager-Anekdote gilt zudem als umstritten. Deshalb **nicht** als Quelle aufgenommen; „bald-eltern“ stützt sich auf Googles dokumentierte Elternstatus-Segmente.
- **Kosinski (PNAS):** Verlagsseite gab 403; Abstract über Crossref und Europe PMC verifiziert.
- **Ob Plattformen Schlafprobleme, Geldsorgen oder Jobwechsel ableiten:** nicht dokumentiert → diese Regeln stehen auf `possible`.
- **Einkommen:** Google dokumentiert die Kategorie „Household income“ nur für bestimmte Regionen; ob sie in Deutschland verfügbar ist, wurde nicht geprüft. Die Regel „einkommen“ sagt deshalb nur, dass Google Haushaltseinkommen „in manchen Ländern“ schätzt.
- **Life-Events-Liste:** Die Seite nennt Beispiele (Umzug, Heirat, Studienabschluss), eine vollständige Liste wurde nicht gefunden. „Parents of Infants“ ist ein Detailed-Demographics-Segment, kein Life Event.
- **Meta „Warum sehe ich diese Werbung?“:** Beleg stammt von 2019; aktuelle Menübezeichnungen (Accounts Center / Werbepräferenzen) nicht separat geprüft.
