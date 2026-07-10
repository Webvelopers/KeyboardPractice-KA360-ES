const CACHE = "keyboardpractice-37a3b0d8cbc4";
const ASSETS = [
  "index.html",
  "app.DEA50I16.js",
  "app.B29rJhEy.css",
  "favicon.svg",
  "theme-preboot.js",
  "sidebar.js",
  "design/ka360.png",
  "manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  // Do NOT call self.skipWaiting() here — let the new version wait
  // for user confirmation before activating.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Listen for activation request from the page (user clicked "Actualizar").
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
