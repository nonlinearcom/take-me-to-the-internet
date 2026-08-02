<template>
  <figure :class="layout">
    <template v-if="mediaType === 'image'">
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
      v-else-if="mediaType === 'video'"
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
        v-if="!isOutside || isMediumScreen"
        class="followCursor"
        :class="{ mobile: isMediumScreen }"
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
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const { fileUrl } = useFiles()
// Directus dropdown values may be stored capitalized; normalize for CSS classes
const layout = computed(() => props.data?.layout?.toLowerCase())
const src = fileUrl(props.data.file)
const mediaType = computed(() => getMediaType(props.data.file))

const { isMediumScreen } = useApp()

const video = ref()
const { elementX, elementY, isOutside } = useMouseInElement(video)

const { playing } = useMediaControls(video, { src })

const svgContent = ref('')
async function fetchHtml() {
  if (!src)
    return
  try {
    const response = await fetch(src)
    svgContent.value = await response.text()
  } catch {
    // leave svgContent empty if the inline SVG can't be loaded
  }
}

// Only SVGs are rendered inline via svgContent; skip the fetch for raster
// images and videos (NuxtImg / <video> handle those by id/url).
if (props.data.file?.type?.startsWith('image/svg'))
  fetchHtml()
</script>

<style lang="postcss" scoped>
/* match the gallery caption: small secondary text, tight under the media
   (figure prefix outranks the .prose figcaption global) */
figure figcaption {
  margin-block-start: 8px;
  font-size: var(--text-small);
  /* p-based gallery captions inherit the global p weight; match it here */
  font-weight: var(--regular);
  color: var(--text-secondary);
}

/* the prose img/svg 32px block margin would otherwise push the caption away */
:is(.image, .video, div):has(+ figcaption) {
  margin-block-end: 0;

  :deep(svg) {
    margin-block-end: 0;
  }
}

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
