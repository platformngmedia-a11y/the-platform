'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { urlForImage } from '@/lib/sanity/image'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  mainImage?: any
  categories?: Array<{ title: string; slug: { current: string } }>
  author?: { name: string; slug?: { current: string } }
  contentType?: string
  wordCount?: number
  sourcesUsed?: any[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [contentType, setContentType] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        window.location.href = `/article/${results[selectedIndex].slug.current}`
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  // Apply filters to results
  const filteredResults = useCallback((allResults: SearchResult[]) => {
    let filtered = [...allResults]

    // Content type filter
    if (contentType) {
      filtered = filtered.filter(r => r.contentType === contentType)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const publishDate = new Date()

      if (dateRange === 'week') {
        publishDate.setDate(publishDate.getDate() - 7)
      } else if (dateRange === 'month') {
        publishDate.setMonth(publishDate.getMonth() - 1)
      } else if (dateRange === 'year') {
        publishDate.setFullYear(publishDate.getFullYear() - 1)
      }

      filtered = filtered.filter(r => new Date(r.publishedAt) >= publishDate)
    }

    return filtered
  }, [contentType, dateRange])

  // Search
  const handleSearch = useCallback(async (q: string) => {
    setQuery(q)
    setSelectedIndex(0)

    if (q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      const allResults = data.results || []
      setResults(filteredResults(allResults))
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [filteredResults])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto max-w-2xl pt-16 px-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="border-b border-line p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search articles, authors, topics..."
                className="flex-1 outline-none text-sm"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded transition ${showFilters ? 'bg-navy text-white' : 'hover:bg-paper text-muted'}`}
                aria-label="Toggle filters"
                title="Advanced filters"
              >
                <SlidersHorizontal size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-paper rounded transition"
                aria-label="Close"
              >
                <X size={18} className="text-muted" />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-paper p-3 rounded-lg space-y-3 text-sm">
                {/* Content Type */}
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5">Content Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: null, label: 'All' },
                      { value: 'news', label: 'News' },
                      { value: 'analysis', label: 'Analysis' },
                      { value: 'investigation', label: 'Investigation' },
                      { value: 'explainer', label: 'Explainer' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setContentType(opt.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          contentType === opt.value
                            ? 'bg-navy text-white'
                            : 'bg-white border border-line text-ink hover:border-navy'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5">Published</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'week', label: 'Last 7 Days' },
                      { value: 'month', label: 'Last Month' },
                      { value: 'year', label: 'Last Year' },
                      { value: 'all', label: 'All Time' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDateRange(opt.value as any)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          dateRange === opt.value
                            ? 'bg-navy text-white'
                            : 'bg-white border border-line text-ink hover:border-navy'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[70vh] overflow-auto">
            {loading && (
              <div className="p-8 text-center text-muted">
                <div className="inline-block animate-spin">
                  <Search size={20} />
                </div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            )}

            {!loading && query.length < 2 && (
              <div className="p-8 text-center text-muted text-sm">
                Enter at least 2 characters to search
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-muted text-sm">
                No results found for "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-line">
                {results.map((result, idx) => {
                  const imageUrl = result.mainImage
                    ? urlForImage(result.mainImage).width(80).height(60).url()
                    : null
                  const ago = formatDistanceToNow(new Date(result.publishedAt), {
                    addSuffix: true,
                  })

                  return (
                    <a
                      key={result._id}
                      href={`/article/${result.slug.current}`}
                      onClick={onClose}
                      className={`flex gap-3 p-4 hover:bg-paper transition cursor-pointer ${
                        idx === selectedIndex ? 'bg-paper' : ''
                      }`}
                    >
                      {imageUrl && (
                        <div className="shrink-0 w-16 h-12 bg-line rounded overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={result.title}
                            width={80}
                            height={60}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-ink line-clamp-2 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-xs text-muted line-clamp-1 mb-1">
                          {result.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          {result.author?.name && (
                            <>
                              <span>{result.author.name}</span>
                              <span>·</span>
                            </>
                          )}
                          <span>{ago}</span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="border-t border-line px-4 py-3 text-xs text-muted bg-paper text-center">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
