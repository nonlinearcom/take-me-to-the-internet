<template>
  <article
    v-if="page"
    class="page"
  >
    <h1> {{ translation.title }} </h1>
    <time :datetime="page.date_updated.split('T')[0]">
      Last updated: <br>
      {{ formatDate(page.date_updated, { locale: languageCode }) }}
    </time>
    <EditorContent
      v-if="translation?.content"
      class="prose"
      :content="translation?.content"
      :relation-blocks
      :relation-inline-blocks
    />
  </article>
</template>

<script lang="ts" setup>
import { EditorCables, EditorCodeLink, EditorGallery, EditorMedia } from '#components'
import { footerPages } from '~/assets/footerPages'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'cables', component: EditorCables },
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },
]
const relationInlineBlocks: VueRelationNodeSerializers = [
  { collection: 'code_link', component: EditorCodeLink },
]

const route = useRoute()
if (footerPages.includes(route.params.slug as string))
  await navigateTo(`/${route.params.slug as string}`)

const { locale } = useI18n()
const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { $directus, $readItem } = useNuxtApp()
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
                    cables: ['*'],
                    code_link: ['*'],
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
  if (!page.value)
    return null

  // here we could also set a fallback language
  const translation = page.value?.translations?.find(t => t.languages_code === languageCode.value) || null
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.content)
  return translation
})

useHighlight()
</script>

<style lang="postcss" scoped>
.page {
  position: relative;
  padding: var(--app-margin-small);

  max-width: 60ch;
  /* margin: 0 auto; */

  time {
    width: 16ch;
    color: var(--text-secondary);
    font-size: var(--text-small);
    text-transform: capitalize;

    @media (min-width: 1024px) {
      position: absolute;
      left: 100%;
    }
  }
}
</style>
