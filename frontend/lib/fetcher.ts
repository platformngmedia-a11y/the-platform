import Parser from 'rss-parser'
import * as cheerio from 'cheerio'
import type { Source } from './sourceRegistry'

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'ThePlatform-NewsBot/1.0 (editorial lead monitoring)' },
})

export interface RawLead {
  headline:    string
  summary:     string
  url:         string
  publishedAt: string
  sourceName:  string
  sourceLevel: string
  category:    string
  zone:        string | null
  strategy:    string
}

async function fetchRss(source: Source): Promise<RawLead[]> {
  const leads: RawLead[] = []
  try {
    const feed = await parser.parseURL(source.feedUrl!)
    for (const item of feed.items.slice(0, 10)) {
      leads.push({
        headline:    cleanText(item.title ?? 'No title'),
        summary:     cleanText(item.contentSnippet ?? item.content ?? '').substring(0, 500),
        url:         item.link ?? '',
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        sourceName:  source.name,
        sourceLevel: source.level,
        category:    source.category,
        zone:        source.zone ?? null,
        strategy:    'rss',
      })
    }
  } catch (err: any) {
    console.error(`[RSS ERROR] ${source.name}: ${err.message}`)
  }
  return leads
}

async function fetchHtml(source: Source): Promise<RawLead[]> {
  const leads: RawLead[] = []
  const targetUrl = source.url + source.pressPath

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'ThePlatform-NewsBot/1.0 (editorial lead monitoring)' },
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      console.error(`[HTML ERROR] ${source.name}: HTTP ${response.status}`)
      return leads
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    let elements = $(source.selector)

    if (elements.length === 0) {
      const fallbacks = [
        'article h2 a', '.post-title a', '.entry-title a',
        'h2.title a', 'h3.title a', '.news-item a',
        '.press-release a', '.views-row a', 'h2 a', 'h3 a',
      ]
      for (const sel of fallbacks) {
        elements = $(sel)
        if (elements.length > 0) break
      }
    }

    elements.slice(0, 10).each((_, el) => {
      const $el = $(el)
      let href  = $el.attr('href') ?? ''
      const title = cleanText($el.text())

      if (!title || title.length < 10) return
      if (href === '#' || href === '/') return

      if (href && !href.startsWith('http')) {
        try { href = new URL(href, source.url).toString() } catch { return }
      }

      // Reject links that point outside the source's domain
      try {
        const sourceDomain = new URL(source.url).hostname
        const linkDomain   = new URL(href).hostname
        if (!linkDomain.endsWith(sourceDomain) && !sourceDomain.endsWith(linkDomain)) return
      } catch { return }

      leads.push({
        headline:    title,
        summary:     '',
        url:         href,
        publishedAt: new Date().toISOString(),
        sourceName:  source.name,
        sourceLevel: source.level,
        category:    source.category,
        zone:        source.zone ?? null,
        strategy:    'html',
      })
    })
  } catch (err: any) {
    console.error(`[HTML ERROR] ${source.name}: ${err.message}`)
  }
  return leads
}

export async function fetchSource(source: Source): Promise<RawLead[]> {
  if (!source.active) return []
  if (source.strategy === 'rss' && source.feedUrl) return fetchRss(source)
  if (source.strategy === 'html') return fetchHtml(source)
  return []
}

export async function fetchSources(
  sources: Source[],
  concurrency = 5
): Promise<{ leads: RawLead[]; errors: string[] }> {
  const allLeads: RawLead[] = []
  const errors:   string[]  = []

  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency)
    const results = await Promise.allSettled(
      batch.map(async (source) => {
        const leads = await fetchSource(source)
        return { source: source.name, leads }
      })
    )
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allLeads.push(...result.value.leads)
      } else {
        errors.push(result.reason?.message ?? 'Unknown error')
      }
    }
    if (i + concurrency < sources.length) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  return { leads: allLeads, errors }
}

function cleanText(text: string): string {
  return (text ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}
