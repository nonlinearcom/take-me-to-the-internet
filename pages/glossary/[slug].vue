<template>
  <article class="glossary-term">
    <header>
      <UiButton
        class="close"
        label="Glossary"
        variant="outline"
        rounded
        size="xs"
        to="/glossary"
      />
      <h1 class="title">
        {{ translation.term }}
      </h1>
      <!-- <UiButton
        class="close"
        icon="close"
        variant="outline"
        rounded
        to="/glossary"
      /> -->
    </header>
    <EditorContent
      v-if="translation?.description"
      class="glossary-content"
      :content="translation?.description"
      :relation-blocks
    />
  </article>
</template>

<script lang="ts" setup>
import { EditorGallery, EditorImage } from '#components'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'image', component: EditorImage },
]

const { $directus, $readItems } = useNuxtApp()
const route = useRoute()
const { locale } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

// Don’t Use Slugs as a Primary Key
// https://docs.directus.io/blog/directus-seo-tips-tricks.html#don-t-use-slugs-as-a-primary-key
const slug = route.params.slug as string

const { data: page } = await useAsyncData('glossary-page', () => {
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
  // console.log('page.value: ', page.value)
  const translation = page.value[0].translations.find(t => t.languages_code === languageCode.value) || 0
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.description)
  return translation
})
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

  .glossary-content {
    max-width: 68ch;
    margin: 0 auto;
  }
}
@media (max-width: 1440px) {
}
</style>
