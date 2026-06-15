import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | The Platform',
  description: 'The Platform cookie policy — information about cookies and how we use them.',
}

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-ink mb-8">Cookie Policy</h1>

      <div className="prose max-w-none space-y-8 text-ink">
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">1. What Are Cookies?</h2>
          <p className="text-lg text-muted leading-relaxed">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They help websites function and provide information to the website owners about how their site is being used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">2. How We Use Cookies</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            The Platform uses cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li><strong>Essential Cookies:</strong> Required for the website to function (login, security)</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
            <li><strong>Preference Cookies:</strong> Remember your choices (dark mode, language)</li>
            <li><strong>Analytics Cookies:</strong> Collect anonymous data about site usage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">3. Types of Cookies We Use</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-ink mb-2">Essential Cookies (Always Active)</h3>
              <p className="text-lg text-muted">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink mb-2">Dark Mode Preference</h3>
              <p className="text-lg text-muted">
                We store your dark/light mode preference in localStorage to remember your choice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink mb-2">Bookmarks (localStorage)</h3>
              <p className="text-lg text-muted">
                Your reading list is stored locally in your browser. We do not store this data on our servers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink mb-2">Analytics</h3>
              <p className="text-lg text-muted">
                We may use third-party analytics services to understand how our website is used. These are anonymized and do not identify individuals.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">4. Your Privacy & Cookie Control</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            You can control cookies through your browser settings:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Privacy → Cookies and other site data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">5. Local Storage vs. Cookies</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            We use browser localStorage for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li>Dark mode preference (theplatform_dark_mode)</li>
            <li>Reading list bookmarks (theplatform_bookmarks)</li>
          </ul>
          <p className="text-lg text-muted leading-relaxed mt-4">
            This data stays on YOUR device and is never sent to our servers. You can clear it anytime by clearing your browser cache.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">6. Third-Party Cookies</h2>
          <p className="text-lg text-muted leading-relaxed">
            Our website may contain links to third-party websites. The Platform is not responsible for the cookie practices of external sites. Please review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">7. Changes to This Policy</h2>
          <p className="text-lg text-muted leading-relaxed">
            The Platform may update this Cookie Policy from time to time. We recommend you review this policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">8. Contact Us</h2>
          <p className="text-lg text-muted leading-relaxed">
            If you have questions about our use of cookies, please contact:
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
