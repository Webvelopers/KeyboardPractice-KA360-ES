/**
 * @fileoverview Service Worker — offline cache for KeyboardPractice.
 *
 * Implements cache-first fetch strategy for static assets, versioned caching
 * with old-cache cleanup on activation, and user-confirmation-based activation
 * via skipWaiting message handling.
 *
 * SEC-019:
 * - Only same-origin GET requests are answered; anything else goes to the
 *   network untouched.
 * - Navigations (e.g. "/" or "/?x=1") fall back to the cached `index.html`, so
 *   the app opens offline at its normal URL, not only at "/index.html".
 * - Activation deletes only this app's old caches ("keyboardpractice-*"), never
 *   caches of other apps that may share the origin (e.g. a GitHub Pages user site).
 * - Only the exact `{ action: "skipWaiting" }` message from a page of this
 *   origin activates a waiting worker.
 *
 * `scripts/update-sw-cache.js` rewrites the CACHE and ASSETS constants below
 * at build time; keep them adjacent and in this form.
 */

const CACHE = "keyboardpractice-72b5ed5aa42a";
const ASSETS = [
  "index.html",
  "app.CDfOjpAa.js",
  "app.Bu7ZI1eQ.css",
  "critical.css",
  "favicon.svg",
  "theme-preboot.js",
  "design/ka360.png",
  "manifest.json"
];

const CACHE_PREFIX = "keyboardpractice-";
const APP_SHELL_URL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  // Do NOT call self.skipWaiting() here — let the new version wait
  // for user confirmation before activating.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Cache-first lookup in this app's current cache.
 * @param {Request|string} request
 * @returns {Promise<Response|undefined>}
 */
function matchInAppCache(request) {
  return caches.open(CACHE).then((cache) => cache.match(request));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch (_error) {
    return;
  }
  // SEC-019: never answer cross-origin requests from this cache.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // App shell for any navigation inside the scope; network as last resort.
    event.respondWith(
      matchInAppCache(request)
        .then((cached) => cached || matchInAppCache(APP_SHELL_URL))
        .then((cached) => cached || fetch(request))
    );
    return;
  }

  event.respondWith(
    matchInAppCache(request).then((cached) => cached || fetch(request))
  );
});

// Listen for activation request from the page (user clicked "Actualizar").
self.addEventListener("message", (event) => {
  const fromThisOrigin = !event.origin || event.origin === self.location.origin;
  if (fromThisOrigin && event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
