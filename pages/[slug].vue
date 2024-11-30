<template>
  <h1>{{ translation.title }}</h1>
  <pre>{{ page }}</pre>
  ---

  <pre>{{ translation.content }}</pre>
  <EditorContent
    v-if="translation?.content"
    :content="translation?.content"
    :relation-blocks
  />
</template>

<script lang="ts" setup>
import { EditorImage } from '#components'

const { $directus, $readItem } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { data: page } = await useAsyncData('page', () => {
  return $directus.request(
    $readItem('pages', route.params.slug as string, {
      fields: [{ '*': ['*'] }],
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

// New editor test
const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'image', component: EditorImage },
]
injectDataIntoContent(page.value.editor_nodes, page.value.translations.content)
</script>

<style lang="postcss">

</style>
