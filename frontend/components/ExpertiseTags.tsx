interface Props {
  expertise: string[]
  clickable?: boolean
  onTagClick?: (tag: string) => void
}

export function ExpertiseTags({ expertise, clickable = false, onTagClick }: Props) {
  if (!expertise || expertise.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {expertise.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          disabled={!clickable}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            clickable
              ? 'bg-navy/10 text-navy hover:bg-navy/20 cursor-pointer'
              : 'bg-navy/5 text-navy/70 cursor-default'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
