<template>
  <article
    v-if="page"
    class="page"
  >
    <ClientOnly>
      <header>
        <h3 class="tag">
          CABLES.GL
        </h3>
        <h1 class="title">
          {{ translation?.title }}
        </h1>
        <time
          class="updated-on"
          :datetime="page.date_updated?.split('T')[0]"
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

const relationBlocks = [
  { collection: 'cables', component: EditorCables },
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },

]
const relationInlineBlocks = [
  { collection: 'code_link', component: EditorCodeLink },
]

const relationMarks = [
  { collection: 'sidenote', component: EditorSideNote },
]

const route = useRoute()

const { locale } = useI18n()
const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { $directus, $readItem } = useNuxtApp()

const { data: page } = await useAsyncData(`article-${route.params.slug}`, () => {
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

  max-width: 75ch;
  margin: 0 auto;

  header {
    margin-bottom: 92px;
    .tag {
      display: inline-block;
      font-size: var(--text-small);
      text-transform: uppercase;
      font-family: var(--font-stack-mono);
      font-weight: var(--regular-mono);
      border: 1px solid var(--border-color);
      padding: 2px 8px;
      border-radius: 25px;
    }
    .title {
      font-size: var(--text-xlarge) !important;
      margin-bottom: 0 !important;
    }
    time {
      font-family: var(--font-stack-mono);
      color: var(--text-secondary);
      font-size: var(--text-mini);
      text-transform: uppercase;
      display: block;
      margin: 8px 0;
    }
  }
}
</style>
