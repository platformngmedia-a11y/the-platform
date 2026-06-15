import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import { formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'
import { DepthBadge } from './DepthBadge'

type Variant = 'hero' | 'top' | 'grid' | 'horizontal' | 'minimal' | 'editors'
interface Props { article: any; variant?: Variant }


function CategoryPill({ cat }: { cat: any }) {
  const colorMap: Record<string, string> = {
    Politics:   'text-blue-700',
    Economy:    'text-amber-700',
    Nigeria:    'text-green-700',
    World:      'text-purple-700',
    Health:     'text-teal-700',
    Sport:      'text-orange-700',
    Technology: 'text-sky-700',
    Opinion:    'text-gray-600',
  }
  const color = colorMap[cat?.title] ?? 'text-navy'
  return (
    <span className={`inline-block text-[11px] font-bold uppercase tracking-wide ${color}`}>
      {cat?.title}
    </span>
  )
}

function Meta({ article }: { article: any }) {
  const ago = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : ''
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-1.5">
      {article.author?.name && (
        <span className="font-medium text-ink/70">{article.author.name}</span>
      )}
      {article.author?.name && <span className="text-border">·</span>}
      <span>{ago}</span>
      {article.readingTime && (
        <>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />{article.readingTime} min
          </span>
        </>
      )}
    </div>
  )
}

export function ArticleCard({ article, variant = 'grid' }: Props) {
  const imageUrl = article.mainImage
    ? urlForImage(article.mainImage).width(900).height(560).url()
    : null
  const cat  = article.categories?.[0]
  const href = `/article/${article.slug.current}`

  /* hero */
  if (variant === 'hero') {
    return (
      <article className="group">
        {imageUrl && (
          <a href={href} className="block w-full aspect-[16/7] overflow-hidden bg-paper relative mb-3">
            <Image
              src={imageUrl} alt={article.mainImage?.alt ?? article.title} fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </a>
        )}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {article.isBreaking && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Breaking</span>
          )}
          {cat && <CategoryPill cat={cat} />}
          {article.wordCount && <DepthBadge article={article} />}
        </div>
        <a href={href}>
          <h1 className="text-xl font-extrabold text-ink leading-[1.2] group-hover:text-[#1d70b8] transition-colors mb-1.5">
            {article.title}
          </h1>
        </a>
        {article.excerpt && (
          <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-1.5">{article.excerpt}</p>
        )}
        <Meta article={article} />
      </article>
    )
  }

  /* top */
  if (variant === 'top') {
    return (
      <article className="group flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
        {imageUrl && (
          <a href={href} className="shrink-0 w-20 h-16 overflow-hidden bg-paper relative">
            <Image
              src={urlForImage(article.mainImage).width(160).height(128).url()}
              alt={article.mainImage?.alt ?? article.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        )}
        <div className="flex-1 min-w-0">
          {cat && <CategoryPill cat={cat} />}
          <a href={href}>
            <h3 className="text-sm font-bold text-ink group-hover:text-[#1d70b8] transition-colors line-clamp-2 mt-1 leading-[1.3]">
              {article.title}
            </h3>
          </a>
          <Meta article={article} />
        </div>
      </article>
    )
  }

  /* horizontal */
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-3 items-start">
        {imageUrl && (
          <a href={href} className="shrink-0 w-28 h-20 overflow-hidden bg-paper relative">
            <Image
              src={urlForImage(article.mainImage).width(224).height(160).url()}
              alt={article.mainImage?.alt ?? article.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        )}
        <div>
          {cat && <CategoryPill cat={cat} />}
          <a href={href}>
            <h3 className="text-sm font-bold text-ink group-hover:text-[#1d70b8] transition-colors line-clamp-2 mt-1 leading-[1.3]">
              {article.title}
            </h3>
          </a>
          <Meta article={article} />
        </div>
      </article>
    )
  }

  /* minimal */
  if (variant === 'minimal') {
    return (
      <article className="group border-b border-border pb-3 last:border-0">
        {cat && <CategoryPill cat={cat} />}
        <a href={href}>
          <h3 className="text-sm font-bold text-ink group-hover:text-[#1d70b8] transition-colors line-clamp-2 mt-1 leading-[1.3]">
            {article.title}
          </h3>
        </a>
        <Meta article={article} />
      </article>
    )
  }

  /* editors */
  if (variant === 'editors') {
    return (
      <article className="group flex gap-3 border-b border-border pb-4 last:border-0">
        <div className="shrink-0 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-black">
          EP
        </div>
        <div>
          {cat && <CategoryPill cat={cat} />}
          <a href={href}>
            <h3 className="text-sm font-semibold text-ink group-hover:text-[#1d70b8] transition-colors line-clamp-2 mt-1">
              {article.title}
            </h3>
          </a>
          <Meta article={article} />
        </div>
      </article>
    )
  }

  /* default grid */
  return (
    <article className="group">
      {imageUrl && (
        <a href={href} className="block aspect-[16/10] overflow-hidden bg-paper mb-3 relative">
          <Image
            src={imageUrl} alt={article.mainImage?.alt ?? article.title} fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </a>
      )}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        {cat && <CategoryPill cat={cat} />}
        {article.wordCount && <DepthBadge article={article} />}
      </div>
      <a href={href}>
        <h2 className="font-bold text-ink group-hover:text-[#1d70b8] transition-colors line-clamp-2 leading-[1.3] text-[15px]">
          {article.title}
        </h2>
      </a>
      <Meta article={article} />
    </article>
  )
}