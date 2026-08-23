<template>
  <AppHeader />
  <SearchPalette />
  <main>
    <NuxtPage />
  </main>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Take me to the internet`
      : 'Take me to the internet'
  },
})

const img = useImage()

useSeoMeta({
  description: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.',
  // Static share image for all pages, served by Directus (host from runtime config)
  ogImage: img('5fae7d78-fcfa-4435-8898-77436e70eb7e', { width: 1200, height: 630, fit: 'cover', format: 'webp' }),
  twitterCard: 'summary_large_image',
})
</script>

<style lang="postcss">

</style>
