<template>
  <article class="page">
    <h1> {{ translation.title }} </h1>
    <EditorContent
      v-if="translation?.content"
      class="flexible-editor"
      :content="translation?.content"
      :relation-blocks
    />
  </article>
</template>

<script lang="ts" setup>
import { EditorGallery, EditorImage } from '#components'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'image', component: EditorImage },
]

const { $directus, $readItem } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { data: page } = await useAsyncData('page', () => {
  return $directus.request(
    $readItem('pages', route.params.slug as string, {
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
                    image: ['*'],
                    gallery: [
                      { content: ['*'] },
                    ],
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
  if (!page.value)
    return null

  // here we could also set a fallback language
  const translation = page.value.translations.find(t => t.languages_code === languageCode.value) || null
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.content)
  return translation
})
</script>

<style lang="postcss">
.page {
  padding: var(--app-margin-small);

  max-width: 60ch;
  /* margin: 0 auto; */
}
</style>
