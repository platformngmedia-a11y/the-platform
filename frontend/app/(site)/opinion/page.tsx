import { client }                from '@/lib/sanity/client'
import { featuredOpinionsQuery } from '@/lib/sanity/queries'
import { OpinionCard }           from '@/components/OpinionCard'
import type { Metadata }         from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Opinion & Analysis',
  description: 'Informed perspectives and analysis from leading Nigerian voices on politics, economy, society and culture.',
}

export default async function OpinionPage() {
  const opinions = await client.fetch(featuredOpinionsQuery)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="border-b-4 border-navy pb-4 mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">The Platform</p>
        <h1 className="font-serif text-4xl font-black text-ink">Opinion & Analysis</h1>
        <p className="text-muted mt-3 max-w-xl leading-relaxed">
          Informed perspectives from Nigeria's leading thinkers, journalists and public intellectuals.
        </p>
      </div>

      <div className="divide-y divide-border">
        {opinions.map((op: any) => (
          <div key={op._id} className="py-6">
            <OpinionCard opinion={op} />
          </div>
        ))}
      </div>

      {opinions.length === 0 && (
        <p className="text-center text-muted py-24">No opinion pieces published yet.</p>
      )}
    </div>
  )
}