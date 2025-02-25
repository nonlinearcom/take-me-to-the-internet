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

    <div class="nav-buttons">
      <NuxtLink class="previous-button" :to="`/glossary/${previousPage.slug}`">
        {{ previousButtonTranslation.term }}
      </NuxtLink>

      <NuxtLink class="next-button" :to="`/glossary/${nextPage.slug}`">
        {{ nextButtonTranslation.term }}
      </NuxtLink>
    </div>
    <!-- <pre>
    {{ previousPage }}
    </pre> -->
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

// Don’t Use Slugs as a Primary Key
// https://docs.directus.io/blog/directus-seo-tips-tricks.html#don-t-use-slugs-as-a-primary-key
const slug = route.params.slug as string

const { data: pageData } = await useAsyncData('glossary-page', async () => {
  const [page, pageList] = await Promise.all([
    $directus.request(
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
                      image: ['*'],
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
    ),
    $directus.request(
      $readItems('glossary', {
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
                      image: ['*'],
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
    ),
  ])

  return { page, pageList }
})

const page = ref(pageData.value?.page)
const pageList = ref(pageData.value?.pageList)
const currentPage = computed(() => pageList.value?.findIndex(page => page.slug === slug))
const nextPage = computed(() => pageList?.value[currentPage?.value + 1])
const previousPage = computed(() => pageList?.value[currentPage?.value - 1])

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

function getTranslation(item: any) {
  console.log(item.translations)
  const translation = item.translations.find(t => t.languages_code.startsWith(locale.value)) || 0
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.description)
  return translation
}

const translation = computed(() => {
  if (!page.value)
    return null

  const translation = page.value[0].translations.find(t => t.languages_code.startsWith(locale.value)) || 0
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.description)
  return translation
})

// const previousTranslation = computed(() => {
//   if (!previousPage.value)
//     return null

//   const previousTranslation = previousPage.value.translations.find(t => t.languages_code.startsWith(locale.value)) || 0
//   if (!previousTranslation)
//     return null

//   injectDataIntoContent(previousTranslation.editor_nodes, previousTranslation.description)
//   return previousTranslation
// })

const previousButtonTranslation = computed(() => {
  return getTranslation(previousPage.value)
})

const nextButtonTranslation = computed(() => {
  return getTranslation(nextPage.value)
})
// const previousTranslation = getTranslation(previousPage.value)

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

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-top: 100px;
    max-width: 68ch;
  }
}

@media (max-width: 1440px) {}
</style>
