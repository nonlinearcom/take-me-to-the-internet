<template>
  <main class="articles-page">
    <div class="articles-grid">
      <section
        v-for="column in columns"
        :key="column.type"
        class="articles-column"
      >
        <h3 class="tag">
          {{ column.tag }}
        </h3>

        <NuxtLink
          v-for="article in column.articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
        >
          <h2 class="line">
            {{ article.translations[0]?.title }}
          </h2>
          <time :datetime="lastUpdated(article).split('T')[0]">
            updated on {{ formatDate(lastUpdated(article), { locale: languageCode }) }}
          </time>
        </NuxtLink>

        <p
          v-if="!column.articles.length"
          class="empty"
        >
          Nothing here yet
        </p>
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

const { $directus } = useNuxtApp()
const { locale } = useI18n()
const languageCode = useLanguageCode()

useSeoMeta({
  title: 'Articles',
  description: 'Articles and tutorials on cables.gl, creative coding and web design.',
})

const { data } = await useAsyncData('page-articles', () => {
  return $directus.request<Page[]>(
    readItems('pages', {
      filter: {
        status: {
          _eq: 'published',
        },
        type: {
          _in: ARTICLE_TYPES,
        },
      },
      sort: ['-date_created'],
      fields: [
        '*',
        {
          translations: [
            'title',
          ],
        },
      ],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: languageCode.value,
            },
          },
        },
      },
    }),
  )
}, {
  watch: [locale],
})

const columns = computed(() => [
  { type: 'note', tag: 'Notes' },
  { type: 'tutorial', tag: 'Tutorials' },
].map(column => ({
  ...column,
  articles: data.value?.filter(article => article.type === column.type) ?? [],
})))
</script>

<style lang="postcss">
.articles-page {
  margin: 25vh 0 50px;
  padding: var(--app-margin-small);
  display: flex;
  flex-direction: column;

  .tag {
    display: inline-block;
    font-size: var(--text-small);
    text-transform: uppercase;
    font-family: var(--font-stack-mono);
    font-weight: var(--regular-mono);
    border: 1px solid var(--border-color);
    padding: 2px 8px;
    border-radius: 25px;
  }

  .articles-grid {
    display: grid;
    /* minmax(0, …) lets long titles wrap instead of widening the column */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--app-margin);

    @media (width <= 900px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .articles-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    h2 {
      display: block;
      font-size: var(--text-large);
    }

    time,
    .empty {
      font-family: var(--font-stack-mono);
      color: var(--text-secondary);
      font-size: var(--text-mini);
      text-transform: uppercase;
      display: block;
      margin-block: 8px;
    }
  }
}
</style>
