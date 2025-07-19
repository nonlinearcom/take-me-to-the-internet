<template>
  <div class="gallery-video">
    <video
      ref="video"
      class="responsive"
    />

    <button
      v-if="!isOutside || isMediumScreen"
      class="followCursor"
      :class="{ mobile: isMediumScreen }"
      :style="moveButton"
      @click="playing = !playing"
    >
      <UiIcon
        v-if="playing"
        name="pause"
      />
      <UiIcon
        v-else
        name="play"
      />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

const video = ref()
const videoSrc = computed(() => `https://res.cloudinary.com/non-linear/video/upload/v1/${props.item.media}`)

const { isMediumScreen } = useApp()

const { elementX, elementY, isOutside } = useMouseInElement(video)
const moveButton = computed(() => {
  return (isMediumScreen.value)
    ? ''
    : `transform: translate(${elementX.value - 25}px, ${elementY.value - 25}px)`
})

// TODO: add Scrubber & poster
// https://github.com/vueuse/vueuse/blob/main/packages/core/useMediaControls/demo.vue
// poster: 'https://bitmovin.com/wp-content/uploads/2016/06/sintel-poster.jpg',

const { playing } = useMediaControls(video, {
  src: videoSrc,
})
</script>

<style lang="postcss">
.gallery-video {
  position: relative;

  video {
    display: block;
  }

  .followCursor {
    width: 50px;
    height: 50px;
    padding: 12px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    color: var(--text-color);
    background-color: var(--bg-color);
    border-radius: 50%;
    cursor: none;

    svg {
      width: 100%;
      height: 100%;
    }

    &.mobile {
      top: auto;
      bottom: 0;
      border-radius: 0;
      cursor: pointer;
    }
  }
}
</style>
