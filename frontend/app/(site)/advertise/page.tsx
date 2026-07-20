import type { Metadata } from 'next'
import { Mail, ShieldCheck, Smartphone, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Advertise With Us | The Platform',
  description: 'Reach engaged Nigerian audiences. Advertising opportunities at The Platform — Nigeria\'s trusted news source.',
}

export default function AdvertisePage() {
  const packages = [
    {
      name: 'Starter',
      price: 'Custom',
      description: 'Perfect for emerging brands',
      features: [
        'Article sponsorship',
        'Social media promotion',
        ' 2-week campaign',
        'Basic analytics',
      ],
    },
    {
      name: 'Professional',
      price: 'Custom',
      description: 'For established brands',
      features: [
        'Premium ad placements',
        'Newsletter integration',
        '4-week campaign',
        'Detailed reporting',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Customized solutions',
      features: [
        'Custom campaign design',
        'Multi-channel promotion',
        'Ongoing support',
        'Full analytics suite',
      ],
    },
  ]

  const commitments = [
    { icon: Target, label: 'Nigerian-focused audience' },
    { icon: Smartphone, label: 'Mobile-first readership' },
    { icon: ShieldCheck, label: 'Brand-safe editorial standards' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-navy-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Advertise With The Platform</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Reach engaged Nigerian audiences with authentic, trust-first advertising. Your brand deserves credible placement.
          </p>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="text-center">
                <Icon size={40} className="mx-auto text-navy mb-4" />
                <p className="text-lg font-semibold text-ink">{item.label}</p>
              </div>
            )
          })}
        </div>
        <p className="text-center text-muted text-sm mt-8">
          Request our media kit for current traffic and audience data —{' '}
          <a href="mailto:platformngmedia@gmail.com?subject=Media%20Kit%20Request" className="text-navy underline">
            get in touch
          </a>.
        </p>
      </section>

      {/* Why Advertise */}
      <section className="bg-paper py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-ink mb-12 text-center">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Trusted Audience',
                description: 'Our readers value credibility. Your brand benefits from our editorial trust.',
              },
              {
                title: 'Nigerian Focus',
                description: 'Reach 90% Nigerian audience actively engaged with quality journalism.',
              },
              {
                title: 'Mobile-First',
                description: 'Over 85% mobile traffic. Your ads reach people where they are.',
              },
              {
                title: 'Transparent Metrics',
                description: 'Get detailed analytics on impressions, clicks, and engagement.',
              },
              {
                title: 'Brand Safety',
                description: 'Your ads appear alongside quality editorial content and fact-checked reporting.',
              },
              {
                title: 'Premium Placements',
                description: 'Above-the-fold positions on high-traffic sections and category pages.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-line">
                <h3 className="text-lg font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-ink mb-4 text-center">Advertising Packages</h2>
        <p className="text-center text-muted mb-12 max-w-2xl mx-auto">
          All packages are customizable. Let's build a campaign that works for your brand.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-lg border-2 p-8 ${
                i === 1
                  ? 'border-navy bg-navy/5'
                  : 'border-line'
              }`}
            >
              <h3 className="text-2xl font-bold text-ink mb-2">{pkg.name}</h3>
              <p className="text-navy font-bold text-lg mb-4">{pkg.price}</p>
              <p className="text-muted text-sm mb-6">{pkg.description}</p>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-ink">
                    <span className="w-1.5 h-1.5 bg-navy rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Reach Nigerian Audiences?</h2>
          <p className="text-lg text-gray-200 mb-8">
            Let's talk about your advertising goals. Our team is ready to create the perfect campaign for your brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:platformngmedia@gmail.com?subject=Advertising%20Inquiry"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-navy rounded-lg font-semibold hover:bg-gold/90 transition-colors"
            >
              <Mail size={20} />
              Send Inquiry
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61589626771382"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/50"
            >
              Message on Facebook
            </a>
          </div>

          <p className="text-gray-300 text-sm mt-6">
            Email: <a href="mailto:platformngmedia@gmail.com" className="text-gold hover:underline">platformngmedia@gmail.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
