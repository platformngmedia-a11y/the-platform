import { adminClient } from '@/lib/sanity/adminClient'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  try {
    const count = await adminClient.fetch<number>(
      `count(*[_type == "newsLead" && status in ["new", "skipped"] && fetchedAt < $cutoff])`,
      { cutoff: thirtyDaysAgo }
    )

    if (count > 0) {
      await adminClient.delete({
        query:  `*[_type == "newsLead" && status in ["new", "skipped"] && fetchedAt < $cutoff][0...500]`,
        params: { cutoff: thirtyDaysAgo },
      })
    }

    return Response.json({
      deleted:    Math.min(count, 500),
      remaining:  Math.max(0, count - 500),
      cutoffDate: thirtyDaysAgo,
    })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
