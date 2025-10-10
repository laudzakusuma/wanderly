/* eslint-disable no-restricted-globals */

// Cache name
const CACHE_NAME = 'wanderly-v1.0.0';
const DATA_CACHE_NAME = 'wanderly-data-v1';

// Assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // If response is valid, clone and cache it
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return cache.match(event.request);
        });
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-destinations') {
    event.waitUntil(syncDestinations());
  }
});

function syncDestinations() {
  return fetch('/api/destinations')
    .then((response) => response.json())
    .then((data) => {
      return caches.open(DATA_CACHE_NAME).then((cache) => {
        cache.put('/api/destinations', new Response(JSON.stringify(data)));
      });
    })
    .catch((error) => {
      console.error('Sync failed:', error);
    });
}