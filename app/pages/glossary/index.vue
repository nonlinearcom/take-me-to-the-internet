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

    <GlossaryRail
      v-model:letter="railLetter"
      :groups
    />
  </div>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

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

// the rail reports the letter being hovered or scrolled to; until it has
// one (server render, first paint) the first letter stands in
const railLetter = ref('')
const displayLetter = computed(() => railLetter.value || groups.value[0]?.letter || '')
</script>

<style lang="postcss">
.glossary-page {
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

  .glossary-rail {
    pointer-events: auto;
    /* let the 1fr row bound it */
    min-block-size: 0;
    min-inline-size: 0;
  }
}
</style>
