<template>
  <main class="articles-page">
    <div class="articles-grid">
      <NuxtLink
        v-for="(article, key) in data"
        :key
        :to="`/articles/${article?.slug}`"
      >
        <h2 class="line">
          {{ article?.translations[0]?.title }}
        </h2>
        <time :datetime="article.date_updated.split('T')[0]">
          {{ formatDate(article.date_updated, { locale: languageCode }) }}
        </time>
      </NuxtLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { footerPages } from '~/assets/footerPages'

const { $directus, $readItems } = useNuxtApp()
const { locale, localeProperties } = useI18n()

const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { data } = await useAsyncData('page', () => {
  return $directus.request(
    $readItems('pages', {
      filter: {
        status: {
          _eq: 'published',
        },
        slug: {
          _nin: footerPages,
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

  .articles-grid {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-left: 25vw;

    h2 {
      display: inline-block;
      margin-right: var(--app-margin-small);
      font-size: var(--text-large);
    }

    time {
      color: var(--text-secondary);
      font-size: var(--text-small);
      text-transform: capitalize;
    }
  }
}
</style>
