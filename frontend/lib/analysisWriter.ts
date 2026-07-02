import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-opus-4-8'

export interface CandidateIssue {
  title: string
  summary: string
  whyItMatters: string
  suggestedAngle: string
  urgency: 'breaking' | 'developing' | 'evergreen'
  categorySlug: string
}

interface AnalysisParagraph {
  style: 'normal' | 'h3'
  text: string
}

export interface GeneratedAnalysis {
  title: string
  slug: string
  excerpt: string
  paragraphs: AnalysisParagraph[]
  tags: string[]
  categorySlug: string
  readingTime: number
  wordCount: number
  seoTitle: string
  seoDescription: string
  imagePrompt: string
  imageAlt: string
  sources: Array<{ name: string; url: string }>
}

const DESK_PROMPT = `You are the research desk of The Platform (theplatformng.com), Nigeria's home of trustworthy journalism. Tagline: "Dependable. True. Engaging."

Your job is to find the biggest developing Nigerian stories and rank them by ANALYSIS POTENTIAL:
- Consequence: does it materially affect Nigerians' lives, money, safety, or rights?
- Contestation: are there genuinely competing viewpoints worth synthesising?
- Coverage gap: are outlets reporting fragments without connecting the full picture?
- Durability: will the analysis still be relevant in a week?

Prefer politics, economy, security, governance, and technology stories with national significance. Avoid celebrity gossip and one-day wonder stories.`

const WRITER_PROMPT = `You are a senior analyst at The Platform (theplatformng.com), Nigeria's home of trustworthy journalism. Tagline: "Dependable. True. Engaging."

You write NEWS ANALYSIS — synthesis pieces that go beyond headlines to explain what the news means for Nigeria.

EDITORIAL VOICE:
- Professional Nigerian English — clear, authoritative, never condescending
- Short paragraphs, 2-4 sentences. This is digital journalism
- Connect policy to lived experience — name affected populations and quantify them where the reporting supports it
- Serious without being heavy. The best sentence is the one a reader cannot skip

SOURCING STYLE (strict house rule):
- NEVER name specific news outlets, publications, or journalists in the article text
- Attribute with generic phrases only: "according to online reports", "multiple online sources indicate", "recent reporting suggests", "official statements confirm", "publicly available data shows"
- Facts, figures, and quotes must come from your research — do not invent statistics, names, or quotes
- If a claim is contested, present both sides fairly

STRUCTURE:
- A sharp opening that frames the question the analysis answers
- Context: how we got here
- The competing arguments or interpretations, weighed honestly
- What it means in practice for Nigerians
- A bottom line: your editorial team's measured assessment of what to watch next
- Use short h3 subheadings sparingly (2-4 across the piece) to guide the reader
- Target 700-950 words`

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
}

function extractJson<T>(raw: string): T {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Model did not return valid JSON')
  return JSON.parse(match[0]) as T
}

export async function discoverIssues(): Promise<CandidateIssue[]> {
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: DESK_PROMPT,
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    messages: [
      {
        role: 'user',
        content: `Search the web for the biggest Nigerian news stories from the past 72 hours. Today's date: ${new Date().toDateString()}.

Then return ONLY a valid JSON object (no markdown fences) with this exact structure:
{
  "issues": [
    {
      "title": "Short working title for the analysis piece",
      "summary": "2-3 sentences on what happened, with the key facts and figures you found",
      "whyItMatters": "1-2 sentences on the consequence for Nigerians",
      "suggestedAngle": "The analysis angle a senior editor would pitch — the question the piece answers",
      "urgency": "breaking" | "developing" | "evergreen",
      "categorySlug": "one of: politics, economy, nigeria, world, sport, technology, healthcare"
    }
  ]
}

Return 5-6 issues, ranked best analysis candidate first.`,
      },
    ],
  })

  const message = await stream.finalMessage()
  const parsed = extractJson<{ issues: CandidateIssue[] }>(extractText(message))
  return parsed.issues ?? []
}

export async function draftAnalysis(issue: {
  title: string
  summary?: string
  suggestedAngle?: string
  categorySlug?: string
}): Promise<GeneratedAnalysis> {
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    thinking: { type: 'adaptive' },
    system: WRITER_PROMPT,
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 10 }],
    messages: [
      {
        role: 'user',
        content: `Research and write a full News Analysis piece for The Platform. Today's date: ${new Date().toDateString()}.

TOPIC: ${issue.title}
${issue.summary ? `WHAT WE KNOW: ${issue.summary}` : ''}
${issue.suggestedAngle ? `EDITORIAL ANGLE: ${issue.suggestedAngle}` : ''}

First, search the web to gather current facts, figures, official statements, and the competing viewpoints. Then write the piece following the house sourcing style (generic attribution only — never name outlets in the article text).

Return ONLY a valid JSON object (no markdown fences) with this exact structure:
{
  "title": "Analysis headline — a sharp question or tension, under 14 words",
  "slug": "url-slug-derived-from-title",
  "excerpt": "2-3 sentence standfirst for listing pages (40-60 words)",
  "paragraphs": [
    { "style": "normal", "text": "..." },
    { "style": "h3", "text": "Short subheading" },
    { "style": "normal", "text": "..." }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "categorySlug": "${issue.categorySlug || 'politics'}",
  "seoTitle": "SEO title under 60 characters",
  "seoDescription": "Meta description 140-160 characters",
  "imagePrompt": "A detailed prompt for an AI image generator: an editorial illustration for this analysis in the visual language of Economist/FT opinion art. Describe composition, symbolism, colour palette (deep navy, Nigerian-flag green, warm gold accents, off-white background), lighting, and style. Must end with: 'No text, no words, no letters anywhere in the image. Wide 16:9 composition with negative space at the top.'",
  "imageAlt": "One-sentence alt text describing the illustration",
  "sources": [
    { "name": "Outlet or institution name", "url": "https://..." }
  ]
}

The "sources" array is for internal editorial records only (it is never shown to readers on analysis pieces) — list the real outlets and pages you drew on.`,
      },
    ],
  })

  const message = await stream.finalMessage()
  const parsed = extractJson<Omit<GeneratedAnalysis, 'readingTime' | 'wordCount'>>(
    extractText(message)
  )

  const wordCount = parsed.paragraphs.reduce((acc, p) => acc + p.text.split(/\s+/).length, 0)

  return {
    ...parsed,
    slug: slugify(parsed.slug || parsed.title),
    wordCount,
    readingTime: Math.max(1, Math.round(wordCount / 200)),
  }
}

export function analysisToPortableText(paragraphs: AnalysisParagraph[]) {
  return paragraphs.map((p, i) => ({
    _type: 'block',
    _key: `block-${i}-${Math.random().toString(36).slice(2, 7)}`,
    style: p.style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${i}-${Math.random().toString(36).slice(2, 7)}`,
        text: p.text,
        marks: [],
      },
    ],
  }))
}
