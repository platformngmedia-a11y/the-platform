'use client'
import { useState } from 'react'
import { Mail, Eye, X } from 'lucide-react'

export function NewsletterStrip({ variant = 'full' }: { variant?: 'full' | 'compact' | 'inline' }) {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [previewOpen, setPreviewOpen] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const darkInput = "flex-1 px-4 py-2.5 text-sm border border-white/20 bg-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
  const darkBtn   = "bg-gold text-ink font-bold text-sm px-6 py-2.5 rounded hover:bg-gold-light transition-colors disabled:opacity-60 shrink-0"

  const previewModal = previewOpen ? (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 text-left">
      <div className="bg-white text-ink rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-line">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold">
              SAMPLE EDITION • 7:00 AM WAT
            </span>
            <h3 className="text-lg font-extrabold text-navy">
              The Briefing — By The Platform
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            className="p-1.5 rounded-lg bg-paper hover:bg-gray-200 text-ink transition-colors"
            aria-label="Close sample issue preview"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-xs text-ink leading-relaxed max-h-80 overflow-y-auto pr-1">
          <div className="p-3.5 rounded-xl bg-paper border border-line">
            <div className="font-bold text-navy">1. THE LEAD: Economy &amp; Monetary Watch</div>
            <p className="mt-1">
              <strong>What happened:</strong> Updated NBS and CBN liquidity figures highlight the impact of benchmark interest rates on domestic manufacturing and food supply corridors.
            </p>
            <p className="mt-1 text-muted">
              <strong>Why it matters:</strong> SME credit costs and urban consumer prices remain the central policy test this quarter.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper border border-line">
            <div className="font-bold text-navy">2. FACT CHECK OF THE DAY</div>
            <p className="mt-1">
              <strong>Claim Audited:</strong> Viral social posts regarding quarterly federal revenue allocations.
            </p>
            <p className="mt-1 text-green-800 font-semibold">
              ✓ Cross-checked against official OAGF and DMO primary filings.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper border border-line">
            <div className="font-bold text-navy">3. ON OUR RADAR TODAY</div>
            <p className="mt-1 text-muted">
              • National Assembly committee hearings, energy sector updates, and West African regional diplomacy in 3 minutes.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-line flex items-center justify-between">
          <span className="text-xs text-muted">Delivered free every morning at 7:00 AM</span>
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            className="px-4 py-2 rounded-lg bg-navy text-white text-xs font-bold hover:bg-navy-dark transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  ) : null

  /* inline */
  if (variant === 'inline') {
    return (
      <div className="bg-navy rounded-xl p-6">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gold" />
            <span className="text-gold text-xs font-bold uppercase tracking-wider">
              The Platform Newsletter
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="text-xs text-gold hover:underline inline-flex items-center gap-1"
          >
            <Eye size={12} /> Preview
          </button>
        </div>
        <p className="text-white font-semibold text-sm mb-3">
          Get the daily briefing in your inbox — free.
        </p>
        {status === 'success'
          ? <p className="text-gold text-sm font-medium">✓ You&apos;re subscribed. Welcome to the informed.</p>
          : (
            <form onSubmit={submit} className="flex flex-col gap-2">
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className={darkInput}
              />
              <button type="submit" disabled={status === 'loading'} className={darkBtn}>
                {status === 'loading' ? 'Subscribing...' : 'Get The Briefing'}
              </button>
            </form>
          )
        }
        {status === 'error' && (
          <p className="text-red-300 text-xs mt-2">Something went wrong. Try again.</p>
        )}
        {previewModal}
      </div>
    )
  }

  /* compact */
  if (variant === 'compact') {
    return (
      <div className="border-t border-b border-navy/10 py-5 my-8 bg-navy/5 px-4 rounded-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-navy flex items-center gap-1.5">
            <Mail size={14} /> Get The Platform briefing (7:00 AM daily)
          </p>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1"
          >
            <Eye size={12} /> Preview Issue
          </button>
        </div>
        {status === 'success'
          ? <p className="text-green-700 text-sm">✓ Subscribed!</p>
          : (
            <form onSubmit={submit} className="flex gap-2">
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm border border-border rounded bg-white focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
              <button
                type="submit" disabled={status === 'loading'}
                className="bg-navy text-white text-sm font-bold px-4 py-2 rounded hover:bg-navy-light transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )
        }
        {previewModal}
      </div>
    )
  }

  /* full */
  return (
    <section className="bg-navy py-14 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-gold text-xs font-black uppercase tracking-widest">
          The Platform Newsletter
        </span>
        <h2 className="font-serif text-3xl font-bold text-white mt-2 mb-3">The Briefing</h2>
        <p className="text-white/60 mb-4 leading-relaxed max-w-lg mx-auto">
          Nigeria&apos;s most trusted daily digest. Curated by our editors — politics, economy, society
          and what matters — delivered every morning at 7am. Join 40,000+ readers making
          better-informed decisions.
        </p>
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
          >
            <Eye size={14} /> Preview Today&apos;s 7:00 AM Issue →
          </button>
        </div>
        {status === 'success'
          ? <p className="text-gold text-lg font-semibold">✓ You&apos;re subscribed. Welcome to the informed.</p>
          : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address" className={darkInput}
              />
              <button type="submit" disabled={status === 'loading'} className={darkBtn}>
                {status === 'loading' ? 'Subscribing...' : 'Get The Briefing'}
              </button>
            </form>
          )
        }
        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3">Something went wrong. Please try again.</p>
        )}
        <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
      {previewModal}
    </section>
  )
}
