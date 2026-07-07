import { sanityFetch } from '@/lib/sanity/live'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import { OptimizedImage } from '@/components/OptimizedImage'
import { ArticleCard } from '@/components/ArticleCard'
import { VerificationBadge } from '@/components/VerificationBadge'
import { ExpertiseTags } from '@/components/ExpertiseTags'
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
    title: `${author.name}${author.isVerifiedJournalist ? ' (Verified)' : ''} | The Platform`,
    description: author.bio || `Read articles by ${author.name} on The Platform. ${author.credibilityBadge ? `${author.credibilityBadge}.` : ''}`,
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
            <div className="flex items-start gap-3 mb-3">
              <h1 className="text-4xl font-bold text-ink">{author.name}</h1>
              {author.isVerifiedJournalist && (
                <div className="flex-shrink-0 mt-2">
                  <VerificationBadge author={author} size="lg" />
                </div>
              )}
            </div>

            {author.role && <p className="text-lg text-muted font-semibold mb-4">{author.role}</p>}

            {author.credibilityBadge && (
              <div className="mb-4 inline-block">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getBadgeStyle(
                    author.credibilityBadge
                  )}`}
                >
                  {getBadgeLabel(author.credibilityBadge)}
                </span>
              </div>
            )}

            {author.bio && (
              <p className="text-lg leading-relaxed text-ink mb-6 max-w-2xl">{author.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-line mb-6">
              <div>
                <p className="text-3xl font-bold text-navy">{articles.length}</p>
                <p className="text-sm text-muted">Articles Published</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-navy">{author.articlesPublished || 0}</p>
                <p className="text-sm text-muted">Total Count</p>
              </div>
              {author.expertise && author.expertise.length > 0 && (
                <div>
                  <p className="text-3xl font-bold text-navy">{author.expertise.length}</p>
                  <p className="text-sm text-muted">Areas of Expertise</p>
                </div>
              )}
            </div>

            {/* Expertise */}
            {author.expertise && author.expertise.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-ink mb-3">Expertise</h3>
                <ExpertiseTags expertise={author.expertise} />
              </div>
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

      {/* About Section */}
      <section className="mb-12 bg-paper rounded-lg p-8">
        <h2 className="text-2xl font-bold text-ink mb-4">About {author.name}</h2>
        <div className="max-w-3xl space-y-4 text-ink leading-relaxed">
          {author.bio && <p>{author.bio}</p>}
          {author.isVerifiedJournalist && (
            <p className="text-sm text-muted border-l-4 border-green-500 pl-4">
              ✓ <strong>Verified Journalist:</strong> This author has been verified as a professional
              journalist by The Platform editorial team.
            </p>
          )}
          <p className="text-sm text-muted border-l-4 border-navy/30 pl-4">
            Articles published on The Platform undergo rigorous editorial review and fact-checking. All
            sources are documented and available for review.
          </p>
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

function getBadgeStyle(badge: string): string {
  const styles: Record<string, string> = {
    verified: 'bg-green-100 text-green-700',
    senior: 'bg-blue-100 text-blue-700',
    contributor: 'bg-purple-100 text-purple-700',
    staff: 'bg-gray-100 text-gray-700',
  }
  return styles[badge] || 'bg-gray-100 text-gray-700'
}

function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    verified: '✓ Verified Journalist',
    senior: '★ Senior Editor',
    contributor: '★ Verified Contributor',
    staff: 'Staff Writer',
  }
  return labels[badge] || badge
}
