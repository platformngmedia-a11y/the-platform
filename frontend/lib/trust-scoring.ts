export interface TrustScore {
  score: number // 0-100
  level: 'Low' | 'Fair' | 'Good' | 'Excellent'
  signals: {
    authorCredibility: number
    sources: number
    depth: number
    editorial: number
    transparency: number
  }
  factors: string[]
}

export function calculateArticleTrustScore(article: any): TrustScore {
  let score = 30 // baseline trust

  const signals = {
    authorCredibility: 0,
    sources: 0,
    depth: 0,
    editorial: 0,
    transparency: 0,
  }

  const factors: string[] = []

  // Author Credibility (0-20 points)
  if (article.author) {
    signals.authorCredibility = getAuthorCredibilityScore(article.author)
    score += signals.authorCredibility
    if (article.author.isVerifiedJournalist) factors.push('Verified journalist')
    if (article.author.articlesPublished > 50) factors.push('Experienced writer (50+ articles)')
    if (article.author.expertise?.length > 0) factors.push(`Expertise in ${article.author.expertise[0]}`)
  }

  // Sources (0-20 points)
  if (article.sourcesUsed && article.sourcesUsed.length > 0) {
    const sourceCount = article.sourcesUsed.length
    if (sourceCount >= 5) {
      signals.sources = 20
      factors.push(`Well-sourced (${sourceCount} sources)`)
    } else if (sourceCount >= 3) {
      signals.sources = 15
      factors.push(`Multiple sources (${sourceCount})`)
    } else {
      signals.sources = 8
      factors.push(`Sources cited (${sourceCount})`)
    }
    score += signals.sources

    // Bonus for official/government sources
    const officialSources = article.sourcesUsed.filter(
      (s: any) => s.type === 'official' || s.type === 'government'
    ).length
    if (officialSources > 0) {
      score += Math.min(officialSources * 2, 5)
      factors.push('Official sources included')
    }
  }

  // Content Depth (0-15 points)
  if (article.wordCount) {
    if (article.wordCount >= 2000) {
      signals.depth = 15
      factors.push('In-depth investigation')
    } else if (article.wordCount >= 1000) {
      signals.depth = 10
      factors.push('Substantial reporting')
    } else if (article.wordCount >= 500) {
      signals.depth = 5
      factors.push('Well-developed story')
    }
    score += signals.depth
  }

  // Editorial Review (0-15 points)
  if (article.reviewedBy) {
    signals.editorial = 15
    score += signals.editorial
    factors.push(`Reviewed by ${article.reviewedBy.name}`)
  }

  // Transparency Signals (0-10 points)
  if (article.linkedFactChecks && article.linkedFactChecks.length > 0) {
    signals.transparency += 5
    score += 5
    factors.push('Related fact-checks available')
  }

  if (article.sourcesUsed && article.sourcesUsed.length > 0) {
    signals.transparency += 3
    score += 3
    factors.push('Sources transparently listed')
  }

  if (article.correctionsApplied && article.correctionsApplied.length > 0) {
    signals.transparency += 2
    score += 2
    factors.push('Correction history visible')
  }

  // Penalties
  if (article.correctionsApplied && article.correctionsApplied.length > 1) {
    // Multiple corrections indicate quality issues
    const penalty = Math.min(article.correctionsApplied.length - 1, 10)
    score -= penalty
  }

  // Determine level
  let level: 'Low' | 'Fair' | 'Good' | 'Excellent'
  if (score >= 75) {
    level = 'Excellent'
  } else if (score >= 60) {
    level = 'Good'
  } else if (score >= 45) {
    level = 'Fair'
  } else {
    level = 'Low'
  }

  // Cap score at 100
  score = Math.min(Math.max(score, 0), 100)

  return { score, level, signals, factors }
}

function getAuthorCredibilityScore(author: any): number {
  if (!author) return 0

  let score = 3 // base score

  // Badge bonus
  const badgeScores: Record<string, number> = {
    verified: 12,
    senior: 10,
    contributor: 7,
    staff: 5,
  }

  if (author.credibilityBadge) {
    score = Math.max(score, badgeScores[author.credibilityBadge] || 5)
  }

  // Experience bonus
  if (author.articlesPublished) {
    const experienceBonus = Math.min(Math.floor(author.articlesPublished / 25), 8)
    score += experienceBonus
  }

  // Expertise bonus
  if (author.expertise && author.expertise.length > 0) {
    score += 2
  }

  return Math.min(score, 20)
}

export function getTrustMeterColor(level: 'Low' | 'Fair' | 'Good' | 'Excellent'): string {
  const colors: Record<string, string> = {
    Low: 'bg-red-100 text-red-700',
    Fair: 'bg-amber-100 text-amber-700',
    Good: 'bg-blue-100 text-blue-700',
    Excellent: 'bg-green-100 text-green-700',
  }
  return colors[level]
}

export function getTrustMeterWidth(score: number): string {
  return `${Math.min(score, 100)}%`
}
