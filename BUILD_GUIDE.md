# The Platform — Complete Build Guide
> Recreate this news platform from scratch to live on Vercel + Sanity.studio

---

## Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v5 (Headless) |
| CMS Client | next-sanity v12 |
| Icons | lucide-react |
| Hosting | Vercel (frontend) + sanity.studio (CMS) |

---

## Prerequisites
- Node.js 20.x
- npm
- A [Sanity](https://sanity.io) account
- A [Vercel](https://vercel.com) account
- Vercel CLI: `npm install -g vercel`
- Sanity CLI: `npm install -g sanity`

---

## Part 1 — Sanity Project Setup

### 1.1 Create a Sanity project
Go to [sanity.io/manage](https://sanity.io/manage) and create a new project.
- Choose **"Blank"** template
- Dataset name: `production`
- Note your **Project ID** (e.g. `bqc8hyxn`)

### 1.2 Create API tokens
In your Sanity project dashboard → **API** → **Tokens**:

| Token | Permissions | Used for |
|---|---|---|
| `read-token` | Viewer | Server-side data fetching |
| `write-token` | Editor | Draft mode + newsletter writes |

### 1.3 Set CORS origins
In **API** → **CORS Origins**, add:
```
http://localhost:3000        (with credentials)
https://your-vercel-url.vercel.app  (with credentials)
```

---

## Part 2 — Sanity Studio (Backend)

### 2.1 Scaffold the studio
```bash
mkdir studio && cd studio
npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production --template clean
```

### 2.2 Install additional packages
```bash
npm install @sanity/presentation
```

### 2.3 Environment variables
Create `studio/.env`:
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

### 2.4 Configure the CLI
Replace `sanity.cli.ts`:
```ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset:   process.env.SANITY_STUDIO_DATASET,
  },
  studioHost: 'your-studio-name', // becomes your-studio-name.sanity.studio
})
```

### 2.5 Configure the studio
Replace `sanity.config.ts`:
```ts
import { defineConfig }      from 'sanity'
import { structureTool }    from 'sanity/structure'
import { visionTool }       from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes }      from './schemaTypes'

const FRONTEND_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000'

export default defineConfig({
  name:      'the-platform',
  title:     'The Platform — Newsroom',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset:   process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: FRONTEND_URL,
        draftMode: {
          enable: `${FRONTEND_URL}/api/draft-mode/enable`,
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
})
```

### 2.6 Create schema types

Create `schemaTypes/author.ts`:
```ts
import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author', title: 'Author', type: 'document',
  fields: [
    defineField({ name: 'name',    type: 'string',  validation: R => R.required() }),
    defineField({ name: 'slug',    type: 'slug',    options: { source: 'name' } }),
    defineField({ name: 'image',   type: 'image',   options: { hotspot: true } }),
    defineField({ name: 'bio',     type: 'text' }),
    defineField({ name: 'role',    type: 'string',  title: 'Role / Beat' }),
    defineField({ name: 'twitter', type: 'url' }),
    defineField({ name: 'email',   type: 'string' }),
  ],
})
```

Create `schemaTypes/category.ts`:
```ts
import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category', title: 'Category', type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',        type: 'slug',   options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'order',       title: 'Nav order', type: 'number' }),
  ],
})
```

Create `schemaTypes/article.ts`:
```ts
import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article', title: 'Article', type: 'document',
  fields: [
    defineField({ name: 'title',      type: 'string',   validation: R => R.required() }),
    defineField({ name: 'slug',       type: 'slug',     options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt',    type: 'text',     rows: 3, validation: R => R.required() }),
    defineField({
      name: 'mainImage', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: R => R.required() })],
    }),
    defineField({ name: 'categories',    type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
    defineField({ name: 'tags',          type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'author',        type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt',   type: 'datetime', validation: R => R.required() }),
    defineField({ name: 'isBreaking',    title: 'Breaking news?',         type: 'boolean', initialValue: false }),
    defineField({ name: 'isFeatured',    title: 'Featured (lead story)?', type: 'boolean', initialValue: false }),
    defineField({ name: 'isEditorsPick', title: "Editor's pick?",         type: 'boolean', initialValue: false }),
    defineField({ name: 'readingTime',   title: 'Reading time (minutes)', type: 'number' }),
    defineField({
      name: 'body', type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image', options: { hotspot: true },
          fields: [
            defineField({ name: 'alt',     type: 'string' }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        },
        {
          type: 'object', name: 'callout', title: 'Callout box',
          fields: [
            defineField({ name: 'text', type: 'text' }),
            defineField({ name: 'type', type: 'string', options: { list: ['info', 'warning', 'quote'] } }),
          ],
        },
      ],
    }),
    defineField({ name: 'seoTitle',       type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'mainImage', isBreaking: 'isBreaking', isFeatured: 'isFeatured' },
    prepare({ title, author, media, isBreaking, isFeatured }) {
      const flags = [isBreaking && '🔴', isFeatured && '⭐'].filter(Boolean).join(' ')
      return { title: flags ? `${flags} ${title}` : title, subtitle: author, media }
    },
  },
})
```

Create `schemaTypes/factCheck.ts`:
```ts
import { defineType, defineField } from 'sanity'

const VERDICTS = [
  { title: '✅ True',           value: 'true' },
  { title: '🟡 Partly True',    value: 'partly-true' },
  { title: '❌ False',          value: 'false' },
  { title: '⚠️ Misleading',    value: 'misleading' },
  { title: '❓ Unverifiable',  value: 'unverifiable' },
]

export const factCheck = defineType({
  name: 'factCheck', title: 'Fact Check', type: 'document',
  fields: [
    defineField({ name: 'claim',      title: 'Claim being checked', type: 'string',   validation: R => R.required() }),
    defineField({ name: 'slug',       type: 'slug', options: { source: 'claim' },     validation: R => R.required() }),
    defineField({ name: 'claimant',   title: 'Who made the claim?', type: 'string' }),
    defineField({ name: 'claimedOn',  type: 'date' }),
    defineField({ name: 'verdict',    type: 'string', options: { list: VERDICTS },    validation: R => R.required() }),
    defineField({ name: 'summary',    title: 'One-paragraph verdict summary', type: 'text' }),
    defineField({ name: 'body',       type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'sources',    title: 'Reference links', type: 'array', of: [{ type: 'url' }] }),
    defineField({ name: 'checkedBy',  type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt',type: 'datetime' }),
    defineField({ name: 'isFeatured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { claim: 'claim', verdict: 'verdict' },
    prepare({ claim, verdict }) {
      const emoji = VERDICTS.find(v => v.value === verdict)?.title.split(' ')[0] ?? '❓'
      return { title: `${emoji} ${claim}` }
    },
  },
})
```

Create `schemaTypes/opinion.ts`:
```ts
import { defineType, defineField } from 'sanity'

export const opinion = defineType({
  name: 'opinion', title: 'Opinion / Analysis', type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string',   validation: R => R.required() }),
    defineField({ name: 'slug',        type: 'slug',     options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt',     type: 'text',     rows: 2 }),
    defineField({ name: 'author',      type: 'reference', to: [{ type: 'author' }], validation: R => R.required() }),
    defineField({ name: 'mainImage',   type: 'image',    options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'isFeatured',  type: 'boolean',  initialValue: false }),
    defineField({ name: 'body',        type: 'array',    of: [{ type: 'block' }] }),
    defineField({ name: 'categories',  type: 'array',    of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
  ],
})
```

Create `schemaTypes/index.ts`:
```ts
import { article }   from './article'
import { category }  from './category'
import { author }    from './author'
import { factCheck } from './factCheck'
import { opinion }   from './opinion'

export const schemaTypes = [article, category, author, factCheck, opinion]
```

### 2.7 Run the studio locally
```bash
npm run dev
# → http://localhost:3333
```

---

## Part 3 — Next.js Frontend

### 3.1 Scaffold the app
```bash
npx create-next-app@latest frontend \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd frontend
```

### 3.2 Install dependencies
```bash
npm install next-sanity @sanity/image-url lucide-react date-fns \
  @portabletext/react
```

### 3.3 Environment variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=your_read_token
SANITY_API_WRITE_TOKEN=your_write_token
SANITY_WEBHOOK_SECRET=any_random_secret
NEXT_PUBLIC_SITE_NAME=The Platform
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_TAGLINE=Dependable. True. Engaging.
```

### 3.4 Next.js config
Replace `next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}

export default nextConfig
```

### 3.5 Sanity client utilities

Create `lib/sanity/client.ts`:
```ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
})

export const writeClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
```

Create `lib/sanity/image.ts`:
```ts
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)
export const urlForImage = (source: any) => builder.image(source)
```

Create `lib/sanity/live.ts`:
```ts
import { defineLive } from 'next-sanity/live'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ useCdn: false }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: false,
})
```

### 3.6 GROQ queries
Create `lib/sanity/queries.ts`:
```ts
import { groq } from 'next-sanity'

export const articleFields = groq`
  _id, title, slug, excerpt, publishedAt, readingTime,
  isBreaking, isFeatured, isEditorsPick, tags,
  "author": author->{ name, slug, image, role },
  "categories": categories[]->{ title, slug },
  "mainImage": mainImage { asset->, alt }
`

export const featuredArticleQuery = groq`
  *[_type == "article" && isFeatured == true] | order(publishedAt desc)[0] {
    ${articleFields}
  }
`

export const latestArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc)[0...24] {
    ${articleFields}
  }
`

export const editorsPicksQuery = groq`
  *[_type == "article" && isEditorsPick == true] | order(publishedAt desc)[0...4] {
    ${articleFields}
  }
`

export const breakingNewsQuery = groq`
  *[_type == "article" && isBreaking == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, publishedAt
  }
`

export const featuredFactCheckQuery = groq`
  *[_type == "factCheck" && isFeatured == true] | order(publishedAt desc)[0] {
    _id, claim, slug, claimant, verdict, summary, publishedAt,
    "checkedBy": checkedBy->{ name }
  }
`

export const allFactChecksQuery = groq`
  *[_type == "factCheck"] | order(publishedAt desc) {
    _id, claim, slug, claimant, verdict, summary, publishedAt,
    "checkedBy": checkedBy->{ name }
  }
`

export const featuredOpinionsQuery = groq`
  *[_type == "opinion"] | order(publishedAt desc)[0...6] {
    _id, title, slug, excerpt, publishedAt,
    "author": author->{ name, role, image },
    "mainImage": mainImage { asset->, alt }
  }
`

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id, title, slug, description
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${articleFields}, body, seoTitle, seoDescription
  }
`

export const articlesByCategoryQuery = groq`
  *[_type == "article" && $slug in categories[]->slug.current]
  | order(publishedAt desc) { ${articleFields} }
`

export const articlesByTagQuery = groq`
  *[_type == "article" && $tag in tags]
  | order(publishedAt desc)[0...20] { ${articleFields} }
`

export const factCheckBySlugQuery = groq`
  *[_type == "factCheck" && slug.current == $slug][0] {
    _id, claim, claimant, claimedOn, verdict, summary, body, sources, publishedAt,
    "checkedBy": checkedBy->{ name, role, image }
  }
`

export const opinionBySlugQuery = groq`
  *[_type == "opinion" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, publishedAt,
    "author": author->{ name, role, bio, image, twitter },
    "mainImage": mainImage { asset->, alt },
    "categories": categories[]->{ title, slug }
  }
`
```

### 3.7 Draft mode API routes

Create `app/api/draft-mode/enable/route.ts`:
```ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/lib/sanity/client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
```

Create `app/api/draft-mode/disable/route.ts`:
```ts
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const dm = await draftMode()
  dm.disable()
  const url = new URL(request.url)
  const redirect = url.searchParams.get('redirect') ?? '/'
  return NextResponse.redirect(new URL(redirect, request.url))
}
```

Create `app/api/revalidate/route.ts`:
```ts
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true })
}
```

### 3.8 Root layout
Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader }    from '@/components/SiteHeader'
import { SiteFooter }    from '@/components/SiteFooter'
import { BreakingBanner } from '@/components/BreakingBanner'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode }     from 'next/headers'
import { client }        from '@/lib/sanity/client'
import { breakingNewsQuery, allCategoriesQuery } from '@/lib/sanity/queries'

const inter = Inter({ subsets: ['latin'] })

const siteName = process.env.NEXT_PUBLIC_SITE_NAME    ?? 'The Platform'
const tagline  = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Dependable. True. Engaging.'

export const metadata: Metadata = {
  title:    { default: `${siteName} — ${tagline}`, template: `%s | ${siteName}` },
  description: `${siteName}: Nigeria's home of dependable, factual journalism.`,
  openGraph: { type: 'website', locale: 'en_NG', siteName },
  twitter:   { card: 'summary_large_image' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled
  const [breakingNews, categories] = await Promise.all([
    client.fetch(breakingNewsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(allCategoriesQuery, {}, { next: { revalidate: 3600 } }),
  ])
  return (
    <html lang="en">
      <body className={inter.className}>
        {breakingNews.length > 0 && <BreakingBanner items={breakingNews} />}
        <SiteHeader categories={categories} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter categories={categories} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
```

### 3.9 Homepage
Create `app/(site)/page.tsx`:
```tsx
import { client } from '@/lib/sanity/client'
import {
  featuredArticleQuery, latestArticlesQuery,
  featuredFactCheckQuery, featuredOpinionsQuery, editorsPicksQuery
} from '@/lib/sanity/queries'
import { ArticleCard }    from '@/components/ArticleCard'
import { FactCheckCard }  from '@/components/FactCheckCard'
import { OpinionCard }    from '@/components/OpinionCard'
import { NewsletterStrip } from '@/components/NewsletterStrip'

export const revalidate = 60

export default async function HomePage() {
  const featured = await client.fetch<any>(featuredArticleQuery)
  const [latest, factCheck, opinions, editorsPicks] = await Promise.all([
    client.fetch<any[]>(latestArticlesQuery),
    client.fetch<any>(featuredFactCheckQuery),
    client.fetch<any[]>(featuredOpinionsQuery),
    client.fetch<any[]>(editorsPicksQuery),
  ])
  // Top stories = latest 4 articles excluding the hero
  const topStories = latest.filter((a: any) => a._id !== featured?._id).slice(0, 4)

  return (
    <div>
      {/* Hero + Top Stories */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full lg:w-2/3 lg:border-r lg:border-line lg:pr-6">
            {featured && <ArticleCard article={featured} variant="hero" />}
          </div>
          <div className="w-full lg:w-1/3 lg:pl-2">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">
              Top Stories
            </h2>
            <div className="space-y-4">
              {topStories.map((a: any) => <ArticleCard key={a._id} article={a} variant="top" />)}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-line" />

      {/* Latest News + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-6">
                Latest News
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latest.slice(5, 14).map((a: any) => <ArticleCard key={a._id} article={a} />)}
              </div>
            </div>
            {factCheck && (
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">
                  Fact Check
                </h2>
                <FactCheckCard check={factCheck} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.slice(14, 23).map((a: any) => <ArticleCard key={a._id} article={a} />)}
            </div>
          </div>
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {opinions.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">
                    Opinion & Analysis
                  </h3>
                  <div className="space-y-1">
                    {opinions.slice(0, 4).map((op: any) => <OpinionCard key={op._id} opinion={op} />)}
                  </div>
                  <a href="/opinion" className="text-xs text-navy font-semibold hover:underline mt-3 inline-block">
                    View all opinion →
                  </a>
                </div>
              )}
              <NewsletterStrip variant="inline" />
              <div className="bg-paper border border-line rounded-lg h-60 flex items-center justify-center text-muted text-xs">
                Advertisement 300×250
              </div>
              {editorsPicks.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted border-b-2 border-navy pb-2 mb-4">
                    Editor's Picks
                  </h3>
                  <div className="space-y-4">
                    {editorsPicks.map((a: any) => <ArticleCard key={a._id} article={a} variant="editors" />)}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
      <NewsletterStrip variant="full" />
    </div>
  )
}
```

### 3.10 Key components to build

These components need to be created in `components/`. Each has its role:

| Component | Purpose |
|---|---|
| `ArticleCard.tsx` | Renders articles in 6 variants: `hero`, `top`, `grid`, `horizontal`, `minimal`, `editors` |
| `SiteHeader.tsx` | Sticky nav with logo, category links, search toggle, mobile menu |
| `SiteFooter.tsx` | Dark footer with section links, social links, newsletter |
| `BreakingBanner.tsx` | Scrolling ticker for breaking news articles |
| `NewsletterStrip.tsx` | Email signup, 3 variants: `full` (full-width), `compact`, `inline` |
| `FactCheckCard.tsx` | Displays fact-check with verdict badge (true/false/misleading etc.) |
| `OpinionCard.tsx` | Opinion piece with author avatar and headline |
| `TagBadge.tsx` | Clickable pill linking to `/tag/[tag]` |
| `CopyLinkButton.tsx` | Client component — copies article URL to clipboard |
| `CommentsSection.tsx` | Comments/discussion area per article |

#### ArticleCard variant guide
```
hero       → full image on top, large title below (used on homepage left)
top        → small thumbnail left + title/category right (sidebar list)
grid       → image on top, title below (default 3-col grid)
horizontal → medium thumbnail left, title right (related stories)
minimal    → no image, just title + meta (compact lists)
editors    → round EP badge + title (editor's picks)
```

### 3.11 Article detail page
Create `app/(site)/article/[slug]/page.tsx` — key structure:
```tsx
import { sanityFetch } from '@/lib/sanity/live'   // live data for draft mode
import { PortableText } from '@portabletext/react' // rich text renderer

// Fetch article + related articles in parallel
const [{ data: article }, { data: latest }] = await Promise.all([
  sanityFetch({ query: articleBySlugQuery, params: { slug } }),
  sanityFetch({ query: latestArticlesQuery }),
])

// PortableText components for body rendering:
// - type.image   → <figure> with next/image
// - type.callout → coloured callout box (info/warning/quote)
// - block.h2/h3  → styled headings
// - block.blockquote → styled blockquote
// - marks.link   → external link with noopener
```

### 3.12 Other pages to create

| Route | File | Data source |
|---|---|---|
| `/category/[slug]` | `app/(site)/category/[slug]/page.tsx` | `articlesByCategoryQuery` |
| `/tag/[tag]` | `app/(site)/tag/[tag]/page.tsx` | `articlesByTagQuery` |
| `/fact-check` | `app/(site)/fact-check/page.tsx` | `allFactChecksQuery` |
| `/opinion` | `app/(site)/opinion/page.tsx` | `featuredOpinionsQuery` |

### 3.13 Tailwind design tokens
Add to your `globals.css` or Tailwind config:
```css
/* Custom colour tokens used throughout */
--color-navy:   #1a2744;  /* primary brand / headings */
--color-gold:   #c9a84c;  /* accent / subscribe button */
--color-ink:    #1a1a2e;  /* body text */
--color-muted:  #6b7280;  /* secondary text */
--color-paper:  #f7f6f1;  /* card backgrounds */
--color-line:   #e5e3dc;  /* borders / dividers */
```

Category colour system (for `CategoryPill`):
```ts
const catColors = {
  Politics:   'bg-blue-50 text-blue-800',
  Economy:    'bg-amber-50 text-amber-800',
  Nigeria:    'bg-green-50 text-green-800',
  World:      'bg-purple-50 text-purple-800',
  Sport:      'bg-orange-50 text-orange-800',
  Technology: 'bg-sky-50 text-sky-800',
  Opinion:    'bg-gray-100 text-gray-700',
}
```

### 3.14 Run locally
```bash
npm run dev
# → http://localhost:3000
```

---

## Part 4 — Deployment

### 4.1 Deploy Sanity Studio
From the `studio/` directory:
```bash
npx sanity deploy
# → prompts for a subdomain → your-name.sanity.studio
```

After first deploy, Vercel saves an `appId`. Add it to `sanity.cli.ts`:
```ts
deployment: { appId: 'your_app_id_here' }
```

Future deploys: `npx sanity deploy` (no prompts).

### 4.2 Deploy frontend to Vercel

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Add `vercel.json` to frontend root:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

#### Set environment variables on Vercel
**Critical: use `printf` not `echo` to avoid trailing newlines breaking tokens.**

```bash
cd frontend

printf 'your_project_id'  | vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
printf 'production'        | vercel env add NEXT_PUBLIC_SANITY_DATASET production
printf '2024-01-01'        | vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
printf 'The Platform'      | vercel env add NEXT_PUBLIC_SITE_NAME production
printf 'your_tagline'      | vercel env add NEXT_PUBLIC_SITE_TAGLINE production
printf 'https://your-app.vercel.app' | vercel env add NEXT_PUBLIC_SITE_URL production
printf 'your_read_token'   | vercel env add SANITY_API_READ_TOKEN production
printf 'your_write_token'  | vercel env add SANITY_API_WRITE_TOKEN production
printf 'your_webhook_secret' | vercel env add SANITY_WEBHOOK_SECRET production
```

> ⚠️ **Always use `printf` not `echo`** — `echo` appends `\n` to the value which makes tokens and IDs invalid.

#### Deploy
```bash
vercel deploy --prod
```

The first deploy creates the project. Note the production URL.

#### Set Node.js version to 20.x
By default Vercel may detect Node 24.x which can cause build failures. Set it via the Vercel API or dashboard:
- Vercel Dashboard → Project → Settings → General → Node.js Version → 20.x

### 4.3 Post-deployment: add CORS origins
From the `studio/` directory:
```bash
npx sanity cors add https://your-app.vercel.app --credentials
```

Also add this in Sanity dashboard:
- manage.sanity.io → your project → API → CORS Origins
- Add `https://your-app.vercel.app` with credentials enabled

### 4.4 Set up the revalidation webhook
In Sanity dashboard → **API** → **Webhooks** → Add:
```
Name:    On publish revalidate
URL:     https://your-app.vercel.app/api/revalidate
Trigger: Create, Update, Delete (all document types)
Header:  x-webhook-secret: your_webhook_secret
```

---

## Part 5 — Content Setup

### Order of content creation in Studio
1. **Authors** — create journalist profiles first
2. **Categories** — add sections (Nigeria, Politics, Economy, World, Sport, Technology, Opinion, Fact Check)
3. **Articles** — publish articles, set `isFeatured=true` on your lead story
4. **Fact Checks** — add verified fact-check items
5. **Opinions** — add opinion/analysis pieces

### Homepage article flags
| Flag | Effect |
|---|---|
| `isFeatured = true` | Appears as the hero lead story |
| `isBreaking = true` | Shows in the breaking news ticker |
| `isEditorsPick = true` | Shows in Editor's Picks sidebar |

---

## Part 6 — Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Editor                          │
│   sanity.studio (Sanity Presentation Tool)  │
│   ← live preview of frontend in iframe      │
└──────────────┬──────────────────────────────┘
               │ creates/edits content
               ▼
┌─────────────────────────────────────────────┐
│         Sanity Content Lake                  │
│   (projectId: bqc8hyxn, dataset: production)│
│                                             │
│   Documents: article, factCheck, opinion,   │
│              author, category               │
└──────┬───────────────────┬──────────────────┘
       │ GROQ queries       │ webhook on publish
       ▼                   ▼
┌─────────────┐   ┌──────────────────────────┐
│ Next.js ISR │   │  /api/revalidate          │
│ (Vercel)    │   │  revalidatePath('/')      │
│             │   └──────────────────────────┘
│ Revalidate: │
│  / → 60s   │
│  pages → varies│
└─────────────────────────────────────────────┘
               │ serves
               ▼
┌─────────────────────────────────────────────┐
│              Reader                          │
│   https://your-app.vercel.app               │
└─────────────────────────────────────────────┘
```

### Data fetching strategy
| Context | Method | Why |
|---|---|---|
| Public pages (ISR) | `client.fetch()` with `{ next: { revalidate: N } }` | CDN-cached, fast |
| Article detail (live) | `sanityFetch()` from `next-sanity/live` | Respects draft mode |
| Draft preview | `sanityFetch()` with `serverToken` | Shows unpublished drafts |
| Client writes (newsletter) | `writeClient` | Needs write token |

---

## Quick Reference: Common Commands

```bash
# Studio
npm run dev          # local studio at :3333
npx sanity deploy    # deploy to sanity.studio

# Frontend
npm run dev          # local site at :3000
npm run build        # production build
vercel deploy --prod # deploy to Vercel

# Vercel env management
vercel env ls production           # list env vars
vercel env rm VAR_NAME production  # remove a var

# Sanity CORS
npx sanity cors list               # list allowed origins
npx sanity cors add https://url --credentials
```

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `projectId can only contain a-z, 0-9, dashes` | Env var has trailing `\n` from `echo` | Re-add with `printf` |
| `Configuration must contain projectId` | Env var not set on Vercel | Add env vars before deploying |
| `404 NOT_FOUND` on live site | CORS origin not added in Sanity | `npx sanity cors add https://your-url --credentials` |
| Vercel build `0ms` / Unexpected error | Wrong project linked (studio vs frontend) | `rm -rf .vercel && vercel deploy --prod` with new project name |
| `defineLive can only be used in React Server Components` | `browserToken` missing, client-side fallback throws | Set `browserToken: false` in `defineLive()` |
| Node version 24.x build failures | Vercel auto-detected latest Node | Set Node 20.x in Vercel Project Settings |
| Images not loading | `cdn.sanity.io` not in allowed domains | Add to `next.config.ts` `images.remotePatterns` |
| Top stories empty | All articles have `isFeatured: true` | Filter by `_id != $excludeId` in topStoriesQuery |
