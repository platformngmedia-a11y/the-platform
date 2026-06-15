import { Rss, Globe, Link2, Mail } from 'lucide-react'

export function SiteFooter({ categories }: { categories: any[] }) {
  const social = [
    { Icon: Globe,  href: '#', label: 'Website' },
    { Icon: Mail,   href: '#', label: 'Email' },
    { Icon: Link2,  href: '#', label: 'Links' },
    { Icon: Rss,    href: '#', label: 'RSS Feed' },
  ]

  return (
    <footer className="bg-ink text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <p className="text-white font-black text-xl tracking-tight mb-1">THE PLATFORM</p>
            <p className="text-gold text-xs font-semibold mb-4">Dependable. True. Engaging.</p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              The Platform is Nigeria's home of trustworthy journalism. We exist to help citizens
              engage with the news and make informed decisions that shape their lives and communities.
            </p>
            <div className="flex gap-3 mt-6">
              {social.map(({ Icon, href, label }, i) => (
                <a key={i} href={href} aria-label={label} className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Sections</h4>
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
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Editorial Standards', href: '/about#standards' },
                { label: 'Advertise with Us', href: '#' },
                { label: 'Contact the Newsroom', href: '/about#contact' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-gold transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} The Platform Media Ltd. All rights reserved. Registered in Nigeria.</p>
          <p className="text-gold/60">Committed to truth, accountability and the Nigerian public interest.</p>
        </div>
      </div>
    </footer>
  )
}