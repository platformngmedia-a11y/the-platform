'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
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
  author?: { name: string }
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
      setResults(data.results || [])
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto max-w-2xl pt-16 px-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-line p-4">
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
              onClick={onClose}
              className="p-1 hover:bg-paper rounded transition"
              aria-label="Close"
            >
              <X size={18} className="text-muted" />
            </button>
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
