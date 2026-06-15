const CACHE_NAME = 'theplatform-v1'
const STATIC_CACHE = 'theplatform-static-v1'
const IMAGE_CACHE = 'theplatform-images-v1'
const API_CACHE = 'theplatform-api-v1'

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...')
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if some assets aren't available yet
      })
      self.skipWaiting()
    })()
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...')
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== IMAGE_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log(`[ServiceWorker] Deleting cache: ${cacheName}`)
            return caches.delete(cacheName)
          }
        })
      )
      self.clients.claim()
    })()
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return
  }

  // API requests - Network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    return event.respondWith(networkFirstStrategy(request, API_CACHE))
  }

  // Image requests - Cache first with 30-day expiry
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
    url.hostname.includes('cdn.sanity.io')
  ) {
    return event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE))
  }

  // Static assets (CSS, JS) - Cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.match(/\.(css|js)$/)
  ) {
    return event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
  }

  // HTML pages - Network first, fall back to cache
  if (request.destination === 'document' || url.pathname === '/') {
    return event.respondWith(networkFirstStrategy(request, CACHE_NAME))
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, CACHE_NAME))
})

// Network first strategy: try network, fall back to cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    // Cache successful responses
    if (cacheName) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log(`[ServiceWorker] Network request failed for ${request.url}`, error)
    const cached = await caches.match(request)
    if (cached) {
      console.log(`[ServiceWorker] Serving from cache: ${request.url}`)
      return cached
    }

    // Return offline page for document requests
    if (request.destination === 'document') {
      const offlineCache = await caches.open(STATIC_CACHE)
      return offlineCache.match('/offline') || new Response('Offline')
    }

    return new Response('Offline - Content not available', { status: 503 })
  }
}

// Cache first strategy: try cache, fall back to network
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    // Check if cache is stale (older than 30 days for images)
    const isImage = request.destination === 'image'
    if (isImage) {
      // Update in background (stale-while-revalidate)
      updateCacheInBackground(request, cacheName)
    }
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok && cacheName) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log(`[ServiceWorker] Cache miss for ${request.url}`, error)
    return new Response('Offline', { status: 503 })
  }
}

// Update cache in background without blocking response
async function updateCacheInBackground(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok && cacheName) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
  } catch (error) {
    // Silently fail background updates
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
