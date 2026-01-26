// sw.js — cache-first simples (offline) para a calculadora
const CACHE_NAME = "ucip-dp-mp-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      // cache new GETs
      if (req.method === "GET" && resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return resp;
    }).catch(() => cached))
  );
});
