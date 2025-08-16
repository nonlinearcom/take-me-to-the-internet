<template>
  <NuxtImg
    class="previewCover"
    loading="lazy"
    :src="cover"
    alt=""
    format="webp"
    sizes="xs:320 sm:640 md:768 lg:1024 xl:1280 xxl:1920"
    :style="{ transform: translatePosition }"
  />
</template>

<script>
export default {
  props: {
    cover: {
      type: String,
      default: null,
    },
    offset: {
      type: Number,
      default: 0,
      required: false,
    },
    xPos: {
      type: Number,
      default: 0,
    },
    yPos: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    translatePosition() {
      return `translate(${this.xPos}px, ${this.yPos - 120}px)`
    },
  },
}
</script>

<style lang="postcss">
.previewCover {
  /* this solution allows border-radius  */
  position: absolute !important;
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
