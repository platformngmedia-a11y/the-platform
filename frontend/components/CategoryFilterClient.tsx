'use client'

import { useState, useMemo } from 'react'
import { Filter, X } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import { calculateArticleTrustScore } from '@/lib/trust-scoring'

interface Props {
  articles: any[]
  categorySlug: string
}

export function CategoryFilterClient({ articles, categorySlug }: Props) {
  const [contentType, setContentType] = useState<string | null>(null)
  const [trustLevel, setTrustLevel] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'trustScore'>('newest')
  const [isOpen, setIsOpen] = useState(false)

  // Get unique content types from articles
  const contentTypes = useMemo(() => {
    const types = new Set(articles.map(a => a.contentType).filter(Boolean))
    return Array.from(types).sort()
  }, [articles])

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles]

    // Content type filter
    if (contentType) {
      filtered = filtered.filter(a => a.contentType === contentType)
    }

    // Trust score filter
    if (trustLevel) {
      filtered = filtered.filter(a => {
        const trust = calculateArticleTrustScore(a)
        if (trustLevel === 'excellent') return trust.level === 'Excellent'
        if (trustLevel === 'good') return trust.level === 'Good'
        if (trustLevel === 'fair') return trust.level === 'Fair'
        return true
      })
    }

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    } else if (sortBy === 'trustScore') {
      filtered.sort((a, b) => {
        const trustA = calculateArticleTrustScore(a).score
        const trustB = calculateArticleTrustScore(b).score
        return trustB - trustA
      })
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0))
    }

    return filtered
  }, [articles, contentType, trustLevel, sortBy])

  const activeFiltersCount = [contentType, trustLevel].filter(Boolean).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors col-span-1"
      >
        <Filter size={16} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-auto bg-gold text-navy px-2 py-0.5 rounded-full text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`lg:col-span-1 fixed lg:relative inset-y-0 left-0 w-64 lg:w-auto bg-white lg:bg-transparent border-r lg:border-none border-line z-50 transform transition-transform lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } p-6 overflow-y-auto`}
      >
        {/* Close button mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <X size={20} />
        </button>

        {/* Sort Section */}
        <div className="mb-8">
          <h3 className="font-bold text-ink mb-3">Sort By</h3>
          <div className="space-y-2">
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'trustScore', label: 'Highest Trust Score' },
              { value: 'popular', label: 'Most In-Depth' },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={(e) => {
                    setSortBy(e.target.value as any)
                    setIsOpen(false)
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-ink">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Type Filter */}
        {contentTypes.length > 0 && (
          <div className="mb-8 pb-8 border-b border-line">
            <h3 className="font-bold text-ink mb-3">Content Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contentType === null}
                  onChange={() => {
                    setContentType(null)
                    setIsOpen(false)
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-ink">All Types</span>
              </label>
              {contentTypes.map(type => {
                const count = articles.filter(a => a.contentType === type).length
                return (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contentType === type}
                      onChange={() => {
                        setContentType(contentType === type ? null : type)
                        setIsOpen(false)
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-ink capitalize">
                      {type}
                      <span className="text-xs text-muted ml-1">({count})</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Trust Score Filter */}
        <div className="mb-8 pb-8 border-b border-line">
          <h3 className="font-bold text-ink mb-3">Credibility</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trustLevel === null}
                onChange={() => {
                  setTrustLevel(null)
                  setIsOpen(false)
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-ink">All Levels</span>
            </label>
            {[
              { value: 'excellent', label: '⭐ Excellent', color: 'text-green-600' },
              { value: 'good', label: '✓ Good', color: 'text-blue-600' },
              { value: 'fair', label: '📊 Fair', color: 'text-amber-600' },
            ].map(level => {
              const count = articles.filter(a => {
                const trust = calculateArticleTrustScore(a)
                if (level.value === 'excellent') return trust.level === 'Excellent'
                if (level.value === 'good') return trust.level === 'Good'
                if (level.value === 'fair') return trust.level === 'Fair'
                return false
              }).length
              return (
                <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trustLevel === level.value}
                    onChange={() => {
                      setTrustLevel(trustLevel === level.value ? null : level.value)
                      setIsOpen(false)
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-ink">
                    {level.label}
                    <span className="text-xs text-muted ml-1">({count})</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-paper rounded-lg p-3 text-sm text-muted">
          <p className="font-semibold text-ink mb-1">Showing {filteredArticles.length}</p>
          <p className="text-xs">of {articles.length} articles</p>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={() => {
              setContentType(null)
              setTrustLevel(null)
              setSortBy('newest')
              setIsOpen(false)
            }}
            className="mt-4 w-full px-3 py-2 bg-muted/10 text-muted hover:bg-muted/20 rounded-lg text-sm font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Articles Grid */}
      <div className="lg:col-span-3">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredArticles.map((a: any) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted">No articles match your filters.</p>
            <button
              onClick={() => {
                setContentType(null)
                setTrustLevel(null)
                setSortBy('newest')
              }}
              className="mt-4 px-4 py-2 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
