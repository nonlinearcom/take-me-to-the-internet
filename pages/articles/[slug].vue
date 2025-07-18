<template>
  <article
    v-if="page"
    class="page"
  >
    <ClientOnly>
      <header>
        <h1 class="title">
          {{ translation?.title }}
        </h1>
        <time
          class="updated-on"
          :datetime="page.date_updated.split('T')[0]"
        >
          Updated on {{ formatDate(page.date_updated, { locale: languageCode }) }}
        </time>
      </header>
      <EditorContent
        v-if="translation?.content"
        class="prose"
        :content="translation?.content"
        :relation-blocks
        :relation-inline-blocks
        :relation-marks
      />
      <EditorFootNotes
        v-if="translation?.content"
        class="prose"
        :data="translation?.content"
      />
    </ClientOnly>
  </article>
</template>

<script lang="ts" setup>
import { EditorCables, EditorCodeLink, EditorFootNotes, EditorGallery, EditorMedia, EditorSideNote } from '#components'
import { footerPages } from '~/assets/footerPages'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'cables', component: EditorCables },
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },

]
const relationInlineBlocks: VueRelationNodeSerializers = [
  { collection: 'code_link', component: EditorCodeLink },
]

const relationMarks: VueRelationNodeSerializers = [
  { collection: 'sidenote', component: EditorSideNote },
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
                    sidenote: ['*'],
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

  max-width: 65ch;
  margin: 0 auto;

  header {
    margin-bottom: 92px;

    .title {
      font-size: var(--text-large) !important;
      margin-bottom: 0 !important;
    }
    time {
      color: var(--text-secondary);
      font-size: var(--text-small);
    }
  }
}
</style>
