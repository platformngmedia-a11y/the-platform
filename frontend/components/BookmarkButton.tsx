'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { isBookmarked, addBookmark, removeBookmark, BookmarkedArticle } from '@/lib/bookmarks'

interface Props {
  article: {
    _id: string
    slug: { current: string }
    title: string
    excerpt: string
    author?: { name: string }
    mainImage?: any
  }
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
}

export function BookmarkButton({ article, variant = 'icon', size = 'md' }: Props) {
  const [isMarked, setIsMarked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if article is bookmarked on mount
  useEffect(() => {
    setIsMarked(isBookmarked(article._id))
  }, [article._id])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)

    const bookmarkedArticle: BookmarkedArticle = {
      _id: article._id,
      slug: article.slug.current,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author?.name,
    }

    if (isMarked) {
      removeBookmark(article._id)
      setIsMarked(false)
    } else {
      addBookmark(bookmarkedArticle)
      setIsMarked(true)
    }

    setLoading(false)
  }

  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleBookmark}
        disabled={loading}
        className={`flex items-center justify-center rounded-lg hover:bg-paper transition-colors ${sizeClasses[size]} ${
          isMarked ? 'text-gold' : 'text-muted hover:text-navy'
        }`}
        title={isMarked ? 'Remove from reading list' : 'Add to reading list'}
        aria-label="Bookmark article"
      >
        <Bookmark size={20} fill={isMarked ? 'currentColor' : 'none'} />
      </button>
    )
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
        isMarked
          ? 'bg-gold text-navy hover:bg-gold/90'
          : 'bg-paper border border-line text-ink hover:bg-white'
      }`}
    >
      <Bookmark size={16} fill={isMarked ? 'currentColor' : 'none'} />
      <span>{isMarked ? 'Saved' : 'Save Article'}</span>
    </button>
  )
}
