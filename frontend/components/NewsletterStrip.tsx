'use client'
import { useState } from 'react'
import { Mail } from 'lucide-react'

export function NewsletterStrip({ variant = 'full' }: { variant?: 'full' | 'compact' | 'inline' }) {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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

  /* inline */
  if (variant === 'inline') {
    return (
      <div className="bg-navy rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Mail size={16} className="text-gold" />
          <span className="text-gold text-xs font-bold uppercase tracking-wider">
            The Platform Newsletter
          </span>
        </div>
        <p className="text-white font-semibold text-sm mb-3">
          Get the daily briefing in your inbox — free.
        </p>
        {status === 'success'
          ? <p className="text-gold text-sm font-medium">✓ You're subscribed. Welcome to the informed.</p>
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
      </div>
    )
  }

  /* compact */
  if (variant === 'compact') {
    return (
      <div className="border-t border-b border-navy/10 py-5 my-8 bg-navy/5 px-4 rounded-lg">
        <p className="text-sm font-bold text-navy mb-2 flex items-center gap-1.5">
          <Mail size={14} /> Get The Platform briefing
        </p>
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
        <p className="text-white/60 mb-8 leading-relaxed max-w-lg mx-auto">
          Nigeria's most trusted daily digest. Curated by our editors — politics, economy, society
          and what matters — delivered every morning at 7am. Join 40,000+ readers making
          better-informed decisions.
        </p>
        {status === 'success'
          ? <p className="text-gold text-lg font-semibold">✓ You're subscribed. Welcome to the informed.</p>
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
    </section>
  )
}