export interface DepthScore {
  score: number // 1-100
  level: 'Light' | 'Standard' | 'Deep' | 'Investigative'
  reasoning: string
  indicators: {
    wordCount: number
    sources: number
    images: number
    authorCredibility: number
    contentType: string
  }
}

export function calculateArticleDepth(article: any): DepthScore {
  let score = 0
  const indicators = {
    wordCount: article.wordCount || 0,
    sources: article.sourcesUsed?.length || 0,
    images: countImages(article.body),
    authorCredibility: getAuthorCredibilityScore(article.author),
    contentType: article.contentType || 'news',
  }

  // Word count scoring (0-25 points)
  // Light: < 500, Standard: 500-1000, Deep: 1000-2000, Investigative: 2000+
  if (indicators.wordCount < 500) {
    score += 5
  } else if (indicators.wordCount < 1000) {
    score += 15
  } else if (indicators.wordCount < 2000) {
    score += 22
  } else {
    score += 25
  }

  // Sources scoring (0-30 points)
  // 1-2 sources: 5pts, 3-5: 15pts, 6-10: 25pts, 10+: 30pts
  if (indicators.sources >= 1 && indicators.sources <= 2) {
    score += 5
  } else if (indicators.sources >= 3 && indicators.sources <= 5) {
    score += 15
  } else if (indicators.sources >= 6 && indicators.sources <= 10) {
    score += 25
  } else if (indicators.sources > 10) {
    score += 30
  }

  // Images/multimedia scoring (0-15 points)
  // 1-2 images: 5pts, 3-5: 10pts, 6+: 15pts
  if (indicators.images >= 1 && indicators.images <= 2) {
    score += 5
  } else if (indicators.images >= 3 && indicators.images <= 5) {
    score += 10
  } else if (indicators.images > 5) {
    score += 15
  }

  // Author credibility scoring (0-20 points)
  score += indicators.authorCredibility

  // Content type bonus (0-10 points)
  const contentTypeScores: Record<string, number> = {
    investigation: 10,
    analysis: 8,
    explainer: 7,
    news: 3,
  }
  score += contentTypeScores[indicators.contentType] || 3

  // Determine level
  let level: 'Light' | 'Standard' | 'Deep' | 'Investigative'
  let reasoning = ''

  if (score >= 80) {
    level = 'Investigative'
    reasoning = `Thorough investigation with ${indicators.sources} sources, ${indicators.wordCount} words, and deep author expertise`
  } else if (score >= 60) {
    level = 'Deep'
    reasoning = `In-depth analysis with ${indicators.sources} sources and ${indicators.wordCount} words`
  } else if (score >= 40) {
    level = 'Standard'
    reasoning = `Well-reported news with ${indicators.sources} sources`
  } else {
    level = 'Light'
    reasoning = 'Brief news update'
  }

  return { score, level, reasoning, indicators }
}

function countImages(bodyArray: any[]): number {
  if (!bodyArray) return 0
  return bodyArray.filter(block => block._type === 'image').length
}

function getAuthorCredibilityScore(author: any): number {
  if (!author) return 0

  let score = 5 // base score for any author

  // Badge bonuses
  const badgeScores: Record<string, number> = {
    verified: 20,
    senior: 18,
    contributor: 10,
    staff: 8,
  }

  if (author.credibilityBadge) {
    score = Math.max(score, badgeScores[author.credibilityBadge] || 5)
  }

  // Articles published bonus (every 10 articles = 2 points, max 5)
  if (author.articlesPublished) {
    const publishBonus = Math.min(Math.floor(author.articlesPublished / 10) * 2, 5)
    score += publishBonus
  }

  return Math.min(score, 20) // cap at 20
}

export function getDepthBadgeColor(
  level: 'Light' | 'Standard' | 'Deep' | 'Investigative'
): string {
  const colors: Record<string, string> = {
    Light: 'bg-gray-100 text-gray-700',
    Standard: 'bg-blue-100 text-blue-700',
    Deep: 'bg-purple-100 text-purple-700',
    Investigative: 'bg-red-100 text-red-700',
  }
  return colors[level]
}
