import { adminClient } from '@/lib/sanity/adminClient'
import { generateArticle, toPortableText } from '@/lib/articleWriter'

export const maxDuration = 60

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

  let leadId: string
  try {
    const body = await request.json()
    leadId = body.leadId
    if (!leadId) throw new Error('Missing leadId')
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  // Fetch the lead from Sanity
  const lead = await adminClient.fetch(
    `*[_type == "newsLead" && _id == $id][0]`,
    { id: leadId }
  )
  if (!lead) {
    return Response.json({ error: 'Lead not found' }, { status: 404, headers })
  }

  // Fetch the category reference so we can link it in the article
  const category = await adminClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ _id }`,
    { slug: lead.category }
  )

  // Generate the article with Claude
  let generated
  try {
    generated = await generateArticle({
      headline:    lead.sourceHeadline,
      summary:     lead.sourceSummary ?? '',
      sourceOrg:   lead.sourceOrg,
      sourceLevel: lead.sourceLevel,
      category:    lead.category,
      zone:        lead.zone,
      sourceUrl:   lead.sourceUrl,
      editorNotes: lead.editorNotes,
    })
  } catch (err: any) {
    return Response.json({ error: `Generation failed: ${err.message}` }, { status: 500, headers })
  }

  // Create the article as a Sanity draft (id prefixed with "drafts.")
  const draftId = `drafts.${crypto.randomUUID()}`
  const doc: Record<string, any> = {
    _id:         draftId,
    _type:       'article',
    title:       generated.title,
    slug:        { _type: 'slug', current: generated.slug },
    excerpt:     generated.excerpt,
    body:        toPortableText(generated.paragraphs),
    tags:        generated.tags,
    readingTime: generated.readingTime,
    seoTitle:    generated.seoTitle,
    seoDescription: generated.seoDescription,
    publishedAt: new Date().toISOString(),
    isBreaking:  false,
    isFeatured:  false,
    isEditorsPick: false,
  }

  if (category?._id) {
    doc.categories = [{ _type: 'reference', _ref: category._id, _key: crypto.randomUUID() }]
  }

  await adminClient.createOrReplace(doc)

  // Mark the lead as "writing"
  await adminClient.patch(leadId).set({ status: 'writing' }).commit()

  return Response.json({
    success:   true,
    draftId,
    articleId: draftId.replace('drafts.', ''),
    title:     generated.title,
    studioUrl: `https://platformngmedia-studio.sanity.studio/structure/article;${draftId}`,
  }, { headers })
}
