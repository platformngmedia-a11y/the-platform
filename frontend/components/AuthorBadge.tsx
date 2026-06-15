export function AuthorBadge({ author }: { author: any }) {
  if (!author?.credibilityBadge) return null

  const badgeConfig: Record<string, { icon: string; label: string; style: string }> = {
    verified: {
      icon: '✓',
      label: 'Verified Journalist',
      style: 'bg-green-50 text-green-700 border border-green-200',
    },
    senior: {
      icon: '★',
      label: 'Senior Editor',
      style: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    contributor: {
      icon: '★',
      label: 'Verified Contributor',
      style: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    staff: {
      icon: '○',
      label: 'Staff Writer',
      style: 'bg-gray-50 text-gray-700 border border-gray-200',
    },
  }

  const config = badgeConfig[author.credibilityBadge]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.style}`}
      title={config.label}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
