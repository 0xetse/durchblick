# ADR-0003: Handgeschriebener Service Worker

Status: akzeptiert · 2026-10-07

## Entscheidung
`public/sw.js` (~50 Zeilen): Netzwerk zuerst für Seiten mit Cache-Fallback, Cache zuerst für gehashte Build-Dateien, ausschließlich gleiche Herkunft, keine Push-/Sync-Funktionen.

## Begründung
Für eine Vertrauens-Website ist ein lesbarer, kurzer Service Worker wertvoller als die Bequemlichkeit von Workbox. Die Transparenzseite kann darauf verweisen.

## Konsequenzen
Kein automatisches Precaching aller Seiten; offline verfügbar sind Kernseiten und alles bereits Besuchte. Umkehrbarkeit: hoch (`@vite-pwa/astro` jederzeit nachrüstbar).
