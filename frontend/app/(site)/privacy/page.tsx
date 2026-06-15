import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Platform',
  description: 'The Platform privacy policy — how we handle your data and protect your privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-ink mb-8">Privacy Policy</h1>

      <div className="prose max-w-none space-y-8 text-ink">
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">1. Introduction</h2>
          <p className="text-lg text-muted leading-relaxed">
            The Platform ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you visit our website, theplatformng.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">2. Information We Collect</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">We collect information in the following ways:</p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li><strong>Device Information:</strong> Browser type, IP address, device type</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, search queries</li>
            <li><strong>Bookmarks:</strong> Stored locally in your browser (not sent to us)</li>
            <li><strong>Voluntary:</strong> Email addresses when you subscribe to newsletters</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">3. How We Use Your Information</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">We use collected information to:</p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li>Improve our website and services</li>
            <li>Send newsletters (only with your consent)</li>
            <li>Analyze usage patterns and trends</li>
            <li>Ensure website security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">4. Cookies & Tracking</h2>
          <p className="text-lg text-muted leading-relaxed">
            We use cookies for essential functionality and analytics. Your dark mode preference and bookmarks are stored locally in your browser — we do not store personal data on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">5. Data Protection</h2>
          <p className="text-lg text-muted leading-relaxed">
            We implement industry-standard security measures to protect your information. However, no method of transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">6. Third-Party Services</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li><strong>Vercel:</strong> Hosting and deployment</li>
            <li><strong>Sanity:</strong> Content management</li>
            <li><strong>Cloudflare:</strong> CDN and security</li>
          </ul>
          <p className="text-lg text-muted leading-relaxed mt-4">
            These services have their own privacy policies governing their data practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">7. Your Rights</h2>
          <p className="text-lg text-muted leading-relaxed">
            You have the right to access, correct, or delete your personal information. Contact us at platformngmedia@gmail.com to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">8. Contact Us</h2>
          <p className="text-lg text-muted leading-relaxed">
            If you have questions about this Privacy Policy, contact us at:
          </p>
          <p className="text-lg font-semibold text-navy mt-4">
            <a href="mailto:platformngmedia@gmail.com" className="hover:underline">
              platformngmedia@gmail.com
            </a>
          </p>
        </section>

        <section>
          <p className="text-sm text-muted italic">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>
      </div>
    </div>
  )
}
