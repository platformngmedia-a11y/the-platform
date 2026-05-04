'use client'
import { Link2 } from 'lucide-react'

export function CopyLinkButton({ url }: { url: string }) {
  return (
    <button onClick={() => navigator.clipboard.writeText(url)} className="w-8 h-8 flex items-center justify-center rounded border border-line hover:bg-paper transition-colors text-muted hover:text-ink">
      <Link2 size={13} />
    </button>
  )
}