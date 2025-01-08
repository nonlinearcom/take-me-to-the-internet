<template>
  <swiper-container
    ref="containerRef"
    auto-height
    grab-cursor
    mousewheel-force-to-axis
    navigation
    slides-per-view="auto"
    :space-between="24"
  >
    <swiper-slide
      v-for="{ id: key, directus_files_id } in data.content"
      :key
      data-allow-mismatch
    >
      <NuxtImg
        loading="lazy"
        :src="directus_files_id"
        :alt="directus_files_id?.description"
      />
    </swiper-slide>
  </swiper-container>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const containerRef = ref(null)
</script>

<style lang="postcss" scoped>
swiper-container {
  width: calc(100vw - var(--app-margin-small) * 2);
}

swiper-slide {
  width: auto;
  max-width: 100%;

  img {
    max-height: 360px;

    @media screen and (min-width: 768px) {
      max-height: 480px;
    }

    @media screen and (min-width: 1024px) {
      max-height: 640px;
    }
  }
}
</style>
