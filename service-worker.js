const CACHE_NAME = 'code-master-hub-v16';
const THREE_RUNTIME = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
const APP_FILES = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './app-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    try {
      const response = await fetch(THREE_RUNTIME, { mode: 'cors' });
      if (response.ok) await cache.put(THREE_RUNTIME, response);
    } catch {
      return;
    }
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('code-master-hub-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const isThreeRuntime = request.url === THREE_RUNTIME;
  if (request.method !== 'GET' || (new URL(request.url).origin !== self.location.origin && !isThreeRuntime)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
        return response;
      }).catch(async () => (await caches.match(request)) || caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkResponse = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      if (cached) {
        event.waitUntil(networkResponse.catch(() => undefined));
        return cached;
      }
      return networkResponse;
    })
  );
});