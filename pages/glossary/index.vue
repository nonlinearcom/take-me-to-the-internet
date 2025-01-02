<template>
  <main class="glossary-page">
    <template
      v-for="item in glossary"
      :key="item.id"
    >
      <article>
        <NuxtLink :to="`/glossary/${item.slug}`">
          <h2>{{ item.translations[languageCode].term }}</h2>
        </NuxtLink>
      </article>
    </template>
  </main>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()
const { locale } = useI18n()

// test
const languageCode = computed(() => {
  return locale.value === 'it' ? 1 : 0
})

const { data: glossary } = await useAsyncData('glossary', () => {
  return $directus.request(
    $readItems('glossary', {
      filter: {
        status: {
          _neq: 'draft',
        },
      },
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
</script>

<style lang="postcss">
glossary-page {
  padding: var(--app-margin);
  display: flex;
  flex-direction: column;
}
</style>
