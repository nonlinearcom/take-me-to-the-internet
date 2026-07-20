import { readItems } from '@directus/sdk'

export async function useGlossary() {
  const { $directus } = useNuxtApp()

  const { data: list } = await useAsyncData('glossary-list', () => {
    return $directus.request(
      readItems('glossary', {
        filter: {
          status: {
            _eq: 'published',
          },
        },
        fields: [
          '*',
          {
            translations: ['languages_code', 'term'],
          },
          {
            related_terms: ['related_glossary_id'],
          },
        ],
        sort: 'slug',
      }),
    )
  })

  return {
    list,
  }
}
