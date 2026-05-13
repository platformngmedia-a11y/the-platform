import { fetchSources } from '@/lib/fetcher'
import { getSourcesByTier, getAllSources } from '@/lib/sourceRegistry'
import { adminClient } from '@/lib/sanity/adminClient'

export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tierParam = searchParams.get('tier')
  const currentHour = new Date().getUTCHours()

  let sourcesToFetch = []

  if (tierParam) {
    if (tierParam === 'all') {
      sourcesToFetch = getAllSources().filter((s) => s.active)
    } else {
      sourcesToFetch = getSourcesByTier(parseInt(tierParam) as 1 | 2 | 3)
    }
  } else {
    sourcesToFetch = [...getSourcesByTier(1)]
    if ([6, 12, 18].includes(currentHour)) {
      sourcesToFetch = [...sourcesToFetch, ...getSourcesByTier(2)]
    }
    if (currentHour === 6) {
      sourcesToFetch = [...sourcesToFetch, ...getSourcesByTier(3)]
    }
  }

  if (sourcesToFetch.length === 0) {
    return Response.json({ message: 'No sources to fetch this run' })
  }

  const startTime = Date.now()
  const { leads, errors } = await fetchSources(sourcesToFetch, 5)

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
      sourcesChecked:   sourcesToFetch.length,
      leadsFound:       leads.length,
      newLeadsCreated,
      duplicatesSkipped,
      errors:           errors.length,
      durationSeconds:  Math.round((Date.now() - startTime) / 1000),
      timestamp:        new Date().toISOString(),
    },
    errors: errors.slice(0, 20),
  })
}
