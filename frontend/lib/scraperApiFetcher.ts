import * as cheerio from 'cheerio'
import type { Source } from './sourceRegistry'
import type { RawLead } from './fetcher'

function cleanText(text: string): string {
  return (text ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchWithScraperApi(source: Source): Promise<{ leads: RawLead[]; error?: string }> {
  const apiKey = process.env.SCRAPER_API_KEY
  if (!apiKey) return { leads: [], error: 'SCRAPER_API_KEY env var not set' }

  const targetUrl = source.url + source.pressPath
  const scraperUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render=true`

  try {
    const response = await fetch(scraperUrl, { signal: AbortSignal.timeout(60000) })
    if (!response.ok) {
      return { leads: [], error: `ScraperAPI HTTP ${response.status} for ${targetUrl}` }
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const leads: RawLead[] = []

    let elements = $(source.selector)
    if (elements.length === 0) {
      for (const sel of ['article h2 a', '.post-title a', '.entry-title a', 'h2 a', 'h3 a']) {
        elements = $(sel)
        if (elements.length > 0) break
      }
    }

    const sourceDomain = new URL(source.url).hostname

    elements.slice(0, 10).each((_, el) => {
      const $el = $(el)
      let href = $el.attr('href') ?? ''
      const title = cleanText($el.text())

      if (!title || title.length < 10) return
      if (href === '#' || href === '/') return

      if (href && !href.startsWith('http')) {
        try { href = new URL(href, source.url).toString() } catch { return }
      }

      try {
        const linkDomain = new URL(href).hostname
        if (!linkDomain.endsWith(sourceDomain) && !sourceDomain.endsWith(linkDomain)) return
      } catch { return }

      leads.push({
        headline:    title.substring(0, 300),
        summary:     '',
        url:         href,
        publishedAt: new Date().toISOString(),
        sourceName:  source.name,
        sourceLevel: source.level,
        category:    source.category,
        zone:        source.zone ?? null,
        strategy:    'scraper-api',
      })
    })

    console.log(`[SCRAPER-API] ${source.name}: found ${leads.length} leads`)
    return { leads }
  } catch (err: any) {
    console.error(`[SCRAPER-API ERROR] ${source.name}: ${err.message}`)
    return { leads: [], error: err.message }
  }
}

export async function fetchScraperApiSources(
  sources: Source[],
  concurrency = 2,
): Promise<{ leads: RawLead[]; errors: string[] }> {
  const leads: RawLead[] = []
  const errors: string[] = []

  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency)
    const results = await Promise.allSettled(batch.map(fetchWithScraperApi))
    for (const result of results) {
      if (result.status === 'fulfilled') {
        leads.push(...result.value.leads)
        if (result.value.error) errors.push(result.value.error)
      } else {
        errors.push(result.reason?.message ?? 'Unknown error')
      }
    }
  }

  return { leads, errors }
}
