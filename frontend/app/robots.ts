import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theplatformng.com'
  const isProduction =
    process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_ENV

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/reading-list', '/offline'],
      },
    ],
    host: siteUrl,
  }
}
