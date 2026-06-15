import { adminClient } from '@/lib/sanity/adminClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim() || ''

  if (query.length < 2) {
    return Response.json({ results: [] })
  }

  try {
    const results = await adminClient.fetch<any[]>(
      `*[_type == "article" && (
        title match $q or
        excerpt match $q
      )] | order(publishedAt desc)[0...10] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage,
        categories[]->{ _id, title, slug },
        author->{ _id, name, slug }
      }`,
      { q: `*${query}*` }
    )

    return Response.json({ results })
  } catch (err: any) {
    console.error('[SEARCH ERROR]', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
