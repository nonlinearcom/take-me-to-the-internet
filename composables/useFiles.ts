import type { DirectusFile } from '@directus/sdk'

export default function () {
  const { public: { directus: { url: baseURL } } } = useRuntimeConfig()

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
