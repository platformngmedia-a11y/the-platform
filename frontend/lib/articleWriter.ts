import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface LeadInput {
  headline:    string
  summary:     string
  sourceOrg:   string
  sourceLevel: string
  category:    string
  zone?:       string | null
  sourceUrl:   string
  editorNotes?: string
}

interface ArticleParagraph {
  style: 'normal' | 'h3'
  text:  string
}

export interface GeneratedArticle {
  title:          string
  slug:           string
  excerpt:        string
  paragraphs:     ArticleParagraph[]
  tags:           string[]
  category:       string
  readingTime:    number
  seoTitle:       string
  seoDescription: string
}

const PLATFORM_PROMPT = `You are a senior journalist at The Platform, Nigeria's premier digital newsroom.
Our tagline is "Dependable. True. Engaging." — every article must embody all three.

EDITORIAL VOICE:
- Write in professional Nigerian English — clear, authoritative, never condescending
- Lead with human impact, not bureaucratic language
- Short paragraphs — 2–3 sentences maximum. This is digital news, not a broadsheet
- Never use passive constructions to obscure accountability ("The minister announced" not "It was announced")
- Connect policy to lived experience — a CBN rate change becomes a story about the Abuja trader and the Lagos landlord
- Be precise about geography: name the states, zones, and LGAs affected where relevant

FLOW AND CRAFT:
Write as a single, continuous narrative. Do NOT use section subheadings. Every article is prose only — the story should pull the reader from the first line to the last without stopping for a label.

All of the following must be present but woven naturally into the flow of the piece, not announced or sectioned off:

- THE HOOK: Open with the sharpest, most human version of the news. Who, what, where, when, and the immediate consequence — in the first paragraph.
- HUMAN STAKE AND DEMOGRAPHICS: Work specific affected populations into the narrative early. Name them. Quantify them. "37 million Nigerians", "1 in 4 households in the North-East", "an estimated 600,000 informal traders in Lagos". These figures should feel like reporting, not a box-tick.
  - Federal stories: identify which income brackets, sectors, or regions carry the most burden or benefit
  - State stories: name adjacent states likely to feel spillover effects
  - Economic stories: segment by formal/informal sector workers, traders, farmers, salary earners
  - Health stories: identify age groups, gender, or regional disease burden
  - Education stories: mention the student population affected and state-by-state variance
  - Security stories: name the communities at risk and displacement figures where known
- CONTEXT AND BACKGROUND: Fold in the history and policy landscape as the story demands it — not in a block labelled "Background", but as the natural answer to "why does this matter and how did we get here?"
- WHAT WAS SAID: Paraphrase or quote the source material to give the official position. Let it arrive at the moment in the narrative where it carries the most weight.
- WHAT COMES NEXT: Weave forward-looking consequence into the closing paragraphs — what Nigerians should watch for, likely timelines, what this could trigger.
- CLOSING LINE: End with one sentence that crystallises the stakes at ground level. Make it land.

TONE: Serious without being heavy. Urgent without being alarmist. The best sentence is the one a reader could not skip.`

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function estimateReadingTime(paragraphs: ArticleParagraph[]): number {
  const words = paragraphs.reduce((acc, p) => acc + p.text.split(' ').length, 0)
  return Math.max(1, Math.round(words / 200))
}

export async function generateArticle(lead: LeadInput): Promise<GeneratedArticle> {
  const userMessage = `
Write a full news article for The Platform based on this lead:

SOURCE HEADLINE: ${lead.headline}
SOURCE SUMMARY: ${lead.summary || '(no summary — work from headline)'}
SOURCE ORGANISATION: ${lead.sourceOrg}
SOURCE LEVEL: ${lead.sourceLevel}
CATEGORY: ${lead.category}
${lead.zone ? `GEOPOLITICAL ZONE: ${lead.zone.replace('_', ' ')}` : ''}
${lead.editorNotes ? `EDITOR NOTES / ANGLE: ${lead.editorNotes}` : ''}
ORIGINAL SOURCE URL: ${lead.sourceUrl}

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "title": "Article headline (active voice, under 12 words)",
  "slug": "url-slug-derived-from-title",
  "excerpt": "2–3 sentence summary for the article listing page (40–60 words)",
  "paragraphs": [
    { "style": "normal", "text": "Lead paragraph — the sharpest version of the news..." },
    { "style": "normal", "text": "Paragraph weaving in demographics and human stake..." },
    { "style": "normal", "text": "Paragraph continuing the narrative with context..." },
    { "style": "normal", "text": "Further context or background as the story demands..." },
    { "style": "normal", "text": "What officials said, arriving at the right moment in the story..." },
    { "style": "normal", "text": "Forward-looking paragraph — what to watch, timelines, consequences..." },
    { "style": "normal", "text": "Closing line that crystallises the stakes at ground level." }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "category": "${lead.category}",
  "seoTitle": "SEO-optimised title under 60 characters",
  "seoDescription": "Meta description 140–160 characters summarising the article for search"
}
`

  let message: Anthropic.Message | undefined
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      message = await anthropic.messages.create({
        model:      'claude-sonnet-4-6',
        max_tokens: 2048,
        system:     PLATFORM_PROMPT,
        messages:   [{ role: 'user', content: userMessage }],
      }) as Anthropic.Message
      break
    } catch (err: any) {
      const isOverloaded = err?.status === 529 || err?.error?.error?.type === 'overloaded_error'
      if (isOverloaded && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, attempt * 8000))
        continue
      }
      throw err
    }
  }
  if (!message) throw new Error('Claude API unavailable after retries — please try again shortly')

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')

  const parsed = JSON.parse(jsonMatch[0]) as Omit<GeneratedArticle, 'readingTime'>
  const readingTime = estimateReadingTime(parsed.paragraphs)

  return {
    ...parsed,
    slug: slugify(parsed.slug || parsed.title),
    readingTime,
  }
}

// Convert generated paragraphs to Sanity portable text blocks
export function toPortableText(paragraphs: ArticleParagraph[]) {
  return paragraphs.map((p, i) => ({
    _type:     'block',
    _key:      `block-${i}-${Math.random().toString(36).slice(2, 7)}`,
    style:     p.style,
    markDefs:  [],
    children:  [{
      _type:  'span',
      _key:   `span-${i}-${Math.random().toString(36).slice(2, 7)}`,
      text:   p.text,
      marks:  [],
    }],
  }))
}
