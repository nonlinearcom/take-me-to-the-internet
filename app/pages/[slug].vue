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
import { readItems } from '@directus/sdk'
import { EditorGallery, EditorMedia } from '#components'

const relationBlocks = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },
]

const route = useRoute()
const languageCode = useLanguageCode()

const { $directus } = useNuxtApp()
// Only static pages live here; notes and tutorials are served under /articles
const { data: page } = await useAsyncData(`page-${route.params.slug}`, () =>
  $directus.request<Page[]>(
    readItems('pages', {
      filter: {
        slug: { _eq: route.params.slug as string },
        type: { _eq: 'page' },
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
</script>

<style lang="postcss">
.page {
  padding: var(--app-margin-small);

  max-inline-size: var(--paragraph-width);
  /* margin: 0 auto; */
}

/* this column is left-aligned (no auto margins), so the gallery's left
   edge distance is just the page padding; :not keeps it off the centered
   article pages, which this unscoped .page rule would otherwise also hit */
.page:not(.margin-notes) {
  --gallery-edge-start: var(--app-margin-small);
  --gallery-edge-end: calc(100vw - min(100vw, var(--paragraph-width)) + var(--app-margin-small));
}
</style>
