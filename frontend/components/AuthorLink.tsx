import { VerificationBadge } from './VerificationBadge'

interface Props {
  author: any
  showBadge?: boolean
  showRole?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AuthorLink({ author, showBadge = true, showRole = false, size = 'md' }: Props) {
  if (!author?.slug) return <span>{author?.name}</span>

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className="flex items-center gap-2">
      <a href={`/author/${author.slug.current}`} className={`font-semibold text-navy hover:underline ${sizeClasses[size]}`}>
        {author.name}
      </a>
      {showBadge && author.isVerifiedJournalist && <VerificationBadge author={author} size="sm" showLabel={false} />}
      {showRole && author.role && <span className="text-xs text-muted">({author.role})</span>}
    </div>
  )
}
