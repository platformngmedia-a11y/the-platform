import { client } from '@/lib/sanity/client'
import { articlesByCategoryQuery, allCategoriesQuery } from '@/lib/sanity/queries'
import { ArticleCard } from '@/components/ArticleCard'
import { CategoryFilterClient } from '@/components/CategoryFilterClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 120

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cats = await client.fetch(allCategoriesQuery)
  const cat = cats.find((c: any) => c.slug.current === slug)
  return { title: cat?.title ?? 'Category', description: cat?.description }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [articles, categories] = await Promise.all([
    client.fetch(articlesByCategoryQuery, { slug }),
    client.fetch(allCategoriesQuery),
  ])
  const category = categories.find((c: any) => c.slug.current === slug)
  if (!category) notFound()
  const heroArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border-b-4 border-navy pb-4 mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Section</p>
        <h1 className="font-serif text-4xl font-black text-ink">{category.title}</h1>
        {category.description && <p className="text-muted mt-2 max-w-xl leading-relaxed">{category.description}</p>}
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <span className="inline-block w-1 h-1 bg-navy rounded-full"></span>
          <span>{articles.length} articles</span>
        </div>
      </div>

      {heroArticle && (
        <div className="mb-10 pb-10 border-b border-line">
          <ArticleCard article={heroArticle} variant="hero" />
        </div>
      )}

      {/* Filtered Articles Grid with Sidebar */}
      {otherArticles.length > 0 && (
        <CategoryFilterClient articles={otherArticles} categorySlug={slug} />
      )}

      {articles.length === 0 && <p className="text-center text-muted py-24">No stories in this section yet. Check back soon.</p>}
    </div>
  )
}