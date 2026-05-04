export function TagBadge({ tag }: { tag: string }) {
  return (
    <a href={`/tag/${encodeURIComponent(tag)}`} className="inline-block text-xs text-navy/70 border border-navy/20 px-3 py-1 rounded-full hover:bg-navy hover:text-white hover:border-navy transition-colors">
      #{tag}
    </a>
  )
}