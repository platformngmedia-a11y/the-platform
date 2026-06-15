import { Wifi } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-paper">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center">
            <Wifi size={32} className="text-navy opacity-50" />
            <div className="absolute inset-0 rounded-full border-2 border-navy/20"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">You're Offline</h1>
        <p className="text-muted mb-6 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry — you can still read articles you've previously visited.
        </p>

        <div className="bg-white border border-line rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-ink text-sm mb-2">What you can do:</h3>
          <ul className="text-sm text-muted space-y-1.5">
            <li className="flex gap-2">
              <span className="text-navy font-bold">✓</span>
              <span>Read cached articles</span>
            </li>
            <li className="flex gap-2">
              <span className="text-navy font-bold">✓</span>
              <span>View images from recent visits</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted/50 font-bold">✗</span>
              <span className="text-muted/70">Search or browse new articles</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted/50 font-bold">✗</span>
              <span className="text-muted/70">Load new content</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              window.location.href = '/'
            }}
            className="w-full px-4 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => {
              window.history.back()
            }}
            className="w-full px-4 py-2.5 bg-paper border border-line text-ink rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Go Back
          </button>
        </div>

        <p className="text-xs text-muted/70 mt-6">
          Check your internet connection and try again
        </p>
      </div>
    </div>
  )
}
