import type { DirectusFile } from '@directus/sdk'

export function useFiles() {
  const { public: { directus: { url } } } = useRuntimeConfig()
  // Trim trailing slashes so a configured host with one doesn't yield `host//assets/id`
  // (matches the normalization in providers/directus-runtime.ts).
  const baseURL = url.replace(/\/+$/, '')

  function fileUrl(fileId: string | DirectusFile) {
    if (!fileId)
      return undefined

    if (typeof fileId === 'string')
      return `${baseURL}/assets/${fileId}`
    // Handle case where fileId is an object<File>
    else if (isDirectusFile(fileId))
      return `${baseURL}/assets/${fileId.id}`

    return undefined
  }

  return {
    fileUrl,
  }
}
