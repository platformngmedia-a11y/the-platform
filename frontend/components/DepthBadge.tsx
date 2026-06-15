import { calculateArticleDepth, getDepthBadgeColor } from '@/lib/depth-scoring'

export function DepthBadge({ article }: { article: any }) {
  const depth = calculateArticleDepth(article)

  const icons: Record<string, string> = {
    Light: '📰',
    Standard: '📊',
    Deep: '📚',
    Investigative: '🔍',
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getDepthBadgeColor(depth.level)}`}
      title={depth.reasoning}
    >
      <span>{icons[depth.level]}</span>
      <span>{depth.level}</span>
      <span className="text-[10px] opacity-75">({depth.score})</span>
    </div>
  )
}
