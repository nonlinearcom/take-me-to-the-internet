import type { DirectusFile } from '@directus/sdk'

// Helpers for the shapes Directus hands back: translations, dates, junction
// rows and files. Presentation helpers live in format.ts.

/* translations */

// Deep filter that keeps only the active language's row of a `translations`
// relation (Directus still returns the relation as an array)
export function translationsDeep(languageCode: string) {
  return { translations: { _filter: { languages_code: { _eq: languageCode } } } }
}

// Pick the active language's translation out of a fetched list. A fallback
// language, if ever wanted, belongs here and nowhere else.
export function findTranslation<T extends { languages_code: string }>(
  translations: T[] | null | undefined,
  languageCode: string,
) {
  return translations?.find(t => t.languages_code === languageCode) ?? null
}

/* dates */

// Directus leaves date_updated empty until an item is edited after creation
export function lastUpdated(item: { date_created: string, date_updated?: string | null }) {
  return item.date_updated ?? item.date_created
}

/* resources: relations come back as junction rows; deleted related items
   leave a null behind, hence the guards */

export function topicTitles(resource: Pick<Resource, 'topics'>) {
  return (resource.topics ?? []).flatMap(({ topics_id }) => topics_id ? [topics_id.title] : [])
}

export function tagTitles(resource: Pick<Resource, 'tags'>) {
  return (resource.tags ?? []).flatMap(({ tags_id }) => tags_id ? [tags_id.title] : [])
}

export function authorNames(resource: Pick<Resource, 'people'>) {
  return (resource.people ?? []).flatMap(({ people_id }) => people_id ? [people_id.name.trim()] : []).join(', ')
}

// Shared by the list page and the drawer so both load the same shape
export const RESOURCE_FIELDS = [
  '*',
  'people.people_id.id',
  'people.people_id.name',
  'people.people_id.link',
  'tags.tags_id.id',
  'tags.tags_id.title',
  'tags.tags_id.slug',
  'topics.topics_id.id',
  'topics.topics_id.title',
  'topics.topics_id.slug',
]

/* files */

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
