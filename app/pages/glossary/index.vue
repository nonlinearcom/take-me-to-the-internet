<template>
  <div class="glossary-page">
    <div
      class="letter-display"
      aria-hidden="true"
    >
      <Transition
        name="letter-fade"
        mode="out-in"
      >
        <span :key="displayLetter">{{ displayLetter }}</span>
      </Transition>
    </div>

    <BlossomCarousel
      ref="carousel"
      class="letter-rail"
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
                {{ item.translations[0]?.term }}
                <span
                  v-if="recetlyUpdated(item)"
                  class="dot"
                />
              </h3>
              <p class="description">
                {{ truncate(generateText(item.translations?.[0]?.description), 150) }}
              </p>
            </article>
          </div>
        </div>
      </section>
    </BlossomCarousel>
  </div>
</template>

<script lang="ts" setup>
import { BlossomCarousel } from '@blossom-carousel/vue'
import { readItems } from '@directus/sdk'
import '@blossom-carousel/vue/style.css'

const { $directus } = useNuxtApp()
const { locale } = useI18n()
const languageCode = useLanguageCode()

useSeoMeta({
  title: 'Glossary',
  description: 'A glossary of terms around creative coding, web design and development.',
})

const { data: glossary } = await useAsyncData('glossary-page', () => {
  return $directus.request<GlossaryItem[]>(
    readItems('glossary', {
      filter: {
        status: {
          _eq: 'published',
        },
      },
      sort: ['slug'],
      fields: [
        '*',
        {
          translations: [
            '*',
            {
              editor_nodes: [
                '*',
                {
                  item: {
                    image: ['*'],
                    gallery: [
                      { content: ['*'] },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: languageCode.value,
            },
          },
        },
      },
    }),
  )
}, {
  watch: [locale],
})

// Group by the displayed term's first letter (not the slug)
const groups = computed(() => {
  const map = new Map<string, GlossaryItem[]>()
  for (const item of glossary.value ?? []) {
    const term = item.translations?.[0]?.term?.trim() || item.slug
    const raw = term[0]!.normalize('NFD')[0]!.toLocaleUpperCase(locale.value)
    const letter = /\p{L}/u.test(raw) ? raw : '#'
    map.get(letter)?.push(item) ?? map.set(letter, [item])
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a === '#') !== (b === '#')
      ? (a === '#' ? 1 : -1)
      : a.localeCompare(b, locale.value))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) =>
        (a.translations?.[0]?.term ?? '').localeCompare(b.translations?.[0]?.term ?? '', locale.value)),
    }))
})

const carousel = useTemplateRef<InstanceType<typeof BlossomCarousel>>('carousel')
const scrolledLetter = ref('')
const hoverLetter = ref('')
const displayLetter = computed(() => hoverLetter.value || scrolledLetter.value || groups.value[0]?.letter || '')

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
  const available = m?.available ?? Number.POSITIVE_INFINITY
  const gap = m?.gap ?? 8
  return groups.value.map(({ letter, items }) => {
    const columns: GlossaryItem[][] = []
    let column: GlossaryItem[] = []
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

watch(groups, () => nextTick(() => {
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

function recetlyUpdated(item: GlossaryItem) {
  const updated = new Date(item.date_updated).getTime()
  const today = Date.now()
  const diffTime = Math.abs(today - updated)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 10
}
</script>

<style lang="postcss">
.glossary-page {
  --cols: 5;
  --gap: 32px;
  /* an exact number of columns always fits between the page margins */
  --subcol-width: calc((100vw - 2 * var(--app-margin-small) - (var(--cols) - 1) * var(--gap)) / var(--cols));

  position: absolute;
  inset: 0;
  block-size: var(--unit-100vh);
  display: grid;
  grid-template-rows: 1fr 1fr;
  pointer-events: none;

  .letter-display {
    z-index: -1;
    display: grid;
    place-items: center;
    overflow: hidden;
    span {
      font-size: min(35dvh, 28vw);
      line-height: 1;
      font-weight: var(--bold);
      translate: 0 24px;
    }
  }

  .letter-fade-enter-active,
  .letter-fade-leave-active {
    transition: opacity 0.12s ease;
  }

  .letter-fade-enter-from,
  .letter-fade-leave-to {
    opacity: 0;
  }

  /* not scoped to [blossom-carousel]: Blossom's teardown removes that attribute while the page is still visible in the leave transition, and the layout must survive it */
  .letter-rail {
    pointer-events: auto;
    /* let the 1fr row bound it */
    min-block-size: 0;
    min-inline-size: 0;
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
  }

  .letter-group {
    position: relative;
    scroll-snap-align: start;
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
    font-size: var(--text-small);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .stretched-link::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    content: '';
  }
}

@media (min-width: 1800px) {
  .glossary-page {
    --cols: 7;
  }
}

@media (max-width: 1280px) {
  .glossary-page {
    --cols: 4;
  }
}

@media (max-width: 900px) {
  .glossary-page {
    --cols: 3;
  }
}

@media (max-width: 600px) {
  .glossary-page {
    --cols: 2;
  }
}
</style>
