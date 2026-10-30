<template>
  <article
    v-if="page"
    class="page margin-notes"
  >
    <header>
      <h3 class="pill">
        {{ page.type }}
      </h3>
      <h1 class="title">
        {{ translation?.title }}
      </h1>
      <UpdatedOn :date="lastUpdated(page)" />
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
  </article>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'
import { EditorCables, EditorCodeLink, EditorGallery, EditorMedia, EditorSideNote } from '#components'

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
const languageCode = useLanguageCode()

const { $directus } = useNuxtApp()

// Only notes and tutorials live here; static pages are served at /:slug
const { data: page } = await useAsyncData(`article-${route.params.slug}`, () =>
  $directus.request<Page[]>(
    readItems('pages', {
      filter: {
        slug: { _eq: route.params.slug as string },
        type: { _in: ARTICLE_TYPES },
      },
      limit: 1,
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
                      {
                        content: [
                          '*',
                          {
                            directus_files_id: ['id', 'description'],
                          },
                        ],
                      },
                    ],
                    media: [
                      'layout',
                      {
                        file: ['*'],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ), {
  transform: rows => rows[0] ?? null,
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const translation = computed(() => {
  const translation = findTranslation(page.value?.translations, languageCode.value)
  if (translation)
    injectDataIntoContent(translation.editor_nodes, translation.content)
  return translation
})

useSeoMeta({
  title: () => translation.value?.title,
  description: () => contentToDescription(translation.value?.content),
})

useSchemaOrg([
  defineArticle({
    headline: translation.value?.title,
    datePublished: page.value?.date_created ?? page.value?.date_updated,
    dateModified: page.value?.date_updated,
  }),
])

useHighlight()
</script>

<style lang="postcss" scoped>
.page {
  position: relative;
  padding: var(--app-margin-small);

  max-inline-size: var(--paragraph-width);
  margin: 0 auto;

  header {
    margin-bottom: 92px;
    .title {
      font-size: var(--text-xlarge) !important;
      margin-bottom: 0 !important;
    }
  }
}

/* keep the text measure, reserve the right margin column for sidenotes,
   center text+notes as one block (breakpoint must match EditorSideNote.vue) */
@media (min-width: 1280px) {
  .page.margin-notes {
    max-inline-size: calc(var(--paragraph-width) + var(--sidenote-width) + var(--sidenote-gap));
    padding-inline-end: calc(var(--app-margin-small) + var(--sidenote-width) + var(--sidenote-gap));
    display: flow-root; /* encloses trailing floats (notes near article end) */
  }
}
</style>
