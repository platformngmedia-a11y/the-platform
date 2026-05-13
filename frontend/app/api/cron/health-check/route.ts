import { getAllSources } from '@/lib/sourceRegistry'

export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sources = getAllSources()
  const results: Array<{
    name: string; url: string; status: string;
    httpStatus?: number; responseTimeMs?: number; error?: string
  }> = []

  for (const source of sources) {
    const targetUrl = source.feedUrl ?? (source.url + source.pressPath)
    try {
      const startTime = Date.now()
      const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'ThePlatform-HealthCheck/1.0' },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow',
      })
      results.push({
        name:           source.name,
        url:            targetUrl,
        status:         response.ok ? 'online' : 'error',
        httpStatus:     response.status,
        responseTimeMs: Date.now() - startTime,
      })
    } catch (err: any) {
      results.push({ name: source.name, url: targetUrl, status: 'offline', error: err.message })
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  const online  = results.filter((r) => r.status === 'online')
  const offline = results.filter((r) => r.status !== 'online')

  return Response.json({
    summary: { total: results.length, online: online.length, offline: offline.length, timestamp: new Date().toISOString() },
    needsAttention: offline.map((r) => ({ name: r.name, url: r.url, error: r.error ?? `HTTP ${r.httpStatus}` })),
    allResults: results,
  })
}
