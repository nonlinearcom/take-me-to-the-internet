<template>
  <article class="page">
    <h1> {{ translation?.title }} </h1>
    <EditorContent
      v-if="translation?.content"
      class="prose prose-external"
      :content="translation?.content"
      :relation-blocks
    />
  </article>
</template>

<script lang="ts" setup>
import { readItem } from '@directus/sdk'
import { EditorGallery, EditorMedia } from '#components'

const relationBlocks = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },
]

const route = useRoute()
const languageCode = useLanguageCode()

const { $directus } = useNuxtApp()
const { data: page } = await useAsyncData(`page-${route.params.slug}`, () => {
  return $directus.request(
    readItem('pages', route.params.slug as string, {
      fields: [
        '*',
        {
          translations: [
            '*',
            {
              editor_nodes: [
                '*',
                {
                  item: {
                    gallery: [
                      { content: ['*'] },
                    ],
                    media: [{ file: ['*'] }],
                  },
                },
              ],
            },
          ],
        },
      ],
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
  if (!page.value?.translations)
    return null

  // here we could also set a fallback language
  const translation = page.value.translations.find(t => t.languages_code === languageCode.value) || null
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.content)
  return translation
})

useSeoMeta({
  title: () => translation.value?.title,
  description: () => contentToDescription(translation.value?.content),
})

// Articles are also reachable here at /:slug — point crawlers at the
// canonical /articles/:slug variant.
const slug = route.params.slug as string
if (!STATIC_PAGE_SLUGS.includes(slug)) {
  useHead({
    link: [{ rel: 'canonical', href: withSiteUrl(`/articles/${slug}`) }],
  })
}
</script>

<style lang="postcss">
.page {
  padding: var(--app-margin-small);

  max-width: 75ch;
  /* margin: 0 auto; */
}
</style>
