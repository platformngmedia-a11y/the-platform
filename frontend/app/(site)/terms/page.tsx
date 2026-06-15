import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | The Platform',
  description: 'The Platform terms of service — legal terms and conditions for using our website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-ink mb-8">Terms of Service</h1>

      <div className="prose max-w-none space-y-8 text-ink">
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">1. Acceptance of Terms</h2>
          <p className="text-lg text-muted leading-relaxed">
            By accessing and using theplatformng.com ("Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">2. Use License</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on The Platform's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-muted">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">3. Disclaimer</h2>
          <p className="text-lg text-muted leading-relaxed">
            The materials on The Platform's website are provided on an 'as is' basis. The Platform makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">4. Limitations</h2>
          <p className="text-lg text-muted leading-relaxed">
            In no event shall The Platform or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Platform's website, even if The Platform or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">5. Accuracy of Materials</h2>
          <p className="text-lg text-muted leading-relaxed">
            The materials appearing on The Platform's website could include technical, typographical, or photographic errors. The Platform does not warrant that any of the materials on the website are accurate, complete, or current. The Platform may make changes to the materials contained on the website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">6. Links</h2>
          <p className="text-lg text-muted leading-relaxed">
            The Platform has not reviewed all of the sites linked to the website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Platform of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">7. Modifications</h2>
          <p className="text-lg text-muted leading-relaxed">
            The Platform may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">8. Governing Law</h2>
          <p className="text-lg text-muted leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in Nigeria.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">9. Contact</h2>
          <p className="text-lg text-muted leading-relaxed">
            For any questions about these Terms of Service, please contact us at:
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
