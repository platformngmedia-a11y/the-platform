export function newsArticleSchema(article: any, siteUrl: string) {
  const baseUrl = siteUrl || 'https://theplatformng.com'
  const imageUrl = article.mainImage?.asset?.url
  const articleUrl = article.slug?.current
    ? `${baseUrl}/article/${article.slug.current}`
    : baseUrl
  const authorUrl = article.author?.slug?.current
    ? `${baseUrl}/author/${article.author.slug.current}`
    : undefined

  const sources = article.sourcesUsed?.map((s: any) => ({
    '@type': 'WebSite',
    name: s.name,
    url: s.url,
  })) || []

  return {
    '@context': 'https://schema.org',
    '@type': article.contentType === 'analysis' ? 'AnalysisNewsArticle' : 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
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
          ...(authorUrl && { url: authorUrl }),
          ...(article.author.role && { jobTitle: article.author.role }),
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
      '@type': 'NewsMediaOrganization',
      '@id': `${baseUrl}/#organization`,
      name: 'The Platform',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    sourceOrganization: sources.length > 0 ? sources : undefined,
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
  const baseUrl = siteUrl || 'https://theplatformng.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${baseUrl}/#organization`,
    name: 'The Platform',
    alternateName: ['The Platform News NG', 'The Platform Media Ltd'],
    slogan: 'Dependable. True. Engaging.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "The Platform (theplatformng.com) is Nigeria's home of dependable, fact-checked journalism covering politics, economy, society, and world affairs.",
    disambiguatingDescription:
      'Independent Nigerian digital news and journalism publication operated by The Platform Media Ltd (theplatformng.com), distinct from the biannual national conference The Platform Nigeria (theplatformnigeria.com).',
    foundingDate: '2023',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61589626771382',
      'https://www.instagram.com/the_platform26/',
      'https://x.com/The_platform01',
    ],
    publishingPrinciples: `${baseUrl}/about#standards`,
    correctionsPolicy: `${baseUrl}/about#corrections`,
    ethicsPolicy: `${baseUrl}/about#standards`,
    masthead: `${baseUrl}/about#masthead`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Editorial & News Tips',
        email: 'tips@theplatformng.com',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Corrections Desk',
        email: 'corrections@theplatformng.com',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'General & Advertising Inquiries',
        email: 'hello@theplatformng.com',
      },
    ],
  }
}

export function personSchema(author: any, siteUrl: string) {
  const baseUrl = siteUrl || 'https://theplatformng.com'
  const slug = author.slug?.current || author.slug
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.role && { jobTitle: author.role }),
    ...(author.bio && { description: author.bio }),
    ...(author.email && { email: author.email }),
    ...(slug && { url: `${baseUrl}/author/${slug}` }),
    ...(author.expertise?.length > 0 && { knowsAbout: author.expertise }),
    worksFor: {
      '@type': 'NewsMediaOrganization',
      '@id': `${baseUrl}/#organization`,
      name: 'The Platform',
      url: baseUrl,
    },
  }
}

export function claimReviewSchema(factCheck: any, siteUrl: string) {
  const baseUrl = siteUrl || 'https://theplatformng.com'
  const rawVerdict = factCheck.verdict || factCheck.rating || 'unverifiable'
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    claimReviewed: factCheck.claim,
    url: factCheck.slug?.current
      ? `${baseUrl}/fact-check/${factCheck.slug.current}`
      : `${baseUrl}/fact-check`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: mapRatingToValue(rawVerdict),
      bestRating: '5',
      worstRating: '1',
      alternateName: rawVerdict,
    },
    ...(factCheck.claimant && {
      itemReviewed: {
        '@type': 'Claim',
        author: {
          '@type': 'Person',
          name: factCheck.claimant,
        },
      },
    }),
    author: {
      '@type': 'NewsMediaOrganization',
      '@id': `${baseUrl}/#organization`,
      name: 'The Platform',
      url: baseUrl,
    },
    datePublished: factCheck.publishedAt,
  }
}

function mapRatingToValue(rating: string): string {
  const ratingMap: Record<string, string> = {
    'True': '5',
    'true': '5',
    'Mostly True': '4',
    'partly-true': '3',
    'Partly True': '3',
    'Mixed': '3',
    'misleading': '2',
    'Misleading': '2',
    'Mostly False': '2',
    'False': '1',
    'false': '1',
    'unverifiable': '3',
  }
  return ratingMap[rating] || '3'
}
