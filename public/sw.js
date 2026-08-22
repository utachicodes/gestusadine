const CACHE = 'gsd-v4';
const OFFLINE_URL = '/offline.html';

// Only cache immutable static assets (hashed filenames from the Vite build).
const STATIC_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.ttf', '.png', '.svg', '.ico'];

function isStaticAsset(url) {
  const path = new URL(url).pathname;
  return STATIC_EXTENSIONS.some((ext) => path.endsWith(ext));
}

// ── Install: precache the offline fallback ──────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)).then(() => self.skipWaiting())
  );
});

// ── Push notifications ───────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}

  const title = data.title || 'GëstuSaDine';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'default',
    data: { url: data.url || '/dashboard' },
    dir: 'ltr',
    vibrate: [80, 40, 80],
    requireInteraction: false,
  };

  // Prayer notifications get a single calm "Open" action.
  if ((data.tag || '').startsWith('prayer-')) {
    options.actions = [{ action: 'open', title: 'Open app' }];
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Re-subscribe after the browser rotates push subscriptions (e.g. long-lived
// Chrome subscriptions). The next visit to Notification Settings will persist
// the new subscription server-side.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .catch(() => {})
  );
});

// ── Activate: clean old caches ───────────────────────────────────────────────

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: static assets cache-first, navigations network-first w/ fallback ──

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept requests to Convex or any external origin.
  if (url.origin !== location.origin) return;

  // Navigation requests: try network, fall back to the offline page so the
  // installed app never shows the browser's dinosaur.
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((cached) => cached || Response.error())
      )
    );
    return;
  }

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
