<template>
  <div class="gallery">
    <BlossomCarousel :id="carouselId">
      <div
        v-for="{ id: key, directus_files_id } in data.content"
        :key
        data-blossom-slide
      >
        <NuxtImg
          loading="lazy"
          :src="directus_files_id"
          :alt="directus_files_id?.description"
        />
      </div>
    </BlossomCarousel>

    <BlossomPrev
      :for="carouselId"
      aria-label="Previous slide"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ><path d="M15 18l-6-6 6-6" /></svg>
    </BlossomPrev>
    <BlossomNext
      :for="carouselId"
      aria-label="Next slide"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ><path d="M9 18l6-6-6-6" /></svg>
    </BlossomNext>
  </div>
</template>

<script setup lang="ts">
import { BlossomCarousel, BlossomNext, BlossomPrev } from '@blossom-carousel/vue'
import '@blossom-carousel/vue/style.css'

const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const carouselId = `editor-gallery-${props.id}`
</script>

<style lang="postcss" scoped>
.gallery {
  position: relative;
}

[blossom-carousel] {
  width: calc(100vw - var(--app-margin-small) * 2);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 24px;
  scroll-snap-type: x mandatory;
}

[data-blossom-slide] {
  scroll-snap-align: start;

  img {
    max-width: calc(100vw - var(--app-margin-small) * 2);
    max-height: 360px;

    @media screen and (min-width: 768px) {
      max-height: 480px;
    }

    @media screen and (min-width: 1024px) {
      max-height: 640px;
    }
  }
}

[blossom-prev],
[blossom-next] {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  padding: 0;
  border: 0;
  background: none;
  color: currentColor;
  cursor: pointer;

  svg {
    display: block;
    width: 28px;
    height: 28px;
  }

  &[disabled] {
    opacity: 0.35;
    pointer-events: none;
  }
}

[blossom-prev] {
  left: 4px;
}

[blossom-next] {
  right: 4px;
}
</style>
