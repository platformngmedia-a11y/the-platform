'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { SearchModal } from './SearchModal'

export function SiteHeader({ categories }: { categories: any[] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navLinks = [
    { label: 'Home',       href: '/' },
    { label: 'Nigeria',    href: '/category/nigeria' },
    { label: 'Politics',   href: '/category/politics' },
    { label: 'Economy',    href: '/category/economy' },
    { label: 'World',      href: '/category/world' },
    { label: 'Opinion',    href: '/opinion' },
    { label: 'Fact Check', href: '/fact-check' },
    { label: 'Sport',      href: '/category/sport' },
    { label: 'Technology', href: '/category/technology' },
    ...(categories ?? [])
      .filter(c => !['nigeria','politics','economy','world','sport','technology'].includes(c.slug.current))
      .slice(0, 3)
      .map(c => ({ label: c.title, href: `/category/${c.slug.current}` })),
  ]

  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e3dc', position: 'sticky', top: 0, zIndex: 50 }}>

      {/* Identity strip */}
      <div style={{ backgroundColor: '#1a3a5c' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '20px', fontWeight: 900, color: 'white', textDecoration: 'none', letterSpacing: '-0.5px' }}>THE PLATFORM</a>
          <a href="/newsletter" style={{ backgroundColor: '#c8a84b', color: '#1c1c1e', fontSize: '12px', fontWeight: 700, padding: '6px 16px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Subscribe</a>
        </div>
      </div>

      {/* Nav row */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>

        {/* Nav links + buttons row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>

          {/* Nav links - scrollable */}
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', flex: 1, scrollbarWidth: 'none', minWidth: 0 }}>
            {navLinks.map(link => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <a key={link.href} href={link.href} style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: active ? '2px solid #1a3a5c' : '2px solid transparent', color: active ? '#1a3a5c' : '#6b7280', textDecoration: 'none', display: 'block' }}>
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Search and menu buttons */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 60 }}>
            <button
              type="button"
              onPointerDown={(e) => { e.stopPropagation(); setSearchOpen(o => !o) }}
              style={{ padding: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <Search size={18} />
            </button>
            {/* Hamburger - visible only on mobile via Tailwind */}
            <button
              type="button"
              className="flex md:hidden"
              onPointerDown={(e) => { e.stopPropagation(); setMobileOpen(o => !o) }}
              style={{ padding: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Mobile menu dropdown - visible only on mobile */}
        {mobileOpen && (
          <div className="block md:hidden" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #e5e3dc' }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', fontSize: '14px', fontWeight: 500, color: '#1c1c1e', textDecoration: 'none', borderRadius: '8px', display: 'block' }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}