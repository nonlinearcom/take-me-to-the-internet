import type { DirectusFile } from '@directus/sdk'

export function isDirectusFile(file?: any): file is DirectusFile {
  return (file as DirectusFile)?.id !== undefined
}

export function getMediaType(media: string | DirectusFile) {
  if (typeof media === 'string') {
    type ExtensionType = 'image' | 'video'
    const extensions: Record<ExtensionType, string[]> = {
      image: ['JPEG', 'JPG', 'JPE', 'JIF', 'JFIF', 'PNG', 'APNG', 'GIF', 'BMP', 'WEBP', 'TIFF', 'TIF', 'AVIF', 'SVG', 'ICO'],
      video: ['MP4', 'M4V', 'M4P', 'OGG', 'OGV', 'AVI', 'MOV', 'WEBM', 'MPEG', 'MPG', 'FLV', '3GP', 'MKV'],
    }

    const ext = media.split('.').pop()?.toUpperCase()
    if (!ext)
      return null

    return Object.entries(extensions).find(([, exts]) => exts.includes(ext))?.[0] ?? null
  } else if (isDirectusFile(media)) {
    const type = media.type
    return type?.substring(0, type.indexOf('/'))
  }
}
