'use client'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Radio } from 'lucide-react'

interface Item {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
}

export function BreakingBanner({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % items.length)
        setVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items.length) return null
  const current = items[index]

  return (
    <div className="bg-red-700 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5 shrink-0 font-black text-[10px] tracking-widest bg-white text-red-700 px-2.5 py-1 rounded">
          <Radio size={10} className="fill-current animate-pulse" />
          BREAKING
        </span>
        <a href={`/article/${current.slug.current}`} className={`text-sm font-medium truncate flex-1 hover:underline underline-offset-2 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {current.title}
        </a>
        <span className="text-xs text-red-200 shrink-0 hidden md:block">
          {formatDistanceToNow(new Date(current.publishedAt), { addSuffix: true })}
        </span>
        <div className="flex gap-1 shrink-0">
          {items.map((_, i) => (
            <button key={i} onClick={() => { setIndex(i); setVisible(true) }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white' : 'bg-red-300'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}