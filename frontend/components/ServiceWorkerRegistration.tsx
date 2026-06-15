'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegistration() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        setRegistration(reg)

        // Check for updates periodically (every hour)
        setInterval(() => {
          reg.update()
        }, 3600000)

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New service worker available')
              setIsUpdateAvailable(true)

              // Notify user of update (optional)
              const event = new CustomEvent('swupdate')
              window.dispatchEvent(event)
            }
          })
        })

        console.log('[App] Service Worker registered successfully')
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error)
      }
    }

    registerSW()
  }, [])

  if (isUpdateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-navy text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3 z-50">
        <div>
          <p className="font-semibold text-sm">App update available</p>
          <p className="text-xs opacity-90">Reload to get the latest version</p>
        </div>
        <button
          onClick={() => {
            if (registration?.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' })
              window.location.reload()
            }
          }}
          className="px-3 py-1.5 bg-gold text-navy rounded text-xs font-semibold hover:bg-gold/90 transition-colors shrink-0"
        >
          Update
        </button>
      </div>
    )
  }

  return null
}
