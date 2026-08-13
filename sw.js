const CACHE_NAME = "andrew-films-za-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./Screenshot_20260617_142358_ChatGPT.jpg",
  "./file_0000000033f0823089605829abcb56ce.png",
  "./InShot_20260616_103026893.jpg",
  "./InShot_20260617_153038358.jpg",
  "./2026-05-02-092553932.mp4",
  "./InShot_20260616_105716880.jpg",
  "./InShot_20260619_071418168.jpg",
  "./me.jpg",
  "./InShot_20260616_104707235.jpg",
  "./InShot_20260616_110029730.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(err => console.warn("Initial cache warning:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached => cached || caches.match("./offline.html"))
    )
  );
});
