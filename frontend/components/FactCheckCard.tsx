import { CheckCircle, XCircle, AlertTriangle, HelpCircle, MinusCircle } from 'lucide-react'

const verdictConfig: Record<string, {
  label: string; Icon: any; bg: string; text: string; border: string
}> = {
  'true':         { label: 'True',         Icon: CheckCircle,   bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  'partly-true':  { label: 'Partly True',  Icon: MinusCircle,   bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-200' },
  'false':        { label: 'False',        Icon: XCircle,       bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
  'misleading':   { label: 'Misleading',   Icon: AlertTriangle, bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  'unverifiable': { label: 'Unverifiable', Icon: HelpCircle,    bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200' },
}

export function FactCheckCard({ check, compact = false }: { check: any; compact?: boolean }) {
  const c    = verdictConfig[check.verdict] ?? verdictConfig['unverifiable']
  const { Icon } = c
  const href = `/fact-check/${check.slug.current}`

  if (compact) {
    return (
      <a href={href} className={`block rounded-lg border p-4 hover:shadow-sm transition-shadow ${c.bg} ${c.border}`}>
        <div className={`flex items-center gap-2 text-xs font-bold mb-2 ${c.text}`}>
          <Icon size={14} />
          Verdict: {c.label}
        </div>
        <p className="text-sm font-semibold text-ink line-clamp-2">"{check.claim}"</p>
        {check.claimant && (
          <p className="text-xs text-muted mt-1">— {check.claimant}</p>
        )}
      </a>
    )
  }

  return (
    <a href={href} className="block bg-navy/5 border border-navy/10 rounded-xl p-6 hover:bg-navy/10 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-navy/50">Fact Check</span>
          <p className="font-serif text-lg font-bold text-ink mt-1 leading-snug">"{check.claim}"</p>
          {check.claimant && (
            <p className="text-xs text-muted mt-1">Claimed by: {check.claimant}</p>
          )}
        </div>
        <div className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border ${c.bg} ${c.text} ${c.border}`}>
          <Icon size={16} />
          <span className="text-xs font-bold whitespace-nowrap">{c.label}</span>
        </div>
      </div>
      {check.summary && (
        <p className="text-sm text-muted leading-relaxed line-clamp-2">{check.summary}</p>
      )}
      <p className="text-xs text-navy font-semibold mt-3">Read full fact check →</p>
    </a>
  )
}