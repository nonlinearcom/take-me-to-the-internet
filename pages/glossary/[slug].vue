<template>
  <article class="glossary-term">
    <header>
      <UiButton
        class="close"
        icon="arrow-left"
        variant="outline"
        rounded
        invert-icon
        label="BACK"
        size="sm"
        to="/glossary"
      />

      <h1> {{ translation.term }} </h1>
    </header>
    <EditorContent
      v-if="translation?.description"
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
  console.log('page.value: ', page.value)
  const translation = page.value[0].translations.find(t => t.languages_code === languageCode.value) || 0
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.description)
  return translation
})
</script>

<style lang="postcss">
.glossary-term {
  a.close {
    position: absolute;
    display: flex;
    align-items: center;
    top: 28px;
    right: var(--app-margin-small);
    height: 28px;
    max-height: 28px;
    padding-left: 4px;
    padding-right: 12px;
    font-size: var(--text);
    text-transform: uppercase;
    border: 1px solid var(--text-color);
    border-radius: 25px;

    overflow: hidden;

    .icon {
      transition: transform 0.5s;
      width: 30px;
      height: 28px;
    }
  }

  header {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: calc(var(--app-margin) / 2);

    margin: var(--app-margin-small);
  }
}
@media (max-width: 1440px) {
}
</style>
