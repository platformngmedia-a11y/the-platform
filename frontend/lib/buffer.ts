const BUFFER_API = 'https://api.bufferapp.com/1'

export interface BufferPostOptions {
  title:      string
  excerpt:    string
  url:        string
  imageUrl?:  string
  category?:  string
}

function facebookText({ title, excerpt, url }: BufferPostOptions): string {
  return `${title}\n\n${excerpt}\n\n🔗 ${url}`
}

function instagramCaption({ title, excerpt, category }: BufferPostOptions): string {
  const tag = category ? `#${category.replace(/\s+/g, '')}` : ''
  return `${excerpt}\n\n📰 ${title}\n\n🔗 Link in bio\n\n#Nigeria #NigeriaNews #ThePlatform #BreakingNews ${tag}`.trim()
}

async function createUpdate(
  profileId: string,
  text: string,
  imageUrl?: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) throw new Error('BUFFER_ACCESS_TOKEN not set')

  const body = new URLSearchParams({ access_token: token, text })
  body.append(`profile_ids[]`, profileId)
  if (imageUrl) body.append('media[photo]', imageUrl)

  const res = await fetch(`${BUFFER_API}/updates/create.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    return { success: false, error: data.error ?? `HTTP ${res.status}` }
  }
  return { success: true, id: data.updates?.[0]?.id }
}

export async function postToSocial(options: BufferPostOptions): Promise<{
  facebook?: { success: boolean; error?: string }
  instagram?: { success: boolean; error?: string }
}> {
  const results: Record<string, { success: boolean; error?: string }> = {}

  const fbProfileId = process.env.BUFFER_FACEBOOK_PROFILE_ID
  const igProfileId = process.env.BUFFER_INSTAGRAM_PROFILE_ID

  const tasks: Promise<void>[] = []

  if (fbProfileId) {
    tasks.push(
      createUpdate(fbProfileId, facebookText(options), options.imageUrl)
        .then((r) => { results.facebook = r })
        .catch((e) => { results.facebook = { success: false, error: e.message } })
    )
  }

  if (igProfileId && options.imageUrl) {
    // Instagram requires an image via Buffer
    tasks.push(
      createUpdate(igProfileId, instagramCaption(options), options.imageUrl)
        .then((r) => { results.instagram = r })
        .catch((e) => { results.instagram = { success: false, error: e.message } })
    )
  } else if (igProfileId && !options.imageUrl) {
    results.instagram = { success: false, error: 'Skipped — Instagram requires an image' }
  }

  await Promise.all(tasks)
  return results
}
