<template>
  <div class="gallery">
    <BlossomCarousel
      :id="carouselId"
      ref="carousel"
    >
      <figure
        v-for="{ id: key, directus_files_id } in data.content"
        :key
        data-blossom-slide
      >
        <NuxtImg
          loading="lazy"
          draggable="false"
          :src="directus_files_id?.id ?? directus_files_id"
          :alt="directus_files_id?.description"
        />
      </figure>
    </BlossomCarousel>

    <div class="controls">
      <p
        class="caption"
        aria-live="polite"
      >
        {{ activeDescription }}
      </p>

      <span class="pagination">{{ activeIndex + 1 }}/{{ slideCount }}</span>

      <UiButton
        icon="chevron-left"
        variant="ghost"
        rounded
        aria-label="Previous slide"
        :aria-controls="carouselId"
        :disabled="!canPrev"
        @click="goTo('prev')"
      />
      <UiButton
        icon="chevron-right"
        variant="ghost"
        rounded
        aria-label="Next slide"
        :aria-controls="carouselId"
        :disabled="!canNext"
        @click="goTo('next')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlossomCarousel } from '@blossom-carousel/vue'
import '@blossom-carousel/vue/style.css'

const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const carouselId = `editor-gallery-${props.id}`
const slideCount = computed(() => props.data?.content?.length ?? 0)

/* The library's own prev/next/dots rely on the Invoker Commands API
   (command/commandfor), which has no fallback in browsers without it, so
   navigation and the counter are driven by native scroll state instead. */
const carousel = useTemplateRef<InstanceType<typeof BlossomCarousel>>('carousel')
const activeIndex = ref(0)
const canPrev = ref(false)
const canNext = ref(slideCount.value > 1)

const activeDescription = computed(() =>
  props.data?.content?.[activeIndex.value]?.directus_files_id?.description ?? '',
)

function scroller() {
  return (carousel.value?.el ?? null) as HTMLElement | null
}

/* resting scroll offsets per slide, mirroring scroll-snap: slide start on
   the snapport start (scroll-padding included), clamped to the range */
function snapStops(el: HTMLElement) {
  const inset = Number.parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0
  const max = Math.max(el.scrollWidth - el.clientWidth, 0)
  const base = el.getBoundingClientRect().left
  return [...el.querySelectorAll('[data-blossom-slide]')].map((slide) => {
    const x = slide.getBoundingClientRect().left - base + el.scrollLeft - inset
    return Math.min(Math.max(x, 0), max)
  })
}

function update() {
  const el = scroller()
  if (!el)
    return

  const max = Math.max(el.scrollWidth - el.clientWidth, 0)
  canPrev.value = el.scrollLeft > 1
  canNext.value = el.scrollLeft < max - 1

  let index = 0
  let nearest = Number.POSITIVE_INFINITY
  snapStops(el).forEach((x, i) => {
    const distance = Math.abs(x - el.scrollLeft)
    if (distance <= nearest) {
      nearest = distance
      index = i
    }
  })
  activeIndex.value = index
}

function goTo(direction: 'prev' | 'next') {
  const el = scroller()
  if (!el)
    return

  const stops = snapStops(el)
  const target = direction === 'next'
    ? stops.find(x => x > el.scrollLeft + 1)
    : stops.findLast(x => x < el.scrollLeft - 1)

  if (target !== undefined)
    el.scrollTo({ left: target, behavior: 'smooth' })
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  const el = scroller()
  if (!el)
    return

  el.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  /* the images load lazily, so at mount time the strip has no overflow yet
     and canNext would stay false; re-measure whenever a slide gets its size */
  resizeObserver = new ResizeObserver(update)
  el.querySelectorAll('[data-blossom-slide]').forEach(slide => resizeObserver!.observe(slide))
  update()
})

onBeforeUnmount(() => {
  scroller()?.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
  resizeObserver?.disconnect()
})
</script>

<style lang="postcss" scoped>
.gallery {
  position: relative;
  margin-block: 32px;
}

[blossom-carousel] {
  /* edge vars come from the page context (see global.css): the strip spans
     the full viewport while the padding rests the first/last slide on the
     text column edges; without them it stays at container width */
  inline-size: calc(100% + var(--gallery-edge-start, 0px) + var(--gallery-edge-end, 0px));
  margin-inline-start: calc(-1 * var(--gallery-edge-start, 0px));
  padding-inline: var(--gallery-edge-start, 0px) var(--gallery-edge-end, 0px);
  scroll-padding-inline: var(--gallery-edge-start, 0px) var(--gallery-edge-end, 0px);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: end;
  gap: 12px;
  scroll-snap-type: x mandatory;
}

/* images scale to a shared max height at their own aspect ratio; the width
   cap takes over on narrow screens (both are max-constraints so the box
   always hugs the image — a fixed height would letterbox capped slides) */
[data-blossom-slide] {
  scroll-snap-align: start;
  margin: 0;

  img {
    inline-size: auto;
    block-size: auto;
    max-block-size: min(50vh, 480px);
    max-inline-size: calc(100vw - var(--app-margin-small) * 2);
    margin: 0;
  }
}

.controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-block-start: 12px;

  .caption {
    flex: 1;
    margin: 0;
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .pagination {
    font-family: var(--font-stack-mono);
    font-weight: var(--regular-mono);
    font-size: var(--text-small);
    font-variant-numeric: tabular-nums;
    color: var(--text-secondary);
  }

  /* undo the .prose img/svg figure treatment on the button icon svgs
     (:deep — the svg renders inside UiButton, outside this scope) */
  :deep(svg) {
    margin: 0;
    background: none;
    border-radius: 0;
  }
}
</style>
