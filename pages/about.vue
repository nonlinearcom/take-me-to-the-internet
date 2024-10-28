<template>
  <h1>{{ global?.title }}</h1>
  <p>{{ global?.description }}</p>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()
const { data: global } = await useAsyncData('global', () => {
  return $directus.request($readItems('global'))
})

useSeoMeta({
  title: 'About',
  // description: 'Default Description',
})
</script>

<style lang="postcss">

</style>
