import { adminClient } from '@/lib/sanity/adminClient'
import { draftAnalysis, analysisToPortableText } from '@/lib/analysisWriter'

export const maxDuration = 300

const ALLOWED_ORIGINS = [
  'https://platformngmedia-studio.sanity.studio',
  'http://localhost:3333',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) })
}

export async function POST(request: Request) {
  const origin  = request.headers.get('origin')
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin) }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.GENERATE_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers })
  }

  let issue: { title: string; summary?: string; suggestedAngle?: string; categorySlug?: string }
  try {
    const body = await request.json()
    if (!body.title) throw new Error('Missing title')
    issue = body
  } catch {
    return Response.json({ error: 'Invalid request body — expected { title, summary?, suggestedAngle?, categorySlug? }' }, { status: 400, headers })
  }

  let generated
  try {
    generated = await draftAnalysis(issue)
  } catch (err: any) {
    return Response.json({ error: `Draft generation failed: ${err.message}` }, { status: 500, headers })
  }

  const category = await adminClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ _id }`,
    { slug: generated.categorySlug }
  )

  const draftId = `drafts.${crypto.randomUUID()}`
  const doc: Record<string, any> = {
    _id:            draftId,
    _type:          'article',
    title:          generated.title,
    slug:           { _type: 'slug', current: generated.slug },
    excerpt:        generated.excerpt,
    body:           analysisToPortableText(generated.paragraphs),
    tags:           generated.tags,
    contentType:    'analysis',
    readingTime:    generated.readingTime,
    wordCount:      generated.wordCount,
    seoTitle:       generated.seoTitle,
    seoDescription: generated.seoDescription,
    suggestedImagePrompt: generated.imagePrompt,
    publishedAt:    new Date().toISOString(),
    isBreaking:     false,
    isFeatured:     false,
    isEditorsPick:  false,
    // Internal editorial record — never displayed to readers on analysis pieces
    sourcesUsed: (generated.sources ?? []).map((s) => ({
      _key: crypto.randomUUID(),
      name: s.name,
      url:  s.url,
      type: 'news',
    })),
  }

  if (category?._id) {
    doc.categories = [{ _type: 'reference', _ref: category._id, _key: crypto.randomUUID() }]
  }

  await adminClient.createOrReplace(doc)

  return Response.json({
    success:   true,
    draftId,
    title:     generated.title,
    imageAlt:  generated.imageAlt,
    studioUrl: `https://platformngmedia-studio.sanity.studio/structure/article;${draftId}`,
  }, { headers })
}
