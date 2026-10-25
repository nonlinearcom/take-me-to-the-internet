<template>
  <AppHeader />
  <LazySearchPalette v-if="searchMounted" />
  <main>
    <NuxtPage />
  </main>
</template>

<script setup>
// The palette brings the reka-ui dialog and combobox, the search index and the editor's text helpers (tiptap) with it, so its chunk is only fetched on the first open.
// It then stays mounted: the close animation and the built index survive later toggles.
const { isSearchOpen } = useApp()
const searchMounted = ref(false)
watch(isSearchOpen, (open) => {
  if (open)
    searchMounted.value = true
})

// Cmd/Ctrl+K lives here because the palette does not exist before the first open
function onKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

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
  // Static share image for all pages: a site-relative /assets/ URL, which nuxt-seo-utils makes absolute in the rendered head
  ogImage: img('5fae7d78-fcfa-4435-8898-77436e70eb7e', { width: 1200, height: 630, fit: 'cover', format: 'webp' }),
  twitterCard: 'summary_large_image',
})
</script>

<style lang="postcss">

</style>
