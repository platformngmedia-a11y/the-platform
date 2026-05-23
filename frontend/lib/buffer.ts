const BUFFER_GRAPHQL = 'https://api.buffer.com/graphql'

const CREATE_POST = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id status } }
      ... on InvalidInputError  { message }
      ... on LimitReachedError  { message }
      ... on UnexpectedError    { message }
      ... on UnauthorizedError  { message }
    }
  }
`

export interface BufferPostOptions {
  title:             string
  excerpt:           string
  url:               string
  imageUrl?:         string  // full-size image for Facebook
  instagramImageUrl?: string // smaller square image for Instagram (≤8MB)
  category?:         string
}

function facebookText({ title, excerpt, url }: BufferPostOptions): string {
  return `${title}\n\n${excerpt}\n\n🔗 ${url}`
}

function twitterText({ title, url }: BufferPostOptions): string {
  // 280 chars: title + url + buffer = keep title under ~230 chars
  const truncated = title.length > 220 ? title.substring(0, 217) + '...' : title
  return `${truncated}\n\n🔗 ${url}`
}

function instagramCaption({ title, excerpt, category }: BufferPostOptions): string {
  const tag = category ? `#${category.replace(/\s+/g, '')}` : ''
  return `${excerpt}\n\n📰 ${title}\n\n🔗 Full article — link in first comment\n\n#Nigeria #NigeriaNews #ThePlatform ${tag}`.trim()
}

async function gql(query: string, variables: Record<string, unknown>) {
  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) throw new Error('BUFFER_ACCESS_TOKEN not set')

  const res = await fetch(BUFFER_GRAPHQL, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

interface PostResult { success: boolean; id?: string; error?: string }

async function createPost(
  channelId: string,
  text: string,
  linkUrl: string,
  linkTitle: string,
  linkDescription: string,
  imageUrl?: string,
  metadata?: Record<string, unknown>,
  firstComment?: string,
): Promise<PostResult> {
  try {
    const assets = imageUrl
      ? [{ image: { url: imageUrl, thumbnailUrl: imageUrl } }]
      : [{ link: { url: linkUrl, title: linkTitle, description: linkDescription } }]

    const data = await gql(CREATE_POST, {
      input: {
        channelId,
        text,
        schedulingType: 'automatic',
        mode:           'shareNow',
        assets,
        ...(metadata     ? { metadata }                           : {}),
        ...(firstComment ? { firstComment: { text: firstComment } } : {}),
        saveToDraft:    false,
      },
    })

    const result = data.createPost
    if (result?.post?.id) return { success: true, id: result.post.id }
    return { success: false, error: result?.message ?? 'Unknown Buffer error' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function postToSocial(options: BufferPostOptions): Promise<{
  facebook?:  PostResult
  instagram?: PostResult
  twitter?:   PostResult
}> {
  const results: Record<string, PostResult> = {}
  const tasks: Promise<void>[] = []

  const fbChannelId = process.env.BUFFER_FACEBOOK_CHANNEL_ID
  const igChannelId = process.env.BUFFER_INSTAGRAM_CHANNEL_ID
  const twChannelId = process.env.BUFFER_TWITTER_CHANNEL_ID

  if (fbChannelId) {
    tasks.push(
      createPost(fbChannelId, facebookText(options), options.url, options.title, options.excerpt, options.imageUrl, { facebook: { type: 'post' } })
        .then((r) => { results.facebook = r })
    )
  }

  if (igChannelId) {
    if (options.instagramImageUrl) {
      tasks.push(
        createPost(igChannelId, instagramCaption(options), options.url, options.title, options.excerpt, options.instagramImageUrl, { instagram: { type: 'post', shouldShareToFeed: true } }, options.url)
          .then((r) => { results.instagram = r })
      )
    } else {
      results.instagram = { success: false, error: 'Skipped — Instagram requires an instagramImageUrl' }
    }
  }

  if (twChannelId) {
    // Twitter: no image — avoids file size limit and works for all articles
    tasks.push(
      createPost(twChannelId, twitterText(options), options.url, options.title, options.excerpt, undefined)
        .then((r) => { results.twitter = r })
    )
  }

  await Promise.all(tasks)
  return results
}
