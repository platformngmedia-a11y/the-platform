import { revalidatePath } from 'next/cache'
import { NextResponse }   from 'next/server'
import { isValidRequest } from '@sanity/webhook'

export async function POST(req: Request) {
  if (!await isValidRequest(req, process.env.SANITY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const type = body?._type
  const slug = body?.slug?.current

  if (type === 'article'   && slug) revalidatePath(`/article/${slug}`)
  if (type === 'factCheck' && slug) revalidatePath(`/fact-check/${slug}`)
  if (type === 'opinion'   && slug) revalidatePath(`/opinion/${slug}`)

  revalidatePath('/')
  revalidatePath('/fact-check')
  revalidatePath('/opinion')

  return NextResponse.json({ revalidated: true, type, slug })
}