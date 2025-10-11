<template>
  <main class="articles-page">
    <div class="articles-grid">
      <h3 class="tag">
        CABLES.GL
      </h3>

      <NuxtLink
        v-for="(article, key) in data"
        :key
        :to="`/articles/${article?.slug}`"
      >
        <h2 class="line">
          {{ article?.translations[0]?.title }}
        </h2>
        <time :datetime="article.date_updated.split('T')[0]">
          updated on {{ formatDate(article.date_updated, { locale: languageCode }) }}
        </time>
      </NuxtLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()
const { locale, localeProperties } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { data } = await useAsyncData('page-articles', () => {
  return $directus.request(
    $readItems('pages', {
      filter: {
        status: {
          _eq: 'published',
        },
        slug: {
          _nin: ['privacy', 'terms', 'about'],
        },
      },
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-left: 25vw;

    h2 {
      display: block;
      font-size: var(--text-large);
    }

    time {
      font-family: var(--font-stack-mono);
      color: var(--text-secondary);
      font-size: var(--text-mini);
      text-transform: uppercase;
      display: block;
      margin: 8px 0;
    }
  }
}
</style>
