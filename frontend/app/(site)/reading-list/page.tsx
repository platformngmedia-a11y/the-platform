'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import { getBookmarks, removeBookmark, clearAllBookmarks, BookmarkedArticle } from '@/lib/bookmarks'
import { format, formatDistanceToNow } from 'date-fns'

export default function ReadingListPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setBookmarks(getBookmarks())
    setIsLoading(false)
  }, [])

  const handleRemove = (id: string) => {
    removeBookmark(id)
    setBookmarks(getBookmarks())
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      clearAllBookmarks()
      setBookmarks([])
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gold rounded-lg">
            <Bookmark size={24} className="text-navy" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-ink">Reading List</h1>
            <p className="text-muted mt-1">{bookmarks.length} saved articles</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      {isLoading ? (
        <div className="text-center py-12 text-muted">
          <p>Loading your reading list...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-paper rounded-lg border border-line">
          <Bookmark size={48} className="mx-auto text-muted/30 mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">No saved articles yet</h2>
          <p className="text-muted max-w-md mx-auto">
            Browse articles and click the bookmark icon to save them to your reading list. Perfect for reading later!
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors"
          >
            Browse Articles
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {bookmarks.map((article) => (
              <div
                key={article._id}
                className="border border-line rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/article/${article.slug}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-bold text-ink group-hover:text-navy transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                    </a>
                    <p className="text-sm text-muted line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      {article.author && (
                        <>
                          <span className="font-medium">{article.author}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>Saved {formatDistanceToNow(article.savedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/article/${article.slug}`}
                      className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
                    >
                      Read
                    </a>
                    <button
                      onClick={() => handleRemove(article._id)}
                      className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from reading list"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          <div className="flex justify-end">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Clear All Bookmarks
            </button>
          </div>
        </>
      )}
    </div>
  )
}
