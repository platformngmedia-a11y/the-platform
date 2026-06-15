import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About The Platform | Nigerian Journalism',
  description: 'Meet the team behind The Platform — dependable, factual journalism for Nigeria.',
  openGraph: {
    title: 'About The Platform',
    description: 'Dependable. True. Engaging. — Nigerian journalism you can trust.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-black text-navy mb-6 leading-tight">
          About The Platform
        </h1>
        <p className="text-lg text-muted max-w-2xl mb-8">
          The Platform is Nigeria's home of dependable, factual journalism. We're committed to providing readers with accurate, well-sourced news that helps them make informed decisions.
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

      {/* Editorial standards */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
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

          <div>
            <h3 className="text-lg font-bold text-ink mb-3">Corrections Policy</h3>
            <p className="text-muted leading-relaxed">
              When we get something wrong, we fix it immediately and transparently. Corrections are published prominently at the top of articles and logged in our <a href="#corrections" className="text-navy font-bold hover:underline">corrections archive</a>.
            </p>
            <p className="text-sm text-muted mt-4">
              Found an error? <a href="mailto:corrections@theplatformng.com" className="text-navy font-bold hover:underline">Contact our corrections desk</a>
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
      <section className="bg-paper">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-navy mb-8">Get in Touch</h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-bold text-ink mb-2">Tips & Story Ideas</h3>
              <a href="mailto:tips@theplatformng.com" className="text-navy hover:underline text-sm">
                tips@theplatformng.com
              </a>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Corrections</h3>
              <a href="mailto:corrections@theplatformng.com" className="text-navy hover:underline text-sm">
                corrections@theplatformng.com
              </a>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">General Inquiries</h3>
              <a href="mailto:hello@theplatformng.com" className="text-navy hover:underline text-sm">
                hello@theplatformng.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
