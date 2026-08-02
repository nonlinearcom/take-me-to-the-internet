<template>
  <article
    v-if="translation"
    class="glossary-term margin-notes"
  >
    <header>
      <h1 class="title">
        {{ translation.term }}
      </h1>
    </header>
    <EditorContent
      v-if="translation?.description"
      class="prose glossary-content"
      :content="translation?.description"
      :relation-blocks
      :relation-marks
      :relation-inline-blocks
    />
    <EditorFootNotes
      v-if="translation"
      :key="translation?.id"
      class="prose"
      :data="translation"
    />
    <GlossaryGraph
      :items="items"
      :current-slug="slug"
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
const { $directus } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()

const slug = route.params.slug as string

const { list } = await useGlossary()

const { data: page, error } = await useAsyncData(`glossary-${slug}`, async () => {
  const pageData = await $directus.request(
    readItems('glossary', {
      filter: {
        slug: {
          _eq: slug,
        },
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
                    media: ['id', 'layout', { file: ['*'] }],
                    gallery: [
                      { content: ['*', { directus_files_id: ['id', 'description'] }] },
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
  if (!pageData || pageData.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
    })
  }

  return pageData
}, {
  // collapse the single-row result so `page.value` is the item, not an array
  transform: rows => (rows?.[0] ?? null) as GlossaryItem | null,
})

if (error.value) {
  console.error(error.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const items = computed(() => (list.value ?? []) as GlossaryItem[])




function getTranslation(item: GlossaryItem): GlossaryTranslation | undefined {
  return item.translations?.find((t: GlossaryTranslation) => t.languages_code.startsWith(locale.value))
}

const translation = computed(() => {
  if (!page.value)
    return null

  const translation = getTranslation(page.value as GlossaryItem)
  if (!translation)
    return null

  injectDataIntoContent((translation as any).editor_nodes, translation.description)
  return translation
})

useSeoMeta({
  title: () => translation.value?.term,
  description: () => contentToDescription(translation.value?.description),
})

useSchemaOrg([
  {
    '@type': 'DefinedTerm',
    'name': translation.value?.term,
    'description': contentToDescription(translation.value?.description),
    'inDefinedTermSet': {
      '@type': 'DefinedTermSet',
      'name': 'Take me to the internet — Glossary',
      'url': withSiteUrl('/glossary'),
    },
  },
])

useHighlight()
</script>

<style lang="postcss">
.glossary-term {
  position: relative;
  padding-inline: var(--app-margin-small);
  max-inline-size: var(--paragraph-width);
  margin: 0 auto;

  header {
    margin-bottom: 96px;
    text-align: left;

    h1 {
      font-size: var(--text-large);
    }
  }

  .glossary-content > h2 {
    font-size: var(--text-large);
    line-height: 1.2;
    font-weight: var(--regular);
  }
}

/* keep the text measure, reserve the right margin column for sidenotes (breakpoint must match EditorSideNote.vue) */
@media (min-width: 1280px) {
  .glossary-term.margin-notes {
    max-inline-size: calc(var(--paragraph-width) + var(--sidenote-width) + var(--sidenote-gap));
    padding-inline-end: calc(var(--app-margin-small) + var(--sidenote-width) + var(--sidenote-gap));
    display: flow-root;
  }

  /* the sidenote padding above shifts the content box off viewport center, so the graph's 100vw breakout gets that half-column offset added back */
  .glossary-term.margin-notes .glossary-graph {
    margin-inline-start: calc(50% - 50vw + (var(--sidenote-width) + var(--sidenote-gap)) / 2);
  }
}

@media (max-width: 1440px) {
}
</style>
