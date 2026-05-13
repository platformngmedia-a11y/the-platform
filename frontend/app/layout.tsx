import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { SiteHeader }     from '@/components/SiteHeader'
import { SiteFooter }     from '@/components/SiteFooter'
import { BreakingBanner } from '@/components/BreakingBanner'
import { client }         from '@/lib/sanity/client'
import { VisualEditing }  from 'next-sanity/visual-editing'
import { draftMode }      from 'next/headers'
import { breakingNewsQuery, allCategoriesQuery } from '@/lib/sanity/queries'

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets:  ['latin'],
  weight:   '400',
  variable: '--font-serif',
})

const sourceSerif4 = Source_Serif_4({
  subsets:  ['latin'],
  weight:   ['300', '400', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-prose',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME    ?? 'The Platform'
const tagline  = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Dependable. True. Engaging.'

export const metadata: Metadata = {
  title: {
    default:  `${siteName} — ${tagline}`,
    template: `%s | ${siteName}`,
  },
  description: `${siteName}: Nigeria's home of dependable, factual journalism that helps you make informed decisions.`,
  openGraph: { type: 'website', locale: 'en_NG', siteName },
  twitter:   { card: 'summary_large_image' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled

  const [breakingNews, categories] = await Promise.all([
    client.fetch(breakingNewsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(allCategoriesQuery, {}, { next: { revalidate: 3600 } }),
  ])

  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable} ${sourceSerif4.variable} font-sans`}>
        {breakingNews.length > 0 && <BreakingBanner items={breakingNews} />}
        <SiteHeader categories={categories} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter categories={categories} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}