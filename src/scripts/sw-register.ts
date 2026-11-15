// Registers the offline service worker. The worker only caches this site's own
// files; it makes no requests to other origins (see public/sw.js).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* offline support is optional */
    });
  });
}
