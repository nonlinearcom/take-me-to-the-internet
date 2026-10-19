<template>
  <NuxtImg
    class="previewCover"
    loading="lazy"
    :src="cover ?? undefined"
    alt=""
    format="webp"
    sizes="xs:320 sm:640 md:768 lg:1024 xl:1280 xxl:1920"
    :style="{ transform: translatePosition }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  cover?: string | null
  xPos?: number
  yPos?: number
}>(), {
  cover: null,
  xPos: 0,
  yPos: 0,
})

const translatePosition = computed(() => `translate(${props.xPos}px, ${props.yPos}px) translateY(-50%)`)
</script>

<style lang="postcss">
.previewCover {
  /* this solution allows border-radius  */
  position: absolute !important;
  /* anchor at the document origin so page coordinates apply directly; relies
     on no ancestor being positioned (otherwise the origin shifts with it) */
  inset-block-start: 0;
  inset-inline-start: 0;
  /* table rows are position: relative, so without this the preview paints
     under any row that follows it in the DOM; stays below panels (10+) */
  z-index: 1;
  width: auto;
  height: auto;
  max-width: 260px;
  max-height: 260px;
  object-fit: contain;
  object-position: center center;
  border-radius: var(--border-radius);
  pointer-events: none;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>
