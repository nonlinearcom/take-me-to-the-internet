export async function useGlossary() {
  const { $directus, $readItems } = useNuxtApp()

  const { data: list } = await useAsyncData('glossary-list', () => {
    return $directus.request(
      $readItems('glossary', {
        fields: [
          '*',
          {
            translations: ['languages_code', 'term'],
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
