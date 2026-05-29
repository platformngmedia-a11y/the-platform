import type { Source } from './sourceRegistry'
import type { RawLead } from './fetcher'

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

async function launchBrowser() {
  const puppeteer = (await import('puppeteer-core')).default

  if (process.env.NODE_ENV === 'production') {
    const chromium = (await import('@sparticuz/chromium')).default
    const executablePath = await chromium.executablePath()
    console.log('[HEADLESS] launching production browser, execPath:', executablePath)
    return puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    })
  }

  // Local dev — use system Chrome
  const executablePath =
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  return puppeteer.launch({ executablePath, headless: true })
}

async function fetchWithBrowser(source: Source): Promise<RawLead[]> {
  const leads: RawLead[] = []
  const targetUrl = source.url + source.pressPath
  let browser = null

  try {
    browser = await launchBrowser()
    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 })

    await new Promise((r) => setTimeout(r, 2000))

    const rawLinks = await page.evaluate((selector: string) => {
      const els = Array.from(document.querySelectorAll(selector))
      return els.slice(0, 15).map((el) => ({
        href: (el as HTMLAnchorElement).href ?? '',
        text: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
      }))
    }, source.selector)

    const sourceDomain = new URL(source.url).hostname

    for (const { href, text } of rawLinks) {
      if (!text || text.length < 10) continue
      if (!href || href === '#') continue

      try {
        const linkDomain = new URL(href).hostname
        if (!linkDomain.endsWith(sourceDomain) && !sourceDomain.endsWith(linkDomain)) continue
      } catch { continue }

      leads.push({
        headline:    cleanText(text).substring(0, 300),
        summary:     '',
        url:         href,
        publishedAt: new Date().toISOString(),
        sourceName:  source.name,
        sourceLevel: source.level,
        category:    source.category,
        zone:        source.zone ?? null,
        strategy:    'headless',
      })
    }

    console.log(`[HEADLESS] ${source.name}: found ${leads.length} leads`)
  } catch (err: any) {
    console.error(`[HEADLESS ERROR] ${source.name}: ${err.message}\n${err.stack}`)
  } finally {
    if (browser) await browser.close().catch(() => {})
  }

  return leads
}

export async function fetchJsSources(
  sources: Source[],
  concurrency = 2,
): Promise<{ leads: RawLead[]; errors: string[] }> {
  const leads: RawLead[] = []
  const errors: string[] = []

  // Run in small batches — headless browsers are memory-heavy
  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency)
    const results = await Promise.allSettled(batch.map(fetchWithBrowser))
    for (const result of results) {
      if (result.status === 'fulfilled') {
        leads.push(...result.value)
      } else {
        errors.push(result.reason?.message ?? 'Unknown error')
      }
    }
  }

  return { leads, errors }
}
