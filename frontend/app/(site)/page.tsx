import { client } from '@/lib/sanity/client'
import { featuredArticleQuery, latestArticlesQuery, featuredFactCheckQuery, featuredOpinionsQuery, editorsPicksQuery } from '@/lib/sanity/queries'
import { ArticleCard } from '@/components/ArticleCard'
import { FactCheckCard } from '@/components/FactCheckCard'
import { OpinionCard } from '@/components/OpinionCard'
import { NewsletterStrip } from '@/components/NewsletterStrip'

export const revalidate = 60

export default async function HomePage() {
  const featured = await client.fetch<any>(featuredArticleQuery)
  const [latest, factCheck, opinions, editorsPicks] = await Promise.all([
    client.fetch<any[]>(latestArticlesQuery),
    client.fetch<any>(featuredFactCheckQuery),
    client.fetch<any[]>(featuredOpinionsQuery),
    client.fetch<any[]>(editorsPicksQuery),
  ])
  const topStories = latest.filter((a: any) => a._id !== featured?._id).slice(0, 4)
  return (
    <div>
      {/* Hero + Top Stories — BBC-style */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left: featured lead story — 2/3 width */}
          <div className="w-full lg:w-2/3 lg:border-r lg:border-line lg:pr-6">
            {featured && <ArticleCard article={featured} variant="hero" />}
          </div>
          {/* Right: top stories list — 1/3 width */}
          <div className="w-full lg:w-1/3 lg:pl-2">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">Top Stories</h2>
            <div className="space-y-4">
              {topStories.map((a: any) => (
                <ArticleCard key={a._id} article={a} variant="top" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-line" />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-6">Latest News</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latest.slice(5, 14).map((a: any) => <ArticleCard key={a._id} article={a} />)}
              </div>
            </div>
            {factCheck && (
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">Fact Check</h2>
                <FactCheckCard check={factCheck} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.slice(14, 23).map((a: any) => <ArticleCard key={a._id} article={a} />)}
            </div>
          </div>
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {opinions.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">Opinion & Analysis</h3>
                  <div className="space-y-1">
                    {opinions.slice(0, 4).map((op: any) => <OpinionCard key={op._id} opinion={op} />)}
                  </div>
                  <a href="/opinion" className="text-xs text-navy font-semibold hover:underline mt-3 inline-block">View all opinion →</a>
                </div>
              )}
              <NewsletterStrip variant="inline" />
              <div className="bg-paper border border-line rounded-lg h-60 flex items-center justify-center text-muted text-xs">Advertisement 300×250</div>
              {editorsPicks.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">Editor's Picks</h3>
                  <div className="space-y-4">
                    {editorsPicks.map((a: any) => <ArticleCard key={a._id} article={a} variant="editors" />)}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
      <NewsletterStrip variant="full" />
    </div>
  )
}