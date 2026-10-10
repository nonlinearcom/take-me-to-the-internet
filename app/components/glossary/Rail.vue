<template>
  <BlossomCarousel
    ref="carousel"
    class="glossary-rail"
    aria-label="Glossary terms"
    @pointermove="onPointerMove"
    @pointerleave="onRailLeave"
  >
    <section
      v-for="group in chunkedGroups"
      :key="group.letter"
      class="letter-group"
      data-blossom-slide
      :data-letter="group.letter"
      @pointerenter="onGroupEnter(group.letter)"
    >
      <h2 class="letter-label">
        {{ group.letter }}
      </h2>
      <div class="group-terms">
        <div
          v-for="(column, index) in group.columns"
          :key="index"
          class="term-column"
        >
          <article
            v-for="item in column"
            :key="item.id"
            class="term"
            :data-id="item.id"
          >
            <NuxtLink
              class="stretched-link"
              :to="`/glossary/${item.slug}`"
            />
            <h3 class="term-title">
              <span class="line">{{ item.translations[0]?.term }}</span>
              <span
                v-if="recetlyUpdated(item)"
                class="dot"
              />
            </h3>
            <p class="description">
              {{ leadText(item) }}
            </p>
          </article>
        </div>
      </div>
    </section>
  </BlossomCarousel>
</template>

<script lang="ts" setup>
import type { JSONContent } from 'tiptap-render-view/vue'
import { BlossomCarousel } from '@blossom-carousel/vue'
import '@blossom-carousel/vue/style.css'

// Structural subset of GlossaryItem: defineProps can't resolve the global
// declarations from app/types, so the shape is repeated here (as in Graph.vue).
interface RailItem {
  id: number
  slug: string
  date_updated: string
  translations: { term: string, description?: JSONContent | null }[]
}

interface LetterGroup {
  letter: string
  items: RailItem[]
}

const props = defineProps<{
  // letters in display order, each with its terms already sorted
  groups: LetterGroup[]
}>()

// the letter under the pointer, or failing that the one at the snap origin;
// empty until the rail has either
const letter = defineModel<string>('letter', { default: '' })

const carousel = useTemplateRef<InstanceType<typeof BlossomCarousel>>('carousel')
const scrolledLetter = ref('')
const hoverLetter = ref('')

watch(() => hoverLetter.value || scrolledLetter.value, (value) => {
  letter.value = value
})

// hover preview only on hover-capable devices, so a tap on touch screens doesn't pin a letter the scroll tracking can no longer override
let canHover = false

function onGroupEnter(letter: string) {
  if (canHover)
    hoverLetter.value = letter
}

// scrolling clears the hover preview
// remember where the pointer sits and hit-test that spot once the scroll goes quiet
let pointer: { x: number, y: number } | null = null
let scrollEndTimer: ReturnType<typeof setTimeout> | undefined

function onPointerMove(event: PointerEvent) {
  pointer = { x: event.clientX, y: event.clientY }
}

function onRailLeave() {
  pointer = null
  hoverLetter.value = ''
}

// Blossom blocks the first click after a drag; if the release fires no click,
// the block would swallow the next real click on a term — defuse it with a
// throwaway click once the drag ends.
let dragDistance = 0
let lastDragX = 0

function onRailPointerDown(event: PointerEvent) {
  dragDistance = 0
  lastDragX = event.clientX
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd, { once: true })
}

function onDragMove(event: PointerEvent) {
  dragDistance += Math.abs(event.clientX - lastDragX)
  lastDragX = event.clientX
}

function onDragEnd() {
  window.removeEventListener('pointermove', onDragMove)
  if (dragDistance > 10) {
    setTimeout(() => {
      window.dispatchEvent(new MouseEvent('click', { cancelable: true }))
    }, 0)
  }
}

function refreshHover() {
  if (!canHover || !pointer)
    return
  const target = document.elementFromPoint(pointer.x, pointer.y)
  const letter = target?.closest<HTMLElement>('[data-letter]')?.dataset.letter
  if (letter)
    hoverLetter.value = letter
}

let raf = 0
let resizeObserver: ResizeObserver | undefined

// CSS can't pack variable-height cards into height-bound columns without
// cropping (grid needs uniform rows, flex column-wrap breaks intrinsic
// sizing inside max-content tracks), so measure the rendered cards and
// chunk each letter into as many columns as its items need.
const measurements = shallowRef<{
  available: number
  gap: number
  heights: Map<string, number>
} | null>(null)

const FALLBACK_TERM_HEIGHT = 120

const chunkedGroups = computed(() => {
  const m = measurements.value
  // unmeasured (SSR, first paint): one card per column — with the full
  // leads that's what the packer settles on anyway, so the page doesn't jump
  const available = m?.available ?? 0
  const gap = m?.gap ?? 8
  return props.groups.map(({ letter, items }) => {
    const columns: RailItem[][] = []
    let column: RailItem[] = []
    let used = 0
    for (const item of items) {
      const height = m?.heights.get(String(item.id)) ?? FALLBACK_TERM_HEIGHT
      const next = used + (column.length ? gap : 0) + height
      if (column.length && next > available) {
        columns.push(column)
        column = [item]
        used = height
      } else {
        column.push(item)
        used = next
      }
    }
    if (column.length)
      columns.push(column)
    return { letter, columns }
  })
})

function measureLayout() {
  const el = carousel.value?.el as HTMLElement | null
  const terms = el?.querySelector<HTMLElement>('.group-terms')
  const column = el?.querySelector<HTMLElement>('.term-column')
  if (!el || !terms || !column)
    return
  const heights = new Map<string, number>()
  el.querySelectorAll<HTMLElement>('.term').forEach((term) => {
    if (term.dataset.id)
      heights.set(term.dataset.id, term.offsetHeight)
  })
  measurements.value = {
    available: terms.clientHeight,
    gap: Number.parseFloat(getComputedStyle(column).rowGap) || 8,
    heights,
  }
}

function onScroll() {
  // scrolling takes back control from a hover preview (the pointer sits
  // still, so no pointerenter would refresh it while columns slide by)
  hoverLetter.value = ''
  clearTimeout(scrollEndTimer)
  scrollEndTimer = setTimeout(refreshHover, 150)
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(updateLetter)
}

// The current letter is the group whose start edge sits closest to the
// snapport origin (container edge + scroll padding) — except at the end
// of the rail, where the trailing letters can never reach the origin, so
// once no further snap stop is reachable the last group takes over.
function updateLetter() {
  const el = carousel.value?.el as HTMLElement | null
  if (!el)
    return
  const groupEls = [...el.querySelectorAll<HTMLElement>('[data-letter]')]
  if (!groupEls.length)
    return
  const inset = Number.parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0
  const elLeft = el.getBoundingClientRect().left
  const snapLefts = groupEls.map(group =>
    group.getBoundingClientRect().left - elLeft + el.scrollLeft - inset)
  const maxScroll = el.scrollWidth - el.clientWidth
  const hasFurtherSnap = snapLefts.some(left =>
    left > el.scrollLeft + 1 && left <= maxScroll + 1)
  if (!hasFurtherSnap) {
    scrolledLetter.value = groupEls[groupEls.length - 1]!.dataset.letter ?? ''
    return
  }
  let best = ''
  let nearest = Number.POSITIVE_INFINITY
  snapLefts.forEach((left, index) => {
    const distance = Math.abs(left - el.scrollLeft)
    if (distance < nearest) {
      nearest = distance
      best = groupEls[index]!.dataset.letter ?? ''
    }
  })
  if (best)
    scrolledLetter.value = best
}

watch(() => props.groups, () => nextTick(() => {
  measureLayout()
  updateLetter()
}))

onMounted(() => {
  canHover = window.matchMedia('(hover: hover)').matches
  const el = carousel.value?.el as HTMLElement | null
  el?.addEventListener('scroll', onScroll, { passive: true })
  el?.addEventListener('pointerdown', onRailPointerDown)
  if (el) {
    resizeObserver = new ResizeObserver(() => {
      measureLayout()
      updateLetter()
    })
    resizeObserver.observe(el)
  }
  measureLayout()
  updateLetter()
})

onBeforeUnmount(() => {
  const el = carousel.value?.el as HTMLElement | null
  el?.removeEventListener('scroll', onScroll)
  el?.removeEventListener('pointerdown', onRailPointerDown)
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  resizeObserver?.disconnect()
  cancelAnimationFrame(raf)
  clearTimeout(scrollEndTimer)
})

// Every term's content opens with a heading-2 lead (see pages/glossary/[slug].vue);
// show it whole instead of an ellipsised cut of the full text.
function leadText(item: RailItem) {
  const description = item.translations[0]?.description
  if (!description)
    return ''
  const lead = description.content?.[0]
  if (lead?.type === 'heading' && lead.attrs?.level === 2)
    return generateText({ type: 'doc', content: [lead] })
  return truncate(generateText(description), 150)
}

function recetlyUpdated(item: RailItem) {
  const updated = new Date(item.date_updated).getTime()
  const today = Date.now()
  const diffTime = Math.abs(today - updated)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 10
}
</script>

<style lang="postcss">
/* not scoped (neither Vue-scoped nor to [blossom-carousel]): Blossom's teardown removes that attribute while the page is still visible in the leave transition, and the layout must survive it */
.glossary-rail {
  --cols: 4;
  --gap: 32px;
  /* an exact number of columns always fits between the page margins */
  --subcol-width: calc((100vw - 2 * var(--app-margin-small) - (var(--cols) - 1) * var(--gap)) / var(--cols));

  overflow: auto clip;
  scrollbar-width: none;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  /* uniform pitch between and within groups keeps the exact-fit math true */
  gap: var(--gap);
  padding-inline: var(--app-margin-small);
  padding-block-end: var(--app-margin-small);
  scroll-padding-inline: var(--app-margin-small);
  /* Blossom mirrors this and pauses it during drag */
  scroll-snap-type: x mandatory;

  .letter-group {
    position: relative;
    scroll-snap-align: start;
    /* a stack of unmeasured cards taller than the rail must not grow the
       rail's row: the packer reads that height back and would never split */
    min-block-size: 0;
    display: grid;
    /* label + terms; keeps terms height definite */
    grid-template-rows: auto minmax(0, 1fr);
    row-gap: 8px;

    &::before {
      content: '';
      position: absolute;
      inset-block: 0;
      inset-inline-start: calc(var(--gap) / -2);
      inline-size: 1px;
      background: var(--border-color);
    }
  }

  .letter-label {
    font-size: var(--text-mini);
    font-weight: var(--regular);
    color: var(--text-secondary);
    margin: 0;
    padding-inline-start: 4px;
  }

  .group-terms {
    display: flex;
    gap: var(--gap);
    min-block-size: 0;
    overflow: hidden;
  }

  .term-column {
    inline-size: var(--subcol-width);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  .term {
    position: relative;
    padding: 8px 4px;

    .term-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: var(--text);
    }
  }

  .description {
    /* font-size: var(--text-small); */
    font-size: clamp(var(--text-mini), 1vw, var(--text-small));
  }

  .stretched-link::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    content: '';
  }

  /* the stretched link makes the whole card the hover target, so the
     shared .line underline is driven from the card, not the title */
  .term:has(.stretched-link:focus-visible) .line::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  @media (hover) {
    .term:hover .line::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
}

@media (width >= 1800px) {
  .glossary-rail {
    --cols: 7;
  }
}

@media (1600px <= width < 1800px) {
  .glossary-rail {
    --cols: 5;
  }
}

@media (900px < width <= 1280px) {
  .glossary-rail {
    --cols: 3;
  }
}

@media (600px < width <= 900px) {
  .glossary-rail {
    --cols: 2;
  }
}

@media (width <= 600px) {
  .glossary-rail {
    --cols: 2;
  }
}
</style>
