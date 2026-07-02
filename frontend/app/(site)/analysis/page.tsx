import { client } from '@/lib/sanity/client'
import { analysisArticlesQuery } from '@/lib/sanity/queries'
import { ArticleCard } from '@/components/ArticleCard'
import { NewsletterStrip } from '@/components/NewsletterStrip'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News Analysis | The Platform',
  description:
    'In-depth analysis of the biggest stories in Nigeria and beyond — context, synthesis and perspective from The Platform editorial team.',
}

export default async function AnalysisPage() {
  const articles = await client.fetch<any[]>(analysisArticlesQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8 border-b-2 border-ink pb-4">
        <h1 className="text-3xl font-extrabold text-ink mb-2">News Analysis</h1>
        <p className="text-muted max-w-2xl">
          Going beyond the headlines. Our editorial team synthesises reporting from multiple online sources,
          official statements and public data to explain what the news means for Nigeria.
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a: any) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted">
          <p className="text-lg font-semibold mb-2">Analysis pieces are coming soon.</p>
          <p className="text-sm">
            Check back shortly, or explore the <a href="/" className="text-navy underline">latest news</a>.
          </p>
        </div>
      )}

      <div className="mt-12">
        <NewsletterStrip variant="full" />
      </div>
    </div>
  )
}
