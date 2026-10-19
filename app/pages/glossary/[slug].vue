<template>
  <article
    v-if="translation"
    class="glossary-term margin-notes"
  >
    <header>
      <span class="pill">
        {{ t('glossary') }}
      </span>
      <h1 class="title">
        {{ translation.term }}
      </h1>
      <UpdatedOn
        :date="lastUpdated(page)"
        relative
      />
    </header>
    <EditorContent
      v-if="translation.description"
      class="prose glossary-content"
      :content="translation.description"
      :relation-blocks
      :relation-marks
      :relation-inline-blocks
    />
    <EditorFootNotes
      :key="translation.id"
      class="prose"
      :data="translation"
    />
    <GlossaryGraph
      :items="list ?? []"
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
const { t } = useI18n()
const languageCode = useLanguageCode()

const slug = route.params.slug as string

// the term and the full list (for the graph) are independent requests
const [{ list }, { data: page }] = await Promise.all([
  useGlossary(),
  useAsyncData(`glossary-${slug}`, () => $directus.request<GlossaryItem[]>(
    readItems('glossary', {
      filter: { slug: { _eq: slug } },
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
  ), {
    transform: rows => rows[0] ?? null,
  }),
])

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const translation = computed(() => {
  const translation = findTranslation(page.value?.translations, languageCode.value)
  if (translation)
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
  /* out of the flow like the glossary index, so the title starts at the
     viewport midpoint regardless of the app header's height */
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  padding-inline: var(--app-margin-small);
  max-inline-size: var(--paragraph-width);
  margin: 0 auto;
  /* the top half overlays the app header — let clicks through it,
     like the glossary index does */
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  /* the title fills the top half, vertically centered like the index's
     letter (but at its regular size) and flush with the text column;
     the content starts at 50vh */
  header {
    block-size: calc(var(--unit-100vh) / 2);
    display: grid;
    align-content: center;
    justify-items: start;
    pointer-events: none;

    .pill {
      font-size: var(--text-mini);
      margin-block-end: 8px;
    }
    h1 {
      font-size: var(--text-large);
      margin: 0;
      pointer-events: auto;
    }
  }

  /* the lead's own top margin would push the content below the fold line */
  .glossary-content > h2:first-child {
    margin-block-start: 0;
  }

  .glossary-content > h2 {
    font-size: var(--text-large);
    line-height: 1.2;
    font-weight: var(--regular);
  }

  /* the lead — every term's content opens with a heading-2 block */
  .glossary-content > h2:first-child {
    font-weight: var(--bold);
    margin-block-end: var(--app-margin);
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

/* larger type on big screens — the ch-based paragraph width scales with it,
   so the column grows while characters per line stay put */
@media (min-width: 1800px) {
  .glossary-term {
    --text: 22px;
    --text-large: 32px;
    font-size: var(--text);
  }
}
</style>
