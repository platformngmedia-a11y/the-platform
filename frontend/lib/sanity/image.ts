import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)
export const urlForImage = (source: any) => builder.image(source)

export function getLQIPUrl(source: any): string {
  return urlForImage(source)
    .width(100)
    .height(100)
    .quality(20)
    .blur(20)
    .auto('format')
    .url()
}

export function getResponsiveImageUrl(
  source: any,
  width: number,
  height?: number
): string {
  const url = urlForImage(source).width(width)
  if (height) url.height(height)
  return url.auto('format').quality(80).url()
}

export function getImageSrcSet(
  source: any,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return widths
    .map(
      (w) =>
        `${urlForImage(source)
          .width(w)
          .auto('format')
          .quality(75)
          .url()} ${w}w`
    )
    .join(', ')
}