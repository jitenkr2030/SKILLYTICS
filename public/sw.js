const CACHE_NAME = 'skillytics-cache-v1'
const urlsToCache = [
  '/',
  '/mission',
  '/project',
  '/scenario',
  '/git-simulator',
  '/architecture',
  '/analyzer',
  '/testing-simulator',
  '/career',
  '/analytics'
]

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(() => self.registration.active)
  self.skipWaiting()
  
  return self.clients.claim()
    .then(() => self.skipWaiting())
    .then(() => caches.open(CACHE_NAME))
    .then((cache) => {
      return cache.addAll(
        urlsToCache.map(url => new Request(url, { cache: 'force-cache' }))
      )
    })
})

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(() => self.clients.claim())
  return self.clients.claim().then((clients) => {
      return clients.forEach(client => client.navigate(client.url))
  })
})

// Fetch event listener
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.waitUntil) {
    event.waitUntil(() => self.registration.active)
  }
  
  event.waitUntil(() => caches.open(CACHE_NAME)).then((cache) => {
    return cache.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => self.clients.claim())
  })
})