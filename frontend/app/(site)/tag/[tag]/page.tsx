import { client }             from '@/lib/sanity/client'
import { articlesByTagQuery } from '@/lib/sanity/queries'
import { ArticleCard }        from '@/components/ArticleCard'

export const revalidate = 120

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)
  const articles = await client.fetch<any[]>(articlesByTagQuery, { tag })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border-b-4 border-navy pb-4 mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Topic</p>
        <h1 className="font-serif text-4xl font-black text-ink">#{tag}</h1>
        <p className="text-xs text-muted mt-2">{articles.length} articles</p>
      </div>

      {articles.length > 0
        ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a: any) => <ArticleCard key={a._id} article={a} />)}
          </div>
        ) : (
          <p className="text-center text-muted py-24">No articles found for this topic.</p>
        )
      }
    </div>
  )
}