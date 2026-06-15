import { sanityFetch } from '@/lib/sanity/live'
import { articleBySlugQuery, latestArticlesQuery, featuredFactCheckQuery } from '@/lib/sanity/queries'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import { ArticleCard } from '@/components/ArticleCard'
import { TagBadge } from '@/components/TagBadge'
import { NewsletterStrip } from '@/components/NewsletterStrip'
import { CommentsSection } from '@/components/CommentsSection'
import { FactCheckCard } from '@/components/FactCheckCard'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, AlertTriangle } from 'lucide-react'
import { CopyLinkButton } from '@/components/CopyLinkButton'
import { newsArticleSchema } from '@/lib/schema'
import { AuthorBadge } from '@/components/AuthorBadge'
import { DepthBadge } from '@/components/DepthBadge'


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await sanityFetch({ query: articleBySlugQuery, params: { slug } })
  if (!article) return {}
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.mainImage ? [urlForImage(article.mainImage).width(1200).height(630).url()] : [],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt },
  }
}

const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <figure className="my-8">
        <Image src={urlForImage(value).width(800).url()} alt={value.alt || ''} width={800} height={500} className="w-full rounded-lg" />
        {value.caption && <figcaption className="text-center text-xs text-muted mt-2 italic">{value.caption}</figcaption>}
      </figure>
    ),
    callout: ({ value }: any) => {
      const styles: Record<string, string> = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        quote: 'bg-navy/5 border-navy/20 text-ink',
      }
      return <div className={`border-l-4 p-4 my-6 rounded-r-lg text-sm leading-relaxed ${styles[value.type] ?? styles.info}`}>{value.text}</div>
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="font-serif text-2xl font-bold text-ink mt-10 mb-4 border-b border-line pb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-xl font-bold text-ink mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-gold pl-5 italic text-muted my-8 text-lg font-serif leading-relaxed">{children}</blockquote>,
    normal: ({ children }: any) => <p className="text-ink text-[18px] leading-[1.75] mb-6">{children}</p>,
  },
  marks: {
    link: ({ children, value }: any) => <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:text-navy-dark">{children}</a>,
  },
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: article }, { data: latest }, { data: factCheck }] = await Promise.all([
    sanityFetch({ query: articleBySlugQuery, params: { slug } }),
    sanityFetch({ query: latestArticlesQuery }),
    sanityFetch({ query: featuredFactCheckQuery }),
  ])
  if (!article) notFound()
  const related = (latest as any[]).filter((a: any) => a._id !== article._id).slice(0, 4)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const articleUrl = `${siteUrl}/article/${article.slug.current}`
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleSchema(article, siteUrl)),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2">
          <nav className="flex items-center gap-2 text-xs text-muted mb-4">
            <a href="/" className="hover:text-navy">Home</a>
            <span>/</span>
            {article.categories?.[0] && (
              <>
                <a href={`/category/${article.categories[0].slug.current}`} className="hover:text-navy">{article.categories[0].title}</a>
                <span>/</span>
              </>
            )}
            <span className="text-ink truncate max-w-xs">{article.title}</span>
          </nav>
          {article.isBreaking && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-4 text-sm font-semibold">
              <AlertTriangle size={16} />
              This is a developing story. We will update as more details emerge.
            </div>
          )}
          <h1 className="text-[1.75rem] md:text-[2.2rem] font-bold text-ink leading-[1.2] tracking-[-0.01em] mb-3 hover:text-[#1d70b8] transition-colors duration-200 cursor-default">{article.title}</h1>
          {article.excerpt && <p className="text-[1.1rem] text-ink leading-[1.55] mb-6 font-normal border-l-4 border-navy pl-4">{article.excerpt}</p>}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-line mb-6">
            <div className="flex-1">
              {article.author?.name && (
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-ink">By {article.author.name}</p>
                  {article.author && <AuthorBadge author={article.author} />}
                </div>
              )}
              {article.author?.expertise && article.author.expertise.length > 0 && (
                <p className="text-xs text-muted mb-1">
                  Expertise: {article.author.expertise.join(', ')}
                </p>
              )}
              {article.author?.role && <p className="text-xs text-muted">{article.author.role}</p>}
              <div className="flex items-center gap-3 text-xs text-muted mt-0.5 flex-wrap">
                {article.publishedAt && <time dateTime={article.publishedAt}>{format(new Date(article.publishedAt), "d MMMM yyyy, h:mm a")}</time>}
                {article.updatedAt && article.updatedAt !== article.publishedAt && (
                  <>
                    <span className="text-border">·</span>
                    <span>Updated {format(new Date(article.updatedAt), "d MMMM yyyy, h:mm a")}</span>
                  </>
                )}
                {article.readingTime && (
                  <>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{article.readingTime} min read</span>
                  </>
                )}
                {article.wordCount && (
                  <>
                    <span className="text-border">·</span>
                    <span>{article.wordCount} words</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Share:</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded border border-line hover:bg-paper transition-colors text-muted hover:text-ink text-xs font-bold">X</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded border border-line hover:bg-paper transition-colors text-muted hover:text-ink text-xs font-bold">f</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + articleUrl)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded border border-line hover:bg-paper transition-colors text-muted hover:text-ink text-xs font-bold">W</a>
            <CopyLinkButton url={articleUrl} /> 
            </div>
          </div>
          {article.mainImage && (
            <div className="mb-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image src={urlForImage(article.mainImage).width(840).height(472).url()} alt={article.mainImage?.alt ?? article.title} fill className="object-cover" priority />
              </div>
              {article.mainImage?.alt && <p className="text-xs text-muted mt-2 text-center italic">{article.mainImage.alt}</p>}
            </div>
          )}
          <div className="article-body font-prose">
            <PortableText value={article.body} components={ptComponents} />
          </div>
          {article.wordCount && (
            <div className="mt-8 pt-6 border-t border-line">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-ink">Content Depth:</h3>
                <DepthBadge article={article} />
              </div>
            </div>
          )}
          {article.sourcesUsed?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <h3 className="text-sm font-bold text-ink mb-3">Sources & References</h3>
              <ul className="space-y-2.5 text-xs">
                {article.sourcesUsed.map((source: any, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 text-muted">•</span>
                    <span>
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-navy underline hover:text-navy-dark">
                          {source.name}
                        </a>
                      ) : (
                        source.name
                      )}
                      {source.type && <span className="text-muted"> ({source.type})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {article.correctionsApplied?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <h3 className="text-sm font-bold text-ink mb-3">Corrections & Updates</h3>
              <ul className="space-y-3 text-xs">
                {article.correctionsApplied.map((correction: any, i: number) => (
                  <li key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-900 font-medium mb-1">{format(new Date(correction.date), 'd MMMM yyyy, h:mm a')}</p>
                    <p className="text-amber-800">{correction.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {article.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">Topics</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>
          )}
          <NewsletterStrip variant="compact" />
          <div className="bg-paper border border-line rounded-lg p-4 mt-6 text-xs text-muted leading-relaxed">
            <strong className="text-ink">Editorial standards:</strong> The Platform is committed to accuracy, fairness and independence. If you spot an error in this report, please <a href="/contact" className="text-navy underline">contact our corrections desk</a>.
          </div>
          <CommentsSection articleId={article._id} />
        </article>
        <aside className="space-y-8">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-base font-extrabold text-ink border-b-2 border-ink pb-2 mb-4">Related Stories</h3>
              <div className="space-y-5">
                {related.map((a: any) => <ArticleCard key={a._id} article={a} variant="horizontal" />)}
              </div>
            </div>
            {factCheck && <FactCheckCard check={factCheck} compact />}
            <div className="bg-paper border border-line rounded-lg h-60 flex items-center justify-center text-muted text-xs">Advertisement 300x250</div>
          </div>
        </aside>
      </div>
      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-lg font-extrabold text-ink border-b-2 border-ink pb-2 mb-6 inline-block">More from The Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((a: any) => <ArticleCard key={a._id} article={a} />)}
        </div>
      </section>
      </div>
    </>
  )
}