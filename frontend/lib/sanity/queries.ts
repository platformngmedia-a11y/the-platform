import { groq } from 'next-sanity'

export const articleFields = groq`
  _id, title, slug, excerpt, publishedAt, updatedAt, readingTime, wordCount, contentType,
  isBreaking, isFeatured, isEditorsPick, tags,
  "author": author->{ name, slug, image, role, credibilityBadge, articlesPublished, isVerifiedJournalist, expertise },
  "reviewedBy": reviewedBy->{ name, role },
  "categories": categories[]->{ title, slug },
  "mainImage": mainImage { asset->, alt },
  "sourcesUsed": sourcesUsed[] { name, url, type },
  "correctionsApplied": correctionsApplied[] { date, description }
`

export const featuredArticleQuery = groq`
  *[_type == "article" && isFeatured == true] | order(publishedAt desc)[0] {
    ${articleFields}
  }
`

export const breakingNewsQuery = groq`
  *[_type == "article" && isBreaking == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, publishedAt
  }
`

export const topStoriesQuery = groq`
  *[_type == "article" && _id != $excludeId] | order(publishedAt desc)[0...5] {
    ${articleFields}
  }
`

export const latestArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc)[0...24] {
    ${articleFields}
  }
`

export const editorsPicksQuery = groq`
  *[_type == "article" && isEditorsPick == true] | order(publishedAt desc)[0...4] {
    ${articleFields}
  }
`

export const featuredFactCheckQuery = groq`
  *[_type == "factCheck" && isFeatured == true] | order(publishedAt desc)[0] {
    _id, claim, slug, claimant, verdict, summary, publishedAt,
    "checkedBy": checkedBy->{ name }
  }
`

export const allFactChecksQuery = groq`
  *[_type == "factCheck"] | order(publishedAt desc) {
    _id, claim, slug, claimant, verdict, summary, publishedAt,
    "checkedBy": checkedBy->{ name }
  }
`

export const featuredOpinionsQuery = groq`
  *[_type == "opinion"] | order(publishedAt desc)[0...6] {
    _id, title, slug, excerpt, publishedAt,
    "author": author->{ name, role, image },
    "mainImage": mainImage { asset->, alt }
  }
`

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id, title, slug, description
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${articleFields}, body, seoTitle, seoDescription
  }
`

export const articlesByCategoryQuery = groq`
  *[_type == "article" && $slug in categories[]->slug.current]
  | order(publishedAt desc) { ${articleFields} }
`

export const articlesByTagQuery = groq`
  *[_type == "article" && $tag in tags]
  | order(publishedAt desc)[0...20] { ${articleFields} }
`

export const factCheckBySlugQuery = groq`
  *[_type == "factCheck" && slug.current == $slug][0] {
    _id, claim, claimant, claimedOn, verdict, summary, body, sources, publishedAt,
    "checkedBy": checkedBy->{ name, role, image }
  }
`

export const opinionBySlugQuery = groq`
  *[_type == "opinion" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, publishedAt,
    "author": author->{ name, role, bio, image, twitter },
    "mainImage": mainImage { asset->, alt },
    "categories": categories[]->{ title, slug }
  }
`