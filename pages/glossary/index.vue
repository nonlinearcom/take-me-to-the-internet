<template>
  <main class="glossary-page">
    <div class="terms-grid">
      <template
        v-for="(item, index) in glossary"
        :key="item.id"
      >
        <article
          class="term"
          :class="{ 'group-start': isNewGroup(index) }"
        >
          <NuxtLink
            class="stretched-link"
            :to="`/glossary/${item.slug}`"
          />
          <h2>
            {{ item.translations[0]?.term }}
          </h2>
          <p class="description">
            {{ truncate(generateText(item.translations[0].description), 150) }}
          </p>
        </article>
      </template>
    </div>
  </main>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()
const { locale, localeProperties } = useI18n()

const { data: glossary } = await useAsyncData('glossary', () => {
  return $directus.request(
    $readItems('glossary', {
      filter: {
        status: {
          _eq: 'published',
        },
      },
      sort: ['slug'],
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
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: localeProperties.value.language,
            },
          },
        },
      },
    }),
  )
}, {
  watch: [locale],
})

// Check if the current term starts a new row
function isNewGroup(index: number) {
  if (index === 0)
    return true // Always mark the first term as a new group

  const currentTerm = glossary.value?.[index]?.translations[0].term
  const previousTerm = glossary.value?.[index - 1]?.translations[0].term

  // Compare the first letters of the current and previous terms
  return currentTerm[0]?.toLowerCase() !== previousTerm[0]?.toLowerCase()
}
</script>

<style lang="postcss">
.glossary-page {
  padding: var(--app-margin-small);
  display: flex;
  flex-direction: column;

  .terms-grid {
    margin-left: 25vw;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .term {
    position: relative;
    border-top: 1px solid var(--border-color);
    padding: 8px 4px;
    /* background-color: red; */

    &.group-start {
      /* Force this item to the next row */
      grid-column: 1; /* Starts on the first column */
      grid-row: span 1; /* Jumps to the next row */
    }
  }
  .description {
    font-size: var(--text-small);
  }
}
</style>
