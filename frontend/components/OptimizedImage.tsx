'use client'

import Image from 'next/image'
import { useState } from 'react'
import { urlForImage, getLQIPUrl } from '@/lib/sanity/image'

interface Props {
  src: any
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
  onClick?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes,
  onClick,
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = urlForImage(src).width(width).height(height).auto('format').quality(80).url()
  const blurDataUrl = getLQIPUrl(src)

  const defaultSizes =
    sizes ||
    `(max-width: 640px) 100vw,
     (max-width: 1024px) 90vw,
     (max-width: 1280px) 80vw,
     ${width}px`

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        position: 'relative',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes={defaultSizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        onLoad={() => setIsLoading(false)}
        onClick={onClick}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        unoptimized={false}
      />
    </div>
  )
}
