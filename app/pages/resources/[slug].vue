<template>
  <article
    v-if="page"
    class="resources-term"
  >
    <header>
      <UiButton
        class="close"
        icon="arrow-left"
        variant="outline"
        rounded
        invert-icon
        label="BACK"
        size="sm"
        to="/resources"
      />
      <pre>{{ page }}</pre>
      <h1> {{ page[0].title }} </h1>
    </header>
    <div v-html="page[0].description" />
  </article>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()
const route = useRoute()

// Don’t Use Slugs as a Primary Key
// https://docs.directus.io/blog/directus-seo-tips-tricks.html#don-t-use-slugs-as-a-primary-key
const slug = route.params.slug as string

const { data: page } = await useAsyncData('resources-page', () => {
  return $directus.request(
    $readItems('resources', {
      filter: {
        slug: {
          _eq: slug,
        },
        status: {
          _neq: 'draft',
        },
      },
      limit: 1,
      fields: [
        '*',
        { people: ['*'] },
        { tags: ['*'] },
        { topics: ['*'] },
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
</script>

<style lang="postcss">
.resources-term {
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
