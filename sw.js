const CACHE_NAME = 'cda-sec-os-v4.4';
const CORE_ASSETS = [
  './',
  './index.html',
  './promo.html',
  './manifest.json',
  './css/style.css',
  './js/main.js',
  './js/state.js',
  './js/missions.js',
  './js/siem.js',
  './js/threatintel.js',
  './js/labs.js',
  './js/quiz.js',
  './js/skills.js',
  './js/career.js',
  './js/achievements.js',
  './js/ui.js',
  './js/audio.js',
  './js/certificate.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkRes;
      })
      .catch(() => caches.match(event.request))
  );
});
