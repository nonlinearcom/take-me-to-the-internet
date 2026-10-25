import type { DirectusFile } from '@directus/sdk'

export function useFiles() {
  // Site-relative: /assets/** is proxied to Directus by server/routes/assets/[...path].ts
  function fileUrl(fileId: string | DirectusFile) {
    if (!fileId)
      return undefined

    if (typeof fileId === 'string')
      return `/assets/${fileId}`
    // Handle case where fileId is an object<File>
    else if (isDirectusFile(fileId))
      return `/assets/${fileId.id}`

    return undefined
  }

  return {
    fileUrl,
  }
}
