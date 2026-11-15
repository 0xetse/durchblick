# Informationsarchitektur

Stand: 2026-10-07

## Mentales Modell

Nutzer denken nicht in „Datenkategorien" oder „DSGVO-Rechten", sondern in **Apps, die sie nutzen**, und in **Fragen**. Darum zwei Achsen:

- **Dienste** (Google, Instagram, …) sind die Objekte.
- **Die vier Leitfragen** sind die immer gleiche Struktur jeder Dienstseite und der Fußabdruck-Übersicht:
  1. Was erfahren sie? 2. Wie? 3. Was bedeutet das? 4. Was kannst du tun?

Alles Persönliche (Auswahl, Fortschritt) heißt **„Mein …"** und lebt ausschließlich im Browser.

## Kritische Prüfung der Ausgangshypothese

Die Hypothese des Auftrags war eine lineare Kette mit acht Seiten (Home → Footprint → Overview → Explorer → Detail → Action Center → Guide → Alternatives). Wir haben sie verdichtet:

| Hypothese | Entscheidung | Grund |
|---|---|---|
| Footprint und Personal Overview getrennt | **eine Seite** `/check/` (Auswahl oben, Ergebnis darunter, live) | Kein Seitenwechsel zwischen Ursache und Wirkung; funktioniert mobil besser. |
| Action Center und Guide getrennt | **ein Plan** `/plan/` mit aufklappbaren Anleitungen; zusätzlich statische Anleitungsseiten für Suche/Teilen | Weniger Navigationstiefe; Anleitungen trotzdem direkt verlinkbar (SEO: „Google personalisierte Werbung ausschalten"). |
| Service Explorer als eigene Startrampe | `/dienste/` als schlichte Übersicht, Haupteinstieg bleibt der Check | Explorer ist für Suchmaschinen und Fortgeschrittene, nicht der Hauptweg. |
| Alternativen pro Dienst | **eine** Seite `/alternativen/` nach Kategorien, von Dienstseiten verlinkt | Alternativen sind kategoriebezogen (Suche, Mail …), nicht dienstbezogen; vermeidet Duplikate. |
| „Privacy Factor" auf jeder Karte | Datenprofil nur auf der Dienstseite, nie in Listen/Karten | Verhindert Ranglisten-Lesart; Profil braucht Kontext und Begründung. |
| Signature-Erlebnis offen | „Fünf harmlose Spuren" auf `/` (Kurzfassung) und `/spuren/` (vollständig) | Bester Aha-Moment, unabhängig von Konto oder Dienstauswahl. |

## Sitemap (MVP)

```
/                         Start: Leitfragen + Mini-Experiment + Einstiege + Vertrauens-Hinweis
/spuren/                  Signature: Was verraten fünf harmlose Spuren?
/check/                   Mein Fußabdruck: Dienste wählen → persönliche Übersicht
/plan/                    Mein Plan: Maßnahmen nach Zeitaufwand, Fortschritt (lokal, opt-in)
/dienste/                 Alle Dienste (nach Anbieter gruppiert)
/dienste/<id>/            Dienstseite (4 Leitfragen, Datenreise, Datenprofil, Anleitungen, Quellen)
/anleitungen/<id>/        Einzelne Anleitung (statisch, teilbar, mit Prüfdatum)
/alternativen/            Alternativen nach Kategorie, mit Abwägungen
/transparenz/             So geht diese Seite mit deinen Daten um (live)
/methodik/                Quellen, Gewissheitsstufen, Datenprofil, Aktualität, Grenzen
/impressum/ /datenschutz/ Pflichtangaben (Inhalt: Entscheidung offen)
```

Elf Routen-Typen, davon vier interaktiv (Start, Spuren, Check, Plan, Transparenz-Live-Teil). Der Rest ist statisches HTML.

## Navigation

- **Kopfzeile (alle Seiten, seit D-051):** Logo · Einstellungen ändern · Mein Plan · Apps · Warum wichtig? · Vertrauens-Hinweis „Keine Tracker" (→ Transparenz). Der Menüpunkt ist auch auf zugehörigen Unterseiten markiert (`aria-current="true"`, auf der Seite selbst `"page"`). Mobil: Logo + Vertrauens-Hinweis + Menü-Schalter; Menü als einfache Liste (kein Off-Canvas-Overlay mit Fokusfalle nötig).
- **Fußzeile:** Meine Apps im Detail · Alternativen · Spuren · Methodik · Transparenz · Impressum · Datenschutz · „Stand der Inhalte" mit Version.
- **Dienstseite:** Sprungnavigation zu den vier Leitfragen (sticky auf Desktop, horizontal scrollbar auf Mobil).
- **„Du bist hier"-Pfad auf jeder Unterseite** (seit D-051), z. B. „Start › Einstellungen ändern › Google › Anleitung"; die Startseite hat keinen.

## URL- und Sprachkonzept

- Deutsch ohne Präfix (`/dienste/instagram/`), künftige Sprachen mit Präfix (`/en/services/instagram/`). Route-Segmente werden pro Sprache übersetzt; IDs bleiben gleich.
- Persönliche Auswahl bleibt **nur im geöffneten Tab** (`sessionStorage`, D-057) und steht nie automatisch in einer Adresse. Teilen geht bewusst über „Link mit meiner Auswahl teilen“ (Plan); ein solcher Link (`/plan/#d=google,instagram`) wird beim Öffnen übernommen und aus der Adresse entfernt. Das Fragment wird nie an den Server gesendet.

## Inhaltsobjekte → Ansichten

| Objekt | Erscheint in |
|---|---|
| Dienst | Dienste-Liste, Check-Auswahl, Fußabdruck, Dienstseite |
| Datenpunkt (Kategorie, Herkunft, Gewissheit) | Dienstseite (Was?), Fußabdruck (aggregiert nach Kategorie), Datenreise |
| Ableitung | Dienstseite (Was bedeutet das?) |
| Datenprofil (10 Dimensionen) | nur Dienstseite + Methodik |
| Anleitung | Dienstseite, Plan, eigene Seite |
| Alternative | Alternativen-Seite, Verweis von Dienstseite |
| Quelle | überall als Fußnote; Quellenliste je Dienstseite |
| Spuren-Signal/-Regel | Start, Spuren-Seite |

## Begriffe (Glossar für die Oberfläche)

| Statt | Sagen wir | Warum |
|---|---|---|
| Privacy Score / Factor | **Datenprofil** | keine Zahl, siehe Methodik |
| Tracking | „mitbekommen", „aufzeichnen", technisch erst in Stufe 3 | Alltagssprache |
| Inferenz | **Schlussfolgerung / Einschätzung** | verständlich |
| Opt-out | **abschalten / einschränken** | konkret |
| Personenbezogene Daten | **Daten über dich** | verständlich |
| Gewissheit „stated" | **Laut Anbieter** | wer sagt es |
| „technical" | **Technisch zwangsläufig** | z. B. IP-Adresse |
| „research" | **Laut Forschung** | |
| „documented" (Ableitung) | **Vom Anbieter beschrieben** | |
| „possible" (Ableitung) | **Möglich, nicht belegt** | nie als Tatsache |
