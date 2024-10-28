<template>
  <h1>{{ translation.title }}</h1>
  <div v-html="translation.content" />
</template>

<script lang="ts" setup>
const { $directus, $readItems, $readItem } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})
// console.log('languageCode', languageCode.value)

// const { data: page } = await useAsyncData('page', () => {
//   return $directus.request($readItems('pages', {
//     deep: {
//       translations: {
//         _filter: {
//           _and: [
//             {
//               languages_code: { _eq: languageCode },
//             },
//             {
//               pages_slug: { _eq: route.params.slug as string },
//             },
//           ],
//         },
//       },
//     },
//     fields: ['*', { translations: ['*'] }],
//     limit: 1,
//   }))
// })

const { data: page } = await useAsyncData('page', () => {
  return $directus.request(
    $readItem('pages', route.params.slug as string, {
      fields: ['*', 'translations.*'],
    }),
  )
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const translation = computed(() => {
  if (!page.value)
    return null

  // here we could also set a fallback language
  return page.value.translations.find(t => t.languages_code === languageCode.value) || null
})

useSeoMeta({
  title: translation.value?.title || 'Default Title',
  // description: translation.value?.content || 'Default Description',
})
</script>

<style lang="postcss">

</style>
