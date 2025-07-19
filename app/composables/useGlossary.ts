export default function () {
  const { $directus, $readItems } = useNuxtApp()
  const list = useState('glossary-list', () => [])

  if (!list.value.length) {
    console.log('Fetching glossary list')
    $directus.request(
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
      .then((response) => {
        list.value = response
      })
  }

  return {
    list,
  }
}
