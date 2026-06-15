import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  factCheck: any
  variant?: 'card' | 'inline'
}

export function FactCheckLink({ factCheck, variant = 'card' }: Props) {
  if (!factCheck) return null

  const verdictConfig: Record<string, { icon: any; bg: string; text: string; color: string }> = {
    True: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      text: 'text-green-700',
      color: 'border-green-200',
    },
    'Mostly True': {
      icon: CheckCircle,
      bg: 'bg-lime-50',
      text: 'text-lime-700',
      color: 'border-lime-200',
    },
    Mixed: {
      icon: HelpCircle,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      color: 'border-amber-200',
    },
    'Mostly False': {
      icon: AlertCircle,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      color: 'border-orange-200',
    },
    False: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      text: 'text-red-700',
      color: 'border-red-200',
    },
  }

  const config = verdictConfig[factCheck.verdict] || verdictConfig.Mixed
  const Icon = config.icon

  if (variant === 'inline') {
    return (
      <a
        href={`/fact-check/${factCheck.slug.current}`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.color} hover:opacity-80 transition-opacity`}
      >
        <Icon size={14} className="flex-shrink-0" />
        <span className="text-xs font-semibold">{factCheck.verdict}</span>
      </a>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${config.bg} ${config.color} border`}>
      <div className="flex gap-3 items-start">
        <Icon size={20} className={`flex-shrink-0 mt-0.5 ${config.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-semibold ${config.text}`}>{factCheck.verdict}</h4>
            <a
              href={`/fact-check/${factCheck.slug.current}`}
              className="text-xs text-navy hover:underline"
            >
              Full fact-check →
            </a>
          </div>
          <p className="text-sm text-ink mb-2">{factCheck.claim}</p>
          <div className="flex items-center gap-4 text-xs text-muted">
            {factCheck.checkedBy && (
              <span>Checked by {factCheck.checkedBy.name}</span>
            )}
            {factCheck.publishedAt && (
              <span>{format(new Date(factCheck.publishedAt), 'd MMM yyyy')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
