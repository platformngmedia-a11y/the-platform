import { sanityFetch } from '@/lib/sanity/live'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import { OptimizedImage } from '@/components/OptimizedImage'
import { ArticleCard } from '@/components/ArticleCard'
import { Mail, X } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id, name, slug, bio, image, role, email, twitter,
    credibilityBadge, isVerifiedJournalist, expertise, articlesPublished
  }
`

const authorArticlesQuery = groq`
  *[_type == "article" && author->slug.current == $slug]
  | order(publishedAt desc)[0...12] {
    _id, title, slug, excerpt, publishedAt, readingTime,
    "author": author->{ name, credibilityBadge },
    "mainImage": mainImage { asset->, alt },
    "categories": categories[]->{ title, slug }
  }
`

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = await client.fetch<any>(authorBySlugQuery, { slug })

  if (!author) return {}

  return {
    title: `${author.name} | The Platform`,
    description: author.bio || `Read articles by ${author.name} on The Platform.`,
    openGraph: {
      title: author.name,
      description: author.bio,
      images: author.image ? [urlForImage(author.image).width(400).height(400).url()] : [],
      type: 'profile',
    },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [author, articles] = await Promise.all([
    client.fetch<any>(authorBySlugQuery, { slug }),
    client.fetch<any[]>(authorArticlesQuery, { slug }),
  ])

  if (!author) notFound()

  const imageUrl = author.image ? urlForImage(author.image).width(400).height(400).url() : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Author Image */}
          {author.image && (
            <div className="md:col-span-1">
              <div className="relative w-full max-w-xs mx-auto">
                <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                  <OptimizedImage
                    src={author.image}
                    alt={author.name}
                    width={400}
                    height={400}
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className={author.image ? 'md:col-span-2' : 'md:col-span-3'}>
            <h1 className="text-4xl font-bold text-ink mb-3">{author.name}</h1>

            {author.role && <p className="text-lg text-muted font-semibold mb-4">{author.role}</p>}

            {author.bio && (
              <p className="text-lg leading-relaxed text-ink mb-6 max-w-2xl">{author.bio}</p>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors"
                >
                  <Mail size={16} />
                  Contact
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper border border-line text-ink rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  <X size={16} />
                  X (Twitter)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      {articles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6 border-b-2 border-ink pb-2 inline-block">
            Recent Articles by {author.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <section className="text-center py-12">
          <p className="text-muted text-lg">No articles published yet.</p>
        </section>
      )}
    </div>
  )
}


