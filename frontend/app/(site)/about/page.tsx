import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'
import { AuthorBadge } from '@/components/AuthorBadge'

export const metadata: Metadata = {
  title: 'About The Platform & Editorial Masthead | Nigerian Journalism',
  description: 'Meet the editorial leadership, verification desk, and journalistic standards behind The Platform (theplatformng.com).',
  openGraph: {
    title: 'About The Platform & Editorial Masthead',
    description: 'Dependable. True. Engaging. — Nigerian journalism you can trust.',
    type: 'website',
  },
}

const allAuthorsMastheadQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id, name, slug, role, bio, email, credibilityBadge, isVerifiedJournalist, expertise
  }
`

const defaultEditorialDesks = [
  {
    name: 'Editorial Board & Managing Desk',
    role: 'Editorial Leadership',
    bio: 'Oversees newsroom independence, verification protocols, and public-interest reporting across all national and economic beats.',
    email: 'hello@theplatformng.com',
    credibilityBadge: 'senior',
  },
  {
    name: 'Politics, Economy & Policy Desk',
    role: 'News Analysis & Reporting',
    bio: 'Synthesizes primary data from the CBN, NBS, National Assembly, and official statements to explain policies shaping Nigeria.',
    email: 'tips@theplatformng.com',
    credibilityBadge: 'verified',
  },
  {
    name: 'Verification & Fact-Check Desk',
    role: 'Public Accountability Unit',
    bio: 'Investigates viral claims and statements by public officials using transparent methodology and primary-source evidence.',
    email: 'corrections@theplatformng.com',
    credibilityBadge: 'verified',
  },
]

export default async function AboutPage() {
  let authors: any[] = []
  try {
    authors = await client.fetch(allAuthorsMastheadQuery, {}, { next: { revalidate: 3600 } })
  } catch {
    authors = []
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <p className="text-xs font-black uppercase tracking-widest text-gold mb-2">
          The Platform Media Ltd • Founded 2023
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-navy mb-6 leading-tight">
          About The Platform
        </h1>
        <p className="text-lg text-muted max-w-2xl mb-8">
          The Platform (<span className="font-semibold text-ink">theplatformng.com</span>) is Nigeria&apos;s home of dependable, factual journalism. We&apos;re committed to providing readers with accurate, well-sourced news that helps them make informed decisions.
        </p>
      </section>

      {/* Mission section */}
      <section className="bg-paper">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-navy mb-6">Our Mission</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-ink mb-3">Dependable</h3>
              <p className="text-muted leading-relaxed">
                Every story is fact-checked and sourced. We verify information before publishing and correct errors transparently.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink mb-3">True</h3>
              <p className="text-muted leading-relaxed">
                We prioritize accuracy over speed. Our reporting reflects verified facts, not rumors or speculation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink mb-3">Engaging</h3>
              <p className="text-muted leading-relaxed">
                Complex issues deserve clear explanation. We make important stories accessible to all readers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink mb-3">Transparent</h3>
              <p className="text-muted leading-relaxed">
                We link to sources, disclose corrections, and explain our editorial process openly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Masthead Section (#masthead) */}
      <section id="masthead" className="max-w-4xl mx-auto px-4 py-16 sm:py-20 border-b border-line scroll-mt-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-navy mb-3">Editorial Masthead &amp; Newsroom Desks</h2>
          <p className="text-muted leading-relaxed">
            Operated by <strong>The Platform Media Ltd</strong> (registered in Nigeria), our newsroom operates independently of commercial and political interests.
          </p>
        </div>

        {authors && authors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            {authors.map((author: any) => (
              <div key={author._id} className="rounded-xl border border-line bg-paper p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-ink">
                      {author.slug?.current ? (
                        <a href={`/author/${author.slug.current}`} className="hover:text-navy hover:underline">
                          {author.name}
                        </a>
                      ) : (
                        author.name
                      )}
                    </h3>
                    <AuthorBadge author={author} />
                  </div>
                  {author.role && <p className="text-xs font-semibold uppercase tracking-wider text-navy mb-2">{author.role}</p>}
                  {author.bio && <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{author.bio}</p>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-line text-xs">
                  {author.email ? (
                    <a href={`mailto:${author.email}`} className="text-navy hover:underline">
                      {author.email}
                    </a>
                  ) : (
                    <span className="text-muted">The Platform Newsroom</span>
                  )}
                  {author.slug?.current && (
                    <a href={`/author/${author.slug.current}`} className="font-bold text-navy hover:underline">
                      View Profile →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          {defaultEditorialDesks.map((desk) => (
            <div key={desk.name} className="rounded-xl border border-line bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <AuthorBadge author={desk} />
                </div>
                <h3 className="text-base font-bold text-ink mb-1">{desk.name}</h3>
                <p className="text-xs font-semibold text-navy mb-2">{desk.role}</p>
                <p className="text-xs text-muted leading-relaxed mb-4">{desk.bio}</p>
              </div>
              <a href={`mailto:${desk.email}`} className="text-xs font-semibold text-navy hover:underline pt-2 border-t border-line">
                {desk.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial standards */}
      <section id="standards" className="max-w-4xl mx-auto px-4 py-16 sm:py-24 scroll-mt-20">
        <h2 className="text-3xl font-bold text-navy mb-8">Editorial Standards</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-ink mb-3">How We Verify Facts</h3>
            <p className="text-muted leading-relaxed mb-4">
              Every story goes through our verification process:
            </p>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-3">
                <span className="text-navy font-bold">✓</span>
                <span>Primary sources: We contact officials, organizations, and individuals directly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-navy font-bold">✓</span>
                <span>Cross-checking: Multiple independent sources must confirm key facts</span>
              </li>
              <li className="flex gap-3">
                <span className="text-navy font-bold">✓</span>
                <span>Attribution: Every claim is sourced and linked where possible</span>
              </li>
              <li className="flex gap-3">
                <span className="text-navy font-bold">✓</span>
                <span>Context: We provide necessary background to help readers understand significance</span>
              </li>
            </ul>
          </div>

          <div id="corrections" className="scroll-mt-20">
            <h3 className="text-lg font-bold text-ink mb-3">Corrections Policy</h3>
            <p className="text-muted leading-relaxed">
              When we get something wrong, we fix it immediately and transparently. Corrections are published prominently at the top or bottom of articles with a timestamped explanation of what changed.
            </p>
            <p className="text-sm text-muted mt-4">
              Found an error? <a href="mailto:corrections@theplatformng.com" className="text-navy font-bold hover:underline">Contact our corrections desk (corrections@theplatformng.com)</a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink mb-3">Conflicts of Interest</h3>
            <p className="text-muted leading-relaxed">
              We disclose when journalists have conflicts of interest. Our editorial team operates independently from business and advertising decisions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink mb-3">Fact-Checking</h3>
            <p className="text-muted leading-relaxed">
              Our fact-check team verifies claims made by public figures, organizations, and viral claims. Read our latest fact-checks in the <a href="/fact-check" className="text-navy font-bold hover:underline">Fact Check section</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="bg-paper scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-navy mb-8">Get in Touch</h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-bold text-ink mb-2">Tips &amp; Story Ideas</h3>
              <a href="mailto:tips@theplatformng.com" className="text-navy hover:underline text-sm">
                tips@theplatformng.com
              </a>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Corrections Desk</h3>
              <a href="mailto:corrections@theplatformng.com" className="text-navy hover:underline text-sm">
                corrections@theplatformng.com
              </a>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">General &amp; Advertising</h3>
              <a href="mailto:hello@theplatformng.com" className="text-navy hover:underline text-sm">
                hello@theplatformng.com
              </a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-line text-sm text-muted">
            <p className="font-semibold text-ink">Corporate &amp; Editorial Office</p>
            <p>The Platform Media Ltd • Lagos, Nigeria (Registered in Nigeria)</p>
          </div>
        </div>
      </section>
    </main>
  )
}
