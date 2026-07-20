<template>
  <article
    v-if="translation"
    class="glossary-term"
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
    <!--
    <div class="glossary-navigation">
      <NuxtLink
        v-if="previousPage"
        class="previous-button"
        :to="`/glossary/${previousPage.slug}`"
      >
        <UiIcon name="chevron-left" />
        {{ getTranslation(previousPage)?.term }}
      </NuxtLink>

      <NuxtLink
        v-if="nextPage"
        class="next-button"
        :to="`/glossary/${nextPage.slug}`"
      >
        {{ getTranslation(nextPage)?.term }}
        <UiIcon name="chevron-right" />
      </NuxtLink>
    </div> -->
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
                    media: ['id', { file: ['*'] }],
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
const currentPageIndex = computed(() => items.value.findIndex(page => page.slug === slug))

const nextPage = computed(() => {
  const i = currentPageIndex.value
  if (i < 0 || items.value.length === 0)
    return null
  return items.value[(i + 1) % items.value.length]
})

const previousPage = computed(() => {
  const i = currentPageIndex.value
  if (i < 0 || items.value.length === 0)
    return null
  return items.value[(i - 1 + items.value.length) % items.value.length]
})

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
  margin: var(--app-margin-small);
  max-width: 68ch;
  margin: 0 auto;

  header {
    margin-bottom: 96px;
    text-align: center;

    h1 {
      font-size: var(--text-large);
    }
  }

  .glossary-close {
    height: 100px;
    width: 100px;
    margin: var(--app-margin-small);
  }

  .glossary-content {
  }

  .glossary-navigation {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-top: 100px;
    max-width: 68ch;
  }

  .previous-button,
  .next-button {
    display: flex;
    align-items: center;
    margin-bottom: 64px;
  }
}

@media (max-width: 1440px) {
}
</style>
