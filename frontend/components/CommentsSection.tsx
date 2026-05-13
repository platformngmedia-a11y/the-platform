'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, ThumbsUp } from 'lucide-react'

interface Comment {
  id: string; name: string; message: string; createdAt: string; likes: number
}

export function CommentsSection({ articleId }: { articleId: string }) {
  const [comments,   setComments]   = useState<Comment[]>([])
  const [name,       setName]       = useState('')
  const [message,    setMessage]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [likedIds,   setLikedIds]   = useState<string[]>([])

  function handleLike(id: string) {
    if (likedIds.includes(id)) return
    setLikedIds(prev => [...prev, id])
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c))
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    setComments(prev => [{
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }, ...prev])
    setName(''); setMessage(''); setDone(true); setSubmitting(false)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-ink mb-6">
        <MessageSquare size={20} className="text-navy" />
        Reader Responses ({comments.length})
      </h3>

      <div className="bg-navy/5 border border-navy/10 rounded-lg p-4 mb-6 text-sm text-ink/70">
        <strong className="text-navy">Community guidelines:</strong> Share your perspective
        respectfully. The Platform fosters informed debate — no hate speech, misinformation,
        or personal attacks.
      </div>

      <form onSubmit={handleSubmit} className="bg-paper rounded-xl p-5 mb-8 space-y-3">
        <p className="font-semibold text-sm text-ink">Add your response</p>
        <input
          type="text" placeholder="Your name" value={name}
          onChange={e => setName(e.target.value)} required
          className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/30"
        />
        <textarea
          placeholder="Share your informed perspective..." value={message}
          onChange={e => setMessage(e.target.value)} required rows={4}
          className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/30 resize-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">All comments are moderated before publication.</p>
          <button
            type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : done ? '✓ Submitted' : 'Submit Response'}
          </button>
        </div>
      </form>

      <div className="space-y-5">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-xs font-bold">
              {comment.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm text-ink">{comment.name}</span>
                  <span className="text-xs text-muted ml-2">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    likedIds.includes(comment.id) ? 'text-navy font-semibold' : 'text-muted hover:text-navy'
                  }`}
                >
                  <ThumbsUp size={13} />
                  {comment.likes}
                </button>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">{comment.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}