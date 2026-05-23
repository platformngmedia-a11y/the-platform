import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { urlForImage } from '@/lib/sanity/image'
import { postToSocial } from '@/lib/buffer'

export const maxDuration = 30

export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ error: 'SANITY_WEBHOOK_SECRET not configured' }, { status: 500 })
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''
  const body = await request.text()

  const valid = await isValidSignature(body, signature, secret)
  if (!valid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)

  // Only act on article publish events
  if (payload._type !== 'article') {
    return Response.json({ skipped: true, reason: 'Not an article' })
  }

  // Require publishedAt — drafts won't have it
  if (!payload.publishedAt) {
    return Response.json({ skipped: true, reason: 'No publishedAt — still a draft' })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theplatformng.com'
  const articleUrl = `${siteUrl}/article/${payload.slug?.current}`

  let imageUrl: string | undefined
  try {
    if (payload.mainImage?.asset) {
      imageUrl = urlForImage(payload.mainImage).width(1200).height(630).url()
    }
  } catch { /* no image */ }

  const category = payload.categories?.[0]?.title ?? ''

  const results = await postToSocial({
    title:    payload.title,
    excerpt:  payload.excerpt ?? '',
    url:      articleUrl,
    imageUrl,
    category,
  })

  console.log('[BUFFER]', JSON.stringify(results))

  return Response.json({ ok: true, results })
}
