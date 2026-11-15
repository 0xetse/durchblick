/**
 * Links on every page. The app selection never travels in an address (D-N24):
 * pages read it from this tab (domain/selection.ts).
 */
import { addToSelection, takeOverLink } from '~/domain/selection';

const ids = (document.body.dataset.appIds ?? '').split(',').filter(Boolean);

// A link with a selection (#d=…) on a page that does not handle it itself:
// take it over into this tab (known apps only) and clean the address.
if (!document.body.hasAttribute('data-selection-owner')) {
  takeOverLink(window.location.hash, ids);
  window.addEventListener('hashchange', () => takeOverLink(window.location.hash, ids));
}

// "In meinen Plan übernehmen": add the app to this tab's selection and open the
// plan here. A new tab would start without the selection (each tab keeps its
// own), so Ctrl/Cmd/Shift-click and middle-click open it in this tab too.
// Without JavaScript the link still opens the plan (with the general steps).
const addApp = (e: MouseEvent) => {
  const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[data-add-app]');
  if (!a?.dataset.addApp || (e.type === 'auxclick' && e.button !== 1)) return;
  e.preventDefault();
  addToSelection(a.dataset.addApp, ids);
  window.location.assign(a.href);
};
document.addEventListener('click', addApp);
document.addEventListener('auxclick', addApp);

// "Zum Inhalt springen": move focus without changing the address.
// Without JavaScript the plain link works.
document.querySelector<HTMLAnchorElement>('a.skip-link')?.addEventListener('click', (e) => {
  const main = document.getElementById('main');
  if (!main) return;
  e.preventDefault();
  main.focus();
  main.scrollIntoView({ block: 'start' });
});
