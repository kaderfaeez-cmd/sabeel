/**
 * Sabeel's service worker.
 *
 * Constitution §7: "Offline-first for revelation." Surah text is already cached in
 * IndexedDB once read, but without a service worker the app shell itself would not load
 * offline — so the cached text was unreachable. This closes that gap, and is also what
 * makes Sabeel installable and eligible for a Play Store TWA.
 *
 * Deliberately conservative. A service worker is the easiest way to serve a stale broken
 * app to every returning visitor, so:
 *   - pages are network-first (fresh content wins, cache is only a fallback)
 *   - a version bump wipes every old cache
 *   - anything that is not a GET, or is cross-origin, is left entirely alone
 */

const VERSION = 'sabeel-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;

/** Enough to render something meaningful with no network at all. */
const SHELL = ['/offline', '/favicon.ico', '/site.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

/** A page the user has visited before, or the offline notice. */
async function handlePage(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offline = await caches.match('/offline');
    if (offline) return offline;

    return new Response('You are offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/** Immutable build output and images — safe to serve from cache first. */
async function handleAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(ASSET_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never interfere with anything that changes state, or with another origin.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(handlePage(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/backgrounds/') ||
    /\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(handleAsset(request));
  }
});

/** Lets the page tell a waiting worker to take over immediately. */
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
