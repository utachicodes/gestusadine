const CACHE = 'gsd-v2';

// Only cache immutable static assets (hashed filenames from the Vite build).
const STATIC_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.ttf', '.png', '.svg', '.ico'];

function isStaticAsset(url) {
  const path = new URL(url).pathname;
  return STATIC_EXTENSIONS.some((ext) => path.endsWith(ext));
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept requests to Convex or any external origin.
  if (url.origin !== location.origin) return;

  // Only cache static assets — never cache HTML, API responses, or
  // anything that could contain authenticated user data.
  if (!isStaticAsset(url.href)) return;

  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
