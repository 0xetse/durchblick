/**
 * Header pop-ups (menu, "Keine Tracker") are <details> elements: they work
 * without JavaScript. This adds what people expect from a pop-up: Escape
 * closes it and returns focus to its button; a tap or click elsewhere closes it.
 */
const POPUPS = 'header details.nav-menu, header details.trust-panel';

function openPopups(): HTMLDetailsElement[] {
  return [...document.querySelectorAll<HTMLDetailsElement>(POPUPS)].filter((d) => d.open);
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  for (const d of openPopups()) {
    const inside = d.contains(document.activeElement);
    d.open = false;
    if (inside) d.querySelector<HTMLElement>('summary')?.focus();
  }
});

document.addEventListener('pointerdown', (e) => {
  for (const d of openPopups()) if (!d.contains(e.target as Node)) d.open = false;
});

// Only one pop-up at a time.
for (const d of document.querySelectorAll<HTMLDetailsElement>(POPUPS)) {
  d.addEventListener('toggle', () => {
    if (!d.open) return;
    for (const other of openPopups()) if (other !== d) other.open = false;
  });
}
