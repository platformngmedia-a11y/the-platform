import { Mail, Facebook, Instagram, Twitter, MapPin, Phone } from 'lucide-react'

export function SiteFooter({ categories }: { categories: any[] }) {
  const social = [
    { Icon: Mail,       href: 'mailto:platformngmedia@gmail.com', label: 'Email',      title: 'platformngmedia@gmail.com' },
    { Icon: Facebook,   href: 'https://www.facebook.com/profile.php?id=61589626771382', label: 'Facebook', title: 'The Platform' },
    { Icon: Instagram,  href: 'https://www.instagram.com/the_platform26/', label: 'Instagram', title: '@the_platform26' },
    { Icon: Twitter,    href: 'https://x.com/The_platform01', label: 'Twitter/X', title: '@The_platform01' },
  ]

  return (
    <footer className="bg-ink text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* THE PLATFORM SECTION */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <p className="text-white font-black text-xl tracking-tight mb-1">THE PLATFORM</p>
              <p className="text-gold text-xs font-semibold mb-4">Dependable. True. Engaging.</p>
            </div>

            {/* Mission Statement */}
            <div className="mb-6">
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                The Platform is Nigeria's home of trustworthy journalism. We exist to help citizens engage with the news and make informed decisions that shape their lives and communities.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Founded in 2023, we are committed to delivering dependable, fact-checked journalism that meets international standards while serving Nigerian audiences across all devices.
              </p>
            </div>

            {/* Company Info */}
            <div className="space-y-2 mb-6 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="flex-shrink-0 mt-0.5 text-gold" />
                <div>
                  <p className="text-gray-300">Nigeria</p>
                  <p>Serving 100K+ readers daily</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0 text-gold" />
                <a href="mailto:platformngmedia@gmail.com" className="text-gray-300 hover:text-gold transition-colors">
                  platformngmedia@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {social.map(({ Icon, href, label, title }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  title={title}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* SECTIONS */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">News</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Nigeria',            href: '/category/nigeria' },
                { label: 'Politics',           href: '/category/politics' },
                { label: 'Economy',            href: '/category/economy' },
                { label: 'World',              href: '/category/world' },
                { label: 'Opinion & Analysis', href: '/opinion' },
                { label: 'Fact Check',         href: '/fact-check' },
                { label: 'Sport',              href: '/category/sport' },
              ].map(link => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-gold transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <div className="space-y-4">
              {/* Main Links */}
              <div>
                <h5 className="text-gray-300 font-semibold text-xs uppercase tracking-wider mb-2.5">Company</h5>
                <ul className="space-y-1.5 text-sm">
                  {[
                    { label: 'About Us', href: '/about' },
                    { label: 'Editorial Standards', href: '/about#standards' },
                    { label: 'Contact Newsroom', href: '/about#contact' },
                  ].map(item => (
                    <li key={item.label}>
                      <a href={item.href} className="hover:text-gold transition-colors">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h5 className="text-gray-300 font-semibold text-xs uppercase tracking-wider mb-2.5">Legal</h5>
                <ul className="space-y-1.5 text-sm">
                  {[
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Cookie Policy', href: '/cookies' },
                  ].map(item => (
                    <li key={item.label}>
                      <a href={item.href} className="hover:text-gold transition-colors">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business */}
              <div>
                <h5 className="text-gray-300 font-semibold text-xs uppercase tracking-wider mb-2.5">Business</h5>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <a href="/advertise" className="hover:text-gold transition-colors">Advertise with Us</a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/profile.php?id=61589626771382" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Media Kit</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-gray-800 pt-8">
          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-800">
            <div>
              <h5 className="text-gold text-xs font-bold uppercase tracking-wider mb-2">Our Commitment</h5>
              <p className="text-xs text-gray-500">We are committed to accuracy, fairness, and independence in all our reporting.</p>
            </div>
            <div>
              <h5 className="text-gold text-xs font-bold uppercase tracking-wider mb-2">Verification First</h5>
              <p className="text-xs text-gray-500">Every story is fact-checked against multiple sources before publication.</p>
            </div>
            <div>
              <h5 className="text-gold text-xs font-bold uppercase tracking-wider mb-2">Corrections</h5>
              <p className="text-xs text-gray-500">We transparently publish corrections when errors are discovered.</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
            <div>
              <p className="font-semibold text-gray-400 mb-1">© {new Date().getFullYear()} The Platform Media Ltd.</p>
              <p>All rights reserved. Registered in Nigeria.</p>
            </div>
            <p className="text-gold/70 text-center sm:text-right">
              Committed to truth, accountability and the Nigerian public interest.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}