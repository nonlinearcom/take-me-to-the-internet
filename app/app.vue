<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({

  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Take me to the internet`
      : 'Take me to the internet'
  },
  meta: [
    { name: 'description', content: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.' },
    { property: 'og:description', content: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.' },
    { property: 'og:image', content: 'https://res.cloudinary.com/non-linear/image/upload/f_webp,q_auto,w_1536/take-me-to-the-internet/post-screen/2016/img_1' },
    { name: 'twitter:card', content: `summary_large_image` },
  ],
})
</script>

<style lang="postcss">

</style>
