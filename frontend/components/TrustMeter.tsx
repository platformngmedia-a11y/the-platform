import { calculateArticleTrustScore, getTrustMeterColor, getTrustMeterWidth } from '@/lib/trust-scoring'
import { Shield, CheckCircle } from 'lucide-react'

interface Props {
  article: any
  variant?: 'full' | 'compact' | 'minimal'
}

export function TrustMeter({ article, variant = 'full' }: Props) {
  const trust = calculateArticleTrustScore(article)

  const levelEmoji: Record<string, string> = {
    Low: '⚠️',
    Fair: '📊',
    Good: '✓',
    Excellent: '⭐',
  }

  const levelDescription: Record<string, string> = {
    Low: 'Limited trust signals',
    Fair: 'Basic credibility markers',
    Good: 'Solid journalistic standards',
    Excellent: 'Excellent credibility signals',
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{levelEmoji[trust.level]}</span>
        <span className="text-xs font-semibold text-ink">{trust.level}</span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg p-3 ${getTrustMeterColor(trust.level)}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield size={14} />
            <span className="text-xs font-bold">Trust Score</span>
          </div>
          <span className="text-sm font-bold">{trust.score}/100</span>
        </div>
        <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 transition-all duration-500"
            style={{ width: getTrustMeterWidth(trust.score) }}
          />
        </div>
        <p className="text-xs mt-2">{trust.level} credibility</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg p-6 border border-current border-opacity-20 ${getTrustMeterColor(trust.level)}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <div>
              <h3 className="font-bold">Trust Score</h3>
              <p className="text-xs opacity-75">{levelDescription[trust.level]}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{trust.score}</div>
            <div className="text-xs opacity-75">/100</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-current opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-current transition-all duration-500"
            style={{ width: getTrustMeterWidth(trust.score) }}
          />
        </div>

        {/* Level indicator */}
        <div className="mt-3 text-sm font-semibold">
          Rating: <span>{levelEmoji[trust.level]} {trust.level}</span>
        </div>
      </div>

      {/* Credibility Factors */}
      {trust.factors.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-2">Why this score?</h4>
          <ul className="space-y-1.5">
            {trust.factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle size={14} className="flex-shrink-0 mt-0.5 opacity-70" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score breakdown */}
      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
        <h4 className="text-xs font-bold mb-2 opacity-75">Score Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <p className="opacity-75">Author</p>
            <p className="font-bold">{trust.signals.authorCredibility}</p>
          </div>
          <div>
            <p className="opacity-75">Sources</p>
            <p className="font-bold">{trust.signals.sources}</p>
          </div>
          <div>
            <p className="opacity-75">Depth</p>
            <p className="font-bold">{trust.signals.depth}</p>
          </div>
          <div>
            <p className="opacity-75">Editorial</p>
            <p className="font-bold">{trust.signals.editorial}</p>
          </div>
          <div>
            <p className="opacity-75">Transparency</p>
            <p className="font-bold">{trust.signals.transparency}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
