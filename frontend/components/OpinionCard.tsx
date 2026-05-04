import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import { formatDistanceToNow } from 'date-fns'

export function OpinionCard({ opinion }: { opinion: any }) {
  return (
    <a href={`/opinion/${opinion.slug.current}`} className="group flex gap-3 border-b border-line pb-4 last:border-0 hover:bg-paper/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
      <div className="shrink-0">
        {opinion.author?.image
          ? (
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image src={urlForImage(opinion.author.image).width(80).height(80).url()} alt={opinion.author.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
              {opinion.author?.name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('') ?? 'OP'}
            </div>
          )
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-ink/70 truncate">{opinion.author?.name}</p>
        <p className="text-[10px] text-muted truncate">{opinion.author?.role}</p>
        <h3 className="text-sm font-serif font-semibold text-ink group-hover:text-navy transition-colors line-clamp-2 mt-1 leading-snug">
          {opinion.title}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {opinion.publishedAt ? formatDistanceToNow(new Date(opinion.publishedAt), { addSuffix: true }) : ''}
        </p>
      </div>
    </a>
  )
}