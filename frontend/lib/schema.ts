export function newsArticleSchema(article: any, siteUrl: string) {
  const imageUrl = article.mainImage?.asset?.url
  const sources = article.sourcesUsed?.map((s: any) => ({
    '@type': 'WebSite',
    name: s.name,
    url: s.url,
  })) || []

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    wordCount: article.wordCount,
    articleBody: article.body?.map((b: any) => b.children?.map((c: any) => c.text).join(' ')).join('\n') || '',
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
          ...(article.author.credibilityBadge && { credential: mapCredibilityBadge(article.author.credibilityBadge) }),
        }
      : undefined,
    editor: article.reviewedBy
      ? {
          '@type': 'Person',
          name: article.reviewedBy.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'The Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    sourceOrganization: sources.length > 0 ? sources : undefined,
    mainEntity: {
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      image: imageUrl,
      datePublished: article.publishedAt,
      author: article.author
        ? {
            '@type': 'Person',
            name: article.author.name,
          }
        : undefined,
    },
  }
}

function mapCredibilityBadge(badge: string): string {
  const mapping: Record<string, string> = {
    verified: 'Verified Journalist',
    senior: 'Senior Editor',
    contributor: 'Verified Contributor',
    staff: 'Staff Writer',
  }
  return mapping[badge] || 'Journalist'
}

export function organizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Platform',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Nigeria\'s home of dependable, factual journalism.',
    foundingDate: '2023',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Editorial',
      email: 'tips@theplatformng.com',
    },
  }
}

export function claimReviewSchema(factCheck: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    claimReviewed: factCheck.claim,
    url: `${siteUrl}/fact-check/${factCheck.slug.current}`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: mapRatingToValue(factCheck.rating),
      bestRating: '5',
      worstRating: '1',
    },
    reviewedBy: {
      '@type': 'Organization',
      name: 'The Platform',
    },
    datePublished: factCheck.publishedAt,
  }
}

function mapRatingToValue(rating: string): string {
  const ratingMap: Record<string, string> = {
    'True': '5',
    'Mostly True': '4',
    'Mixed': '3',
    'Mostly False': '2',
    'False': '1',
  }
  return ratingMap[rating] || '3'
}
