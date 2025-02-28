<template>
  <article class="glossary-term">
    <header>
      <UiButton class="glossary-close" label="Glossary" variant="outline" rounded padded size="xs" to="/glossary" />
      <h1 class="title">
        {{ translation.term }}
      </h1>
    </header>
    <EditorContent v-if="translation?.description" class="prose glossary-content" :content="translation?.description"
      :relation-blocks />

    <div class="glossary-navigation">
      <NuxtLink class="previous-button" :to="`/glossary/${previousPage.slug}`">
        {{ getTranslation(previousPage).term }}
      </NuxtLink>

      <NuxtLink class="next-button" :to="`/glossary/${nextPage.slug}`">
        {{ getTranslation(nextPage).term }}
      </NuxtLink>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { EditorGallery, EditorMedia } from '#components'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },
]

const { $directus, $readItems } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()
const isLazy = useState('isLazy', () => false)

const slug = route.params.slug as string

const { list } = useGlossary()

const { data: page, error } = await useAsyncData('glossary-page', () => {
  return $directus.request(
    $readItems('glossary', {
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
}, { lazy: isLazy.value })

// workaround for the lazy loading after first fetch
if (!isLazy.value) {
  isLazy.value = true
}

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

// const page = ref(pageData.value?.page[0])
const currentPageIndex = computed(() => list.value?.findIndex(page => page.slug === slug))

const nextPage = computed(() => {
  if (!list.value || currentPageIndex.value == null)
    return null
  const page = currentPageIndex.value === list.value.length - 1 ? list?.value[0] : list?.value[currentPageIndex.value + 1]

  return page
})

// const previousPage = computed(() => currentPage.value == 0 ? list?.value[list.value.length - 1] : list?.value[currentPage?.value - 1])
const previousPage = computed(() => {
  if (!list.value || currentPageIndex.value == null)
    return null

  const page = currentPageIndex.value === 0 ? list?.value[list.value.length - 1] : list?.value[currentPageIndex?.value - 1]
  return page
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

function getTranslation(item: any) {
  return item.translations?.find(t => t.languages_code.startsWith(locale.value)) || 0
}

const translation = computed(() => {
  if (!page.value)
    return null

  const translation = getTranslation(page.value[0])
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.description)
  return translation
})

useHighlight()
</script>

<style lang="postcss">
.glossary-term {
  position: relative;
  margin: var(--app-margin-small);

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
    max-width: 68ch;
    margin: 0 auto;
  }

  .glossary-navigation {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-top: 100px;
    max-width: 68ch;
  }
}

@media (max-width: 1440px) {}
</style>
