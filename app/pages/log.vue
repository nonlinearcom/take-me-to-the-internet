<template>
  <article class="log">
    <logTable :table-data="logs" />
    <NuxtPage />
  </article>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

useSeoMeta({
  title: 'Log',
  description: 'Teaching log: courses, workshops and lectures',
})

const { $directus } = useNuxtApp()

const { data: logs } = await useAsyncData('logs', () => {
  return $directus.request(
    readItems('log', {
      filter: {
        status: {
          _neq: 'draft',
        },
      },
      fields: [
        'slug',
        'status',
        'title',
        'type',
        'role',
        'institution',
        'location',
        'cover',
        'year',
      ],
      sort: ['-year'],
    }),
  )
})
</script>

<style lang="postcss">
article.log {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
