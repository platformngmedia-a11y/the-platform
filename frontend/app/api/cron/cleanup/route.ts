import { adminClient } from '@/lib/sanity/adminClient'

export const maxDuration = 120

// Leads are machine-fetched pointers that regenerate from feeds; an untouched
// lead older than 14 days is dead weight. Retention must outpace inflow
// (~26 active sources) or the dataset hits the Sanity document quota and all
// writes fail with 403 — which is exactly what happened in Aug 2026.
const RETENTION_DAYS = 14
const BATCH_SIZE = 500
const MAX_BATCHES_PER_RUN = 8

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  try {
    const count = await adminClient.fetch<number>(
      `count(*[_type == "newsLead" && status in ["new", "skipped"] && fetchedAt < $cutoff])`,
      { cutoff }
    )

    let deleted = 0
    for (let i = 0; i < MAX_BATCHES_PER_RUN && deleted < count; i++) {
      await adminClient.delete({
        query:  `*[_type == "newsLead" && status in ["new", "skipped"] && fetchedAt < $cutoff][0...${BATCH_SIZE}]`,
        params: { cutoff },
      })
      deleted += Math.min(BATCH_SIZE, count - deleted)
    }

    return Response.json({
      deleted,
      remaining:  Math.max(0, count - deleted),
      cutoffDate: cutoff,
    })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
