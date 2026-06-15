import { CheckCircle, Shield } from 'lucide-react'

interface Props {
  author: any
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function VerificationBadge({ author, size = 'md', showLabel = true }: Props) {
  if (!author?.isVerifiedJournalist && !author?.credibilityBadge) return null

  const sizeConfig = {
    sm: { icon: 12, container: 'px-2 py-1 text-xs' },
    md: { icon: 16, container: 'px-2.5 py-1.5 text-sm' },
    lg: { icon: 20, container: 'px-3 py-2 text-base' },
  }

  const config = sizeConfig[size]

  const badgeStyles: Record<string, { bg: string; text: string; icon: string }> = {
    verified: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: '✓',
    },
    senior: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: '★',
    },
    contributor: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: '★',
    },
    staff: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      icon: '○',
    },
  }

  const badgeKey = author.credibilityBadge || 'verified'
  const style = badgeStyles[badgeKey] || badgeStyles.verified

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.container} font-semibold ${style.bg} ${style.text} border-current border-opacity-20`}
      title={`Verified: ${author.name}`}
    >
      <span className="flex-shrink-0">{style.icon}</span>
      {showLabel && (
        <>
          <span className="hidden xs:inline">Verified</span>
          {author.articlesPublished && author.articlesPublished > 50 && (
            <span className="hidden sm:inline text-opacity-70">({author.articlesPublished}+)</span>
          )}
        </>
      )}
    </div>
  )
}
