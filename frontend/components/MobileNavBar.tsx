'use client'

import { useState } from 'react'
import { Home, Search, Bookmark, Menu, X } from 'lucide-react'
import { getBookmarkCount } from '@/lib/bookmarks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const pathname = usePathname()

  // Check if current page is home
  const isHome = pathname === '/'
  const isSearch = pathname.includes('/search')
  const isBookmarks = pathname === '/reading-list'

  const navItems = [
    { href: '/', icon: Home, label: 'Home', isActive: isHome },
    { href: '#search', icon: Search, label: 'Search', isActive: isSearch, onClick: () => {} },
    { href: '/reading-list', icon: Bookmark, label: 'Saved', badge: bookmarkCount > 0 ? bookmarkCount : null, isActive: isBookmarks },
    { href: '#menu', icon: Menu, label: 'Menu', onClick: () => setIsMenuOpen(!isMenuOpen) },
  ]

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line md:hidden z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.isActive

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault()
                    item.onClick()
                  }
                }}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${
                  isActive
                    ? 'text-navy'
                    : 'text-muted hover:text-ink'
                }`}
                title={item.label}
              >
                <Icon size={24} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <span className="text-[10px] font-bold mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-line z-50 max-h-[60vh] overflow-y-auto md:hidden">
          <div className="p-4 space-y-2">
            {/* Categories */}
            <div className="mb-4">
              <h3 className="font-bold text-ink text-sm mb-3 px-3">Categories</h3>
              {[
                { label: 'Nigeria', href: '/category/nigeria' },
                { label: 'Politics', href: '/category/politics' },
                { label: 'Economy', href: '/category/economy' },
                { label: 'World', href: '/category/world' },
                { label: 'Opinion', href: '/opinion' },
                { label: 'Fact Check', href: '/fact-check' },
                { label: 'Sport', href: '/category/sport' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-ink hover:bg-paper rounded transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <hr className="border-line" />

            {/* Account/Info */}
            <div className="pt-2 space-y-1">
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-ink hover:bg-paper rounded transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/about#standards"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-ink hover:bg-paper rounded transition-colors"
              >
                Editorial Standards
              </Link>
              <Link
                href="/newsletter"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-navy font-semibold hover:bg-navy/5 rounded transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Spacing for fixed bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
