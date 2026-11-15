# Sicherheitspraxis

- **Abhängigkeiten:** exakt gepinnt (`--save-exact`), Lockfile committet, so wenige wie möglich. Laufzeit-Abhängigkeiten im Browser: nur Preact (und Astros Insel-Runtime). Prüfen: `npm run audit:deps`.
- **Secrets:** keine. Das Produkt braucht weder API-Schlüssel noch Umgebungsvariablen. Sollte das je nötig werden: `.env.example` mit Beschreibung, `.env*` bleibt ignoriert.
- **CSP:** Astro `security.csp` erzeugt pro Seite Hashes für Skripte und Styles. Keine Inline-`style`-Attribute im Markup (verstoßen gegen CSP) – Fortschrittsanzeigen nutzen `<progress>`.
- **Header:** `public/_headers` (HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP, frame-ancestors). Beim Wechsel auf einen Host ohne `_headers`-Unterstützung müssen diese Header dort gesetzt werden.
- **Externe Links:** immer `rel="noopener noreferrer"`; offizielle Links zusätzlich per Test gegen eine Domain-Allowlist je Unternehmen geprüft.
- **Content-Validierung:** strikte Schemas, nur `https:`-URLs, Build bricht bei Fehlern ab.
- **security.txt:** `public/.well-known/security.txt` (Platzhalter-Kontakt, vor Veröffentlichung setzen).
- **Meldungen:** Sicherheitsprobleme bitte nicht öffentlich melden, sondern an den Kontakt in `security.txt`.
