<template>
  <figure>
    <template v-if="getMediaType(data.file) === 'image'">
      <!-- <pre v-if="data.file.type?.startsWith('image/svg')">{{ data }}</pre> -->
      <div
        v-if="data.file.type.startsWith('image/svg')"
        v-html="svgContent"
      />
      <NuxtImg
        v-else
        class=" image"
        loading="lazy"
        :src="data.file?.id"
        :alt="data.file?.description"
      />
    </template>
    <div
      v-else-if="getMediaType(data.file) === 'video'"
      class="video"
    >
      <video
        ref="video"
        playsinline
        loop
        muted
        autoplay
      >
        <source :src>
      </video>
      <button
        v-if="!isOutside || isTablet"
        class="followCursor"
        :class="{ mobile: isTablet }"
        :style="`transform: translate(${elementX - 25}px, ${elementY - 25}px)`"
        @click="playing = !playing"
      >
        <UiIcon :name="playing ? 'pause' : 'play'" />
      </button>
    </div>
    <figcaption v-if="data.file?.description">
      {{ data.file?.description }}
    </figcaption>
  </figure>

  <!-- <pre> {{ data }}</pre> -->
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const { fileUrl } = useFiles()
const src = fileUrl(props.data.file)

const breakpoints = useBreakpoints({ tablet: 1024 })
const isTablet = breakpoints.smaller('tablet')

const video = ref()
const { elementX, elementY, isOutside } = useMouseInElement(video)

const { playing } = useMediaControls(video, { src })

const svgContent = ref('')
async function fetchHtml() {
  // Replace with your actual async fetch call
  const response = await fetch(fileUrl(props.data.file.id))
  const data = await response.text()
  svgContent.value = data
}

fetchHtml()
</script>

<style lang="postcss" scoped>
.video {
  position: relative;

  video {
    display: block;
    width: 100%;
  }
}

.followCursor {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 12px;
  position: absolute;
  top: 0;
  left: 0;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-radius: 50%;
  cursor: none;

  /* svg {
    width:100%;
    height:100%;
  }

  &.mobile {
    top: auto;
    bottom: 0;
    border-radius: 0;
    cursor: pointer;
  } */
}
</style>
