# ADR-0001: Statische Astro-Site mit Preact-Inseln, kein Backend

Status: akzeptiert · 2026-10-07

## Kontext
Das Produkt braucht SEO-fähige Inhaltsseiten, wenige stark interaktive Erlebnisse, PWA-Fähigkeit, exzellente Performance und – zentral – eine glaubwürdige Antwort auf „Warum sollte ich einer Datenschutz-Website Daten geben?".

## Entscheidung
Astro mit statischem Output; Interaktivität ausschließlich über Preact-Inseln; kein Server-Code, keine Datenbank, keine Konten.

## Alternativen
- **Next.js/React:** stark, aber mehr Client-JS als Standard und Neigung zu Server-Funktionen; für dieses Produkt überdimensioniert.
- **SvelteKit:** gute Option, kleines JS; Astro bietet bei überwiegend statischen Inhalten das einfachere Modell (Null-JS-Standard) und eingebaute CSP.
- **Reines SPA:** schlecht für SEO und Erstlade-Performance.

## Konsequenzen
+ Kein Ort, an dem Nutzerdaten serverseitig anfallen könnten (außer Hosting-Zugriffsprotokoll).
+ Sehr schnelle Seiten, CSP mit Hashes, billig zu hosten.
− Spätere Funktionen mit Server (z. B. anonyme Rückmeldungen) brauchen bewusst neue Infrastruktur → eigenes ADR mit Privacy-Review.

Umkehrbarkeit: mittel (Inseln und Domain-Logik sind framework-unabhängig portierbar).
