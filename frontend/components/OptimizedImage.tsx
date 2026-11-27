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

  // Request high-definition master crop from Sanity (respecting editor hotspot/crop)
  // so Next.js Image optimizer never upscales a low-res 1x image on 2x/3x Retina displays.
  const imageUrl = urlForImage(src)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .quality(90)
    .url()
  const blurDataUrl = getLQIPUrl(src)

  const defaultSizes =
    sizes ||
    `(max-width: 640px) 100vw,
     (max-width: 1024px) 50vw,
     ${width}px`

  return (
    <div
      className={`w-full h-full overflow-hidden ${className}`}
      style={{
        position: 'relative',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        quality={85}
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
