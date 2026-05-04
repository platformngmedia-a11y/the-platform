import { client }             from '@/lib/sanity/client'
import { allFactChecksQuery } from '@/lib/sanity/queries'
import { FactCheckCard }      from '@/components/FactCheckCard'
import type { Metadata }      from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Fact Check',
  description: 'The Platform fact-check team verifies claims made by politicians, officials and public figures in Nigeria.',
}

export default async function FactCheckPage() {
  const checks = await client.fetch(allFactChecksQuery)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="border-b-4 border-navy pb-4 mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">The Platform</p>
        <h1 className="font-serif text-4xl font-black text-ink">Fact Check</h1>
        <p className="text-muted mt-3 max-w-xl leading-relaxed">
          Our team investigates claims made by politicians, officials, institutions and viral posts.
          Every claim is rated using transparent methodology and sourced evidence.
        </p>
      </div>

      {/* Verdict legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: 'True',         color: 'bg-green-50  text-green-800  border-green-200' },
          { label: 'Partly True',  color: 'bg-amber-50  text-amber-800  border-amber-200' },
          { label: 'False',        color: 'bg-red-50    text-red-800    border-red-200' },
          { label: 'Misleading',   color: 'bg-orange-50 text-orange-800 border-orange-200' },
          { label: 'Unverifiable', color: 'bg-gray-50   text-gray-700   border-gray-200' },
        ].map(v => (
          <span key={v.label} className={`text-xs font-bold px-3 py-1 rounded border ${v.color}`}>
            {v.label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {checks.map((check: any) => (
          <FactCheckCard key={check._id} check={check} compact />
        ))}
      </div>

      {checks.length === 0 && (
        <p className="text-center text-muted py-24">No fact checks published yet.</p>
      )}
    </div>
  )
}