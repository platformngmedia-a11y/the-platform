import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)
export const urlForImage = (source: any) => builder.image(source)

export function getLQIPUrl(source: any): string {
  return urlForImage(source)
    .width(64)
    .height(36)
    .fit('crop')
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
  if (height) url.height(height).fit('crop')
  return url.auto('format').quality(85).url()
}

export function getImageSrcSet(
  source: any,
  widths: number[] = [640, 750, 828, 1080, 1200, 1600, 1920]
): string {
  return widths
    .map(
      (w) =>
        `${urlForImage(source)
          .width(w)
          .auto('format')
          .quality(85)
          .url()} ${w}w`
    )
    .join(', ')
}
