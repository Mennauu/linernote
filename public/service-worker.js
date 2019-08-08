console.log('Hello from service-worker.js')

const filesToCache = [
  '/home',
]

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets')
  event.waitUntil(caches.open(staticCacheName)
    .then(cache => cache.addAll(filesToCache))
  )
})