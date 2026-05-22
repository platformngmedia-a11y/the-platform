import { getJsSources } from '@/lib/sourceRegistry'
import { fetchJsSources } from '@/lib/headlessFetcher'
import { adminClient } from '@/lib/sanity/adminClient'

export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sources = getJsSources()
  if (sources.length === 0) {
    return Response.json({ message: 'No JS sources configured' })
  }

  const startTime = Date.now()
  const { leads, errors } = await fetchJsSources(sources, 2)

  let newLeadsCreated = 0
  let duplicatesSkipped = 0

  for (const lead of leads) {
    if (!lead.url) continue
    try {
      const exists = await adminClient.fetch<boolean>(
        `count(*[_type == "newsLead" && sourceUrl == $url]) > 0`,
        { url: lead.url }
      )
      if (exists) { duplicatesSkipped++; continue }

      await adminClient.create({
        _type:          'newsLead',
        sourceHeadline: lead.headline,
        sourceSummary:  lead.summary,
        sourceUrl:      lead.url,
        sourceOrg:      lead.sourceName,
        sourceLevel:    lead.sourceLevel,
        category:       lead.category,
        zone:           lead.zone,
        fetchedAt:      new Date().toISOString(),
        fetchStrategy:  lead.strategy,
        status:         'new',
      })
      newLeadsCreated++
    } catch (err: any) {
      errors.push(`Sanity error for "${lead.headline}": ${err.message}`)
    }
  }

  return Response.json({
    summary: {
      sourcesChecked:  sources.length,
      leadsFound:      leads.length,
      newLeadsCreated,
      duplicatesSkipped,
      errors:          errors.length,
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
      timestamp:       new Date().toISOString(),
    },
    errors: errors.slice(0, 20),
  })
}
