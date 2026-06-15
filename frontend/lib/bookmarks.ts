export interface BookmarkedArticle {
  _id: string
  slug: string
  title: string
  excerpt: string
  author?: string
  savedAt: number
  imageUrl?: string
}

const BOOKMARKS_KEY = 'theplatform_bookmarks'

export function getBookmarks(): BookmarkedArticle[] {
  if (typeof window === 'undefined') return []

  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY)
    return bookmarks ? JSON.parse(bookmarks) : []
  } catch (error) {
    console.error('Failed to get bookmarks:', error)
    return []
  }
}

export function addBookmark(article: BookmarkedArticle): boolean {
  try {
    const bookmarks = getBookmarks()
    const exists = bookmarks.some(b => b._id === article._id)

    if (exists) return false

    bookmarks.unshift({ ...article, savedAt: Date.now() })
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return true
  } catch (error) {
    console.error('Failed to add bookmark:', error)
    return false
  }
}

export function removeBookmark(articleId: string): boolean {
  try {
    const bookmarks = getBookmarks()
    const filtered = bookmarks.filter(b => b._id !== articleId)

    if (filtered.length === bookmarks.length) return false

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to remove bookmark:', error)
    return false
  }
}

export function isBookmarked(articleId: string): boolean {
  return getBookmarks().some(b => b._id === articleId)
}

export function clearAllBookmarks(): boolean {
  try {
    localStorage.removeItem(BOOKMARKS_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear bookmarks:', error)
    return false
  }
}

export function getBookmarkCount(): number {
  return getBookmarks().length
}
