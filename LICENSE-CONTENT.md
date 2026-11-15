# Lizenzen von Code und Inhalten

*English summary below.*

Durchblick besteht aus Code, eigenen redaktionellen Inhalten und Material Dritter. Diese drei Teile stehen unter unterschiedlichen Bedingungen.

## Übersicht

| Pfad | Lizenz | Hinweis |
|---|---|---|
| `src/`, `scripts/`, `tests/` | [MIT](LICENSE) | Code |
| `public/sw.js`, `public/_headers`, `public/manifest.webmanifest`, `public/robots.txt`, `public/.well-known/` | [MIT](LICENSE) | |
| `.github/`, Konfigurationsdateien, `package.json`, `package-lock.json` | [MIT](LICENSE) | |
| `public/icons/` | [MIT](LICENSE) | Gilt für die Dateien; Name und Logo „Durchblick“ werden damit nicht als Kennzeichen lizenziert (siehe unten) |
| `content/` (inkl. `content/i18n/en/`) | [CC BY 4.0](LICENSES/CC-BY-4.0.txt) | **ohne** wörtliche Zitate Dritter (siehe unten) |
| `docs/` (inkl. Screenshots der eigenen Website) | [CC BY 4.0](LICENSES/CC-BY-4.0.txt) | **ohne** wörtliche Zitate Dritter, vor allem in `docs/research/` |
| `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `LICENSE-CONTENT.md` | [CC BY 4.0](LICENSES/CC-BY-4.0.txt) | |
| `CODE_OF_CONDUCT.md` | [CC BY 4.0](LICENSES/CC-BY-4.0.txt) | übernimmt den Contributor Covenant 2.1 (CC BY 4.0) per Verweis |
| `LICENSE`, `LICENSES/`, `public/licenses/` | jeweiliger Lizenztext | Lizenztexte selbst werden nicht neu lizenziert |

## Ausgenommen: Material Dritter

Die folgenden Bestandteile stehen **nicht** unter MIT oder CC BY 4.0. Die Rechte liegen bei den jeweiligen Rechteinhabern:

1. **Wörtliche Zitate** aus Datenschutzerklärungen, Hilfeseiten, Geschäftsberichten, Blogbeiträgen, Rechtstexten und wissenschaftlichen Veröffentlichungen. Sie stehen in Anführungszeichen, vor allem im Feld `note` der Dateien unter `content/` (vereinzelt auch in `technical`, `detail` und `method`), in `docs/research/` und in `docs/content/gegenlesen-2026-10.md`, und sind jeweils mit Quelle belegt (`content/sources/`). Sie werden als Beleg zitiert (§ 51 UrhG). Das gilt auch für **Übersetzungen** solcher Zitate (z. B. englische Wiedergaben unter `content/i18n/en/`): Sie bleiben Material Dritter. Wer Inhalte weiterverwendet, muss für diese Zitate selbst prüfen, ob die Nutzung erlaubt ist.
2. **Namen und Marken** der beschriebenen Dienste und Unternehmen. Ihre Nennung dient der Beschreibung. Durchblick ist mit keinem dieser Anbieter verbunden und wird von keinem unterstützt.
3. **Schriften:** IBM Plex Sans und IBM Plex Mono, © IBM Corp., unter der SIL Open Font License 1.1. Die Schriftdateien kommen über npm (`@fontsource-variable/ibm-plex-sans`, `@fontsource/ibm-plex-mono`) und werden mit der Website ausgeliefert; die Lizenztexte liegen in [`public/licenses/`](public/licenses/).
4. **Abhängigkeiten** unter ihren eigenen Lizenzen (siehe `package-lock.json`). Was davon mit der Website ausgeliefert wird (u. a. Preact, Astro-Laufzeit, Zod – alle MIT), steht mit Lizenztext in [`public/licenses/THIRD-PARTY-NOTICES.txt`](public/licenses/THIRD-PARTY-NOTICES.txt).

Der Name „Durchblick“ ist ein Arbeitstitel und nicht markenrechtlich geprüft. Forks sollten einen eigenen Namen verwenden, damit niemand eine abgewandelte Fassung (etwa mit Tracking) für dieses Projekt hält.

## Nicht abschließend geklärt

Die folgenden Punkte sind **nicht rechtlich geprüft**. Sie sind hier offen benannt, damit eine spätere Prüfung gezielt ansetzen kann. Dass etwas hier nicht steht, heißt nicht, dass es geklärt ist.

Alle Fundstellen wörtlicher Zitate lassen sich reproduzierbar auflisten: `node scripts/zitate-inventar.mjs` (Datei, Zeile, Quelle mit Typ und Herausgeber, Sprache, Länge, Markierung; erfasst `content/` einschließlich der Quellendateien sowie `docs/research/`).

**Stand 2026-11-14:** Wörtliche Zitate aus Presseartikeln, Abstracts wissenschaftlicher Arbeiten und ein langes Zitat aus einer Anbieter-Hilfeseite sind durch eigene, als „Sinngemäß“ gekennzeichnete Zusammenfassungen mit Quellenverweis ersetzt. Die Zusammenfassungen sind gegen die Originale geprüft.

| Punkt | Fundstellen | Warum offen |
|---|---|---|
| Kurze Zitate aus einem Blog und einer Kampagnenseite | `content/services/telegram.yaml:18`, `:67`, `content/sources/telegram.yaml:81` (Blog eines Kryptografen); `content/services/spotify.yaml:250`, `content/sources/spotify.yaml:211` (Access Now, gibt eine Aussage von Spotify wieder); jeweils mit Kopien in `content/i18n/en/` | Kurze Belegzitate mit Quellenangabe; Umfang und Belegzweck im Einzelfall nicht rechtlich geprüft |
| Lange Zitate aus EU-Rechtstexten | `docs/research/simulator-research.md:73`, `:79`, `:80` (DSA, DSGVO) | Amtliche Texte der EU gelten verbreitet als weiterverwendbar; für diesen Fall nicht abschließend geprüft |
| Englische Wiedergaben deutscher Wortlaute | 21 Stellen in `content/i18n/en/` (im Inventar: „englische Fassung“) | Eigene Übersetzungen in Anführungszeichen; seit 2026-11-14 auf der Methodik-Seite als solche erklärt. Ob einzelne Stellen ausdrücklich gekennzeichnet werden sollten, ist offen |
| Zitatsprache weicht von der verlinkten Quelle ab | 4 Stellen (im Inventar: „übersetzt?“) | Dokumentationsfrage: Herkunft des Wortlauts (z. B. deutsche Fassung einer englisch verlinkten Richtlinie) |
| Kurze Zitate aus Anbieter-Texten ohne zeilengenaue Quelle | 120 Stellen in `content/` | Quelle steht im selben Eintrag (Hilfeseiten, Datenschutzerklärungen, Behörden); übliche Belegzitate, nicht einzeln geprüft |
| Logo und Icons | `public/icons/`, Logo in `src/layouts/Base.astro` | Einfache geometrische Formen (3×3-Raster). Laut Versionsgeschichte im Projekt selbst mit KI-Unterstützung erstellt, ohne Fremdvorlage. Ob Schutz besteht und ob Verwechslungsgefahr mit fremden Zeichen besteht, ist nicht geprüft |
| KI-gestützt entstandene Texte und Code | gesamtes Repository | Umfang des urheberrechtlichen Schutzes ungeklärt (siehe unten) |
| Name „Durchblick“ | – | Keine Registerrecherche (DPMA, EUIPO) durchgeführt. Bekannt ist eine gleichnamige App eines anderen Anbieters im Bereich Altersvorsorge. Der Name ist ein beschreibendes Alltagswort und vermutlich schwer schützbar; für einen Produktivbetrieb ist eine Markenrecherche nötig |

## Namensnennung (CC BY 4.0)

Vorschlag für die Namensnennung bei Weiterverwendung von Inhalten:

> Inhalte aus „Durchblick“ von Etse (0xetse) und Mitwirkenden, https://github.com/0xetse/durchblick, lizenziert unter CC BY 4.0. Änderungen: *[bitte angeben]*.

## KI-Unterstützung und Urheberrecht

Große Teile von Code, Texten und Dokumentation wurden mit einem KI-Assistenten (Claude, Anthropic) erstellt, nach menschlichen Vorgaben und von einem Menschen geprüft und überarbeitet. Soweit an diesen Teilen Urheberrechte bestehen, gelten die oben genannten Lizenzen. Ob und in welchem Umfang KI-gestützte Teile urheberrechtlich geschützt sind, ist rechtlich nicht abschließend geklärt. Diese Datei ist keine Rechtsberatung.

---

## English summary

- **Code** (`src/`, `scripts/`, `tests/`, configuration, `public/` scripts and icons): **MIT** ([`LICENSE`](LICENSE)).
- **Own editorial content and documentation** (`content/`, `docs/`, Markdown files): **CC BY 4.0** ([`LICENSES/CC-BY-4.0.txt`](LICENSES/CC-BY-4.0.txt)).
- **Excluded:** verbatim quotations from third-party privacy policies, help pages, reports, legal texts and papers (in quotation marks, mainly in the `note` fields under `content/` and in `docs/research/`, always with a source); names and trademarks of the services described (Durchblick is not affiliated with any of them); the IBM Plex fonts (SIL OFL 1.1); dependencies under their own licenses (notices for shipped code in `public/licenses/`).
- The name “Durchblick” is a working title and is not licensed as a trademark; forks should use their own name.
- **Not legally reviewed:** short quotations from a blog and a campaign page, long quotations from EU legal texts, our own English translations of German wording (explained on the methodology page), the logo/icons and the AI-assisted parts. Verbatim quotations from press articles and paper abstracts were replaced by own summaries marked “Sinngemäß”. Locations are listed in the section “Nicht abschließend geklärt”; all quotations can be listed with `node scripts/zitate-inventar.mjs`.
- Much of the project was produced with an AI assistant under human direction and review. To the extent copyright subsists, the licenses above apply; the extent of protection for AI-assisted parts is legally unsettled. Not legal advice.
