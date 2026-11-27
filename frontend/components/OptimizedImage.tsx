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
  mode?: 'card' | 'editorial'
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
  mode = 'card',
  onClick,
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const dims = src?.asset?.metadata?.dimensions as
    | { width: number; height: number; aspectRatio: number }
    | undefined

  const cropW = 1 - (src?.crop?.left ?? 0) - (src?.crop?.right ?? 0)
  const cropH = 1 - (src?.crop?.top ?? 0) - (src?.crop?.bottom ?? 0)

  const naturalWidth = dims?.width ? Math.max(1, Math.round(dims.width * cropW)) : undefined
  const naturalHeight = dims?.height ? Math.max(1, Math.round(dims.height * cropH)) : undefined
  const naturalRatio =
    naturalWidth && naturalHeight ? naturalWidth / naturalHeight : dims?.aspectRatio

  const hasHotspot = Boolean(src?.hotspot && (src.hotspot.x !== 0.5 || src.hotspot.y !== 0.5))
  const blurDataUrl = getLQIPUrl(src)

  /* ------------------------------------------------------------------
   * EDITORIAL MODE (Article hero & inline body photos — BBC / Reuters standard):
   * - Never slice off heads or embedded text with blind center-crops
   * - Never upscale a small wire/social photo into pixelated blur
   * - Frame portrait, square, or smaller photos on a clean neutral stage
   * ------------------------------------------------------------------ */
  if (mode === 'editorial') {
    const isHighResLandscape = Boolean(
      naturalWidth && naturalRatio && naturalWidth >= 780 && naturalRatio >= 1.33
    )

    const targetW = naturalWidth ? Math.min(width, naturalWidth) : width
    const targetH = naturalRatio
      ? Math.max(1, Math.round(targetW / naturalRatio))
      : Math.max(1, Math.round(targetW * (height / width)))

    const editorialUrl = urlForImage(src)
      .width(targetW)
      .fit('max')
      .auto('format')
      .quality(90)
      .url()

    if (isHighResLandscape) {
      return (
        <div className={`w-full overflow-hidden bg-paper rounded-sm ${className}`}>
          <Image
            src={editorialUrl}
            alt={alt}
            width={targetW}
            height={targetH}
            quality={85}
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 860px'}
            priority={priority}
            placeholder="blur"
            blurDataURL={blurDataUrl}
            onLoad={() => setIsLoading(false)}
            onClick={onClick}
            className={`w-full h-auto max-h-[600px] object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            unoptimized={false}
          />
        </div>
      )
    }

    // Portrait, square, or lower-resolution source image:
    // Keep 100% uncropped and cap width near natural pixels so it stays sharp.
    const maxDisplayWidth = naturalWidth
      ? Math.max(360, Math.min(Math.round(naturalWidth * 1.15), 760))
      : 680

    return (
      <div
        className={`w-full bg-paper border border-line/70 rounded-sm flex items-center justify-center p-2 sm:p-3 overflow-hidden ${className}`}
      >
        <div style={{ width: '100%', maxWidth: `${maxDisplayWidth}px` }} className="mx-auto">
          <Image
            src={editorialUrl}
            alt={alt}
            width={targetW}
            height={targetH}
            quality={85}
            sizes={sizes || `(max-width: 768px) 100vw, ${maxDisplayWidth}px`}
            priority={priority}
            placeholder="blur"
            blurDataURL={blurDataUrl}
            onLoad={() => setIsLoading(false)}
            onClick={onClick}
            className={`w-full h-auto max-h-[540px] object-contain mx-auto transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            unoptimized={false}
          />
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------
   * CARD MODE (Uniform 16:9 grids, Top Stories, Related Stories):
   * - Never upscale past naturalWidth
   * - Respect editor hotspot; otherwise anchor portrait/square shots to
   *   top ('top') so heads are preserved, and landscape shots to 'entropy'
   * ------------------------------------------------------------------ */
  const reqWidth = naturalWidth ? Math.min(width, naturalWidth) : width
  const reqHeight = Math.max(1, Math.round(reqWidth * (height / width)))

  const cropMode = hasHotspot
    ? 'focalpoint'
    : naturalRatio && naturalRatio < 1.25
      ? 'top'
      : 'entropy'

  const imageUrl = urlForImage(src)
    .width(reqWidth)
    .height(reqHeight)
    .fit('crop')
    .crop(cropMode)
    .auto('format')
    .quality(90)
    .url()

  const defaultSizes =
    sizes ||
    `(max-width: 640px) 100vw,
     (max-width: 1024px) 50vw,
     ${width}px`

  const objectPositionClass =
    !hasHotspot && naturalRatio && naturalRatio < 1.25 ? 'object-top' : 'object-center'

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
        className={`object-cover ${objectPositionClass} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        unoptimized={false}
      />
    </div>
  )
}
