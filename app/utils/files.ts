import type { DirectusFile } from '@directus/sdk'

export function isDirectusFile(file?: any): file is DirectusFile {
  return (file as DirectusFile)?.id !== undefined
}

export function getFilenameExtension(pathfilename: any) {
  if (!isString(pathfilename))
    returnObject([undefined, undefined])

  const filenameextension = pathfilename.replace(/^.*[\\/]/, '')
  const f = filenameextension.substring(0, filenameextension.lastIndexOf('.'))
  const e = filenameextension.split('.').pop()

  if (!f.length) {
    if (filenameextension.startsWith('.'))
      return returnObject([undefined, e])
    else return returnObject([e, undefined])
  }

  return returnObject([f, e])

  function returnObject(arr: [string | undefined, string | undefined]) {
    return {
      filename: arr[0],
      extension: arr[1]?.toUpperCase(),
    }
  }
}

export function getMediaType(media: any) {
  if (isString(media)) {
    type ExtensionType = 'image' | 'video'
    const extensions: Record<ExtensionType, string[]> = {
      image: ['JPEG', 'JPG', 'JPE', 'JIF', 'JFIF', 'PNG', 'APNG', 'GIF', 'BMP', 'WEBP', 'TIFF', 'TIF', 'AVIF', 'SVG', 'ICO'],
      video: ['MP4', 'M4V', 'M4P', 'OGG', 'OGV', 'AVI', 'MOV', 'WEBM', 'MPEG', 'MPG', 'FLV', '3GP', 'MKV'],
    }

    const { extension } = getFilenameExtension(media)
    if (!extension)
      return null

    for (const key in extensions) {
      if (extensions[key as ExtensionType].includes(extension.toUpperCase()))
        return key
    }

    return null
  } else if (isDirectusFile(media)) {
    const type = media.type
    return type?.substring(0, type.indexOf('/'))
  }
}
