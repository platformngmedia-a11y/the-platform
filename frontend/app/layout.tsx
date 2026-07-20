import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { Analytics }      from '@vercel/analytics/next'
import { SiteHeader }     from '@/components/SiteHeader'
import { SiteFooter }     from '@/components/SiteFooter'
import { BreakingBanner } from '@/components/BreakingBanner'
import { MobileNavBar }   from '@/components/MobileNavBar'
import { DarkModeProvider } from '@/components/DarkModeProvider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { client }         from '@/lib/sanity/client'
import { VisualEditing }  from 'next-sanity/visual-editing'
import { draftMode }      from 'next/headers'
import { breakingNewsQuery, allCategoriesQuery } from '@/lib/sanity/queries'
import { organizationSchema } from '@/lib/schema'

const notoSans = Noto_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled

  const [breakingNews, categories] = await Promise.all([
    client.fetch(breakingNewsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(allCategoriesQuery, {}, { next: { revalidate: 3600 } }),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theplatformng.com'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema(siteUrl)),
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const pref = localStorage.getItem('theplatform_dark_mode') || 'system';
              const isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (isDark) document.documentElement.classList.add('dark');
            } catch (e) {}
          `,
        }} />
      </head>
      <body className={`${notoSans.variable} font-sans`}>
        <DarkModeProvider>
          {breakingNews.length > 0 && <BreakingBanner items={breakingNews} />}
          <SiteHeader categories={categories} />
          <main className="min-h-screen">{children}</main>
          <SiteFooter categories={categories} />
          <MobileNavBar />
          <ServiceWorkerRegistration />
          {isDraftMode && <VisualEditing />}
        </DarkModeProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}