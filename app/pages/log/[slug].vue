<template>
  <transition
    name="modal"
    appear
  >
    <div
      v-if="page"
      class="panel__overlay"
      @click.self="closeModal()"
    >
      <transition
        name="panel"
        appear
      >
        <article class="panel">
          <header>
            <h2
              v-if="page.title"
              class="header-title full"
            >
              {{ page.title }}
              <template v-if="page.subtitle">
                <br>{{ page.subtitle }}
              </template>
            </h2>
            <ClientOnly>
              <UiButton
                class="close"
                icon="arrow-left"
                variant="outline"
                rounded
                invert-icon
                :label="!isSmallScreen ? 'BACK' : undefined"
                size="sm"
                @click="closeModal()"
              />
            </ClientOnly>
          </header>
          <main>
            <aside
              v-if="page.role"
              class="meta"
            >
              <h3>{{ page.department }}</h3>
              <h3>{{ page.institution }}</h3>
              <h3>{{ page.type }}</h3>
              <h3>{{ page.location }}, {{ page.year }}</h3>

              <template v-if="page.assistant">
                <h3><br>Teaching assistant <br>{{ page.assistant.join(', ') }}</h3>
              </template>
            </aside>
            <EditorContent
              v-if="page.content"
              class="description"
              :content="page.content"
              :relation-blocks
            />

            <section
              v-if="page?.participants && page.participants !== ''"
              class="participants"
            >
              <h5> Participants </h5>
              <ul>
                <template
                  v-for="participant in page.participants.split('\n')"
                  :key="participant"
                >
                  <li v-if="participant !== ''">
                    {{ participant }}
                  </li>
                </template>
              </ul>
            </section>
          </main>
        </article>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { readItems } from '@directus/sdk'
import { EditorGallery, EditorMedia } from '#components'

const relationBlocks = [
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },
]

const route = useRoute()
const isPanelOpen = ref(false)

const { $directus } = useNuxtApp()

const { data: page, error } = await useAsyncData(
  'log-page',
  () => {
    // Filtered readItems instead of readItem by key: archived entries are
    // listed on /log but must not be reachable directly.
    return $directus.request(
      readItems('log', {
        filter: {
          slug: { _eq: String(route.params.slug) },
          status: { _eq: 'published' },
        },
        limit: 1,
        fields: [
          '*',
          {
            editor_nodes: [
              '*',
              {
                item: {
                  gallery: [
                    { content: ['*', { directus_files_id: ['id', 'description'] }] },
                  ],
                  media: ['layout', { file: ['*'] }],
                },
              },
            ],
          },
        ],
      }),
    )
  },
  {
    transform: ([data]) => {
      if (!data)
        return null

      injectDataIntoContent(data.editor_nodes, data.content)
      return data
    },
  },
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Log Not Found:${error.value}`,
  })
}

useSeoMeta({
  title: () => [page.value?.title, page.value?.subtitle].filter(Boolean).join(' – '),
  description: () => {
    const entry = page.value
    const fallback = entry?.role
      ? `${entry.role} at ${entry.institution}, ${entry.location} ${entry.year}`
      : undefined
    return contentToDescription(entry?.content) ?? fallback
  },
})

function closeModal() {
  // router.back()
  navigateTo('/log')
}

const { isSmallScreen } = useApp()

onBeforeMount(() => {
  isPanelOpen.value = true
})
onUnmounted(() => {
  isPanelOpen.value = false
})
</script>

<style lang="postcss">
.panel__overlay {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--bg-rgb), 0.4);
  overflow: hidden;
  cursor: pointer;
}

.panel {
  position: fixed;
  top: 0;
  right: 0;

  transform: translateX(100%);
  background-color: var(--bg-color);
  width: 50%;
  height: 100vh;
  transition: transform 0.5s ease-out;
  transform: translateX(0%);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 20;
  cursor: default;

  /* https://alligator.io/css/transition-box-shadows/ */
  box-shadow: 0 0px 40px rgba(0, 0, 0, 0.3);

  pointer-events: all;

  @media (max-width: 1440px) {
    width: 66.67%;
  }
  @media (max-width: 1024px) {
    width: 100%;
    box-shadow: none;
  }

  .close {
    position: absolute;
    top: 28px;
    right: var(--app-margin-small);
  }

  header,
  main {
    padding: var(--app-margin-small);
  }

  header .header-title {
    font-size: var(--text-large);
    line-height: 1.2;
  }

  main {
    position: relative;

    aside {
      font-size: var(--text-small);
      margin-bottom: var(--app-margin);
    }

    p {
      grid-column: 1 / span 1;
    }

    img,
    .video,
    ul,
    figure {
      grid-column: 1 / span 2;
    }

    @media (min-width: 768px) {
      aside {
        position: absolute;
        right: 0;
        width: 33.33%;
      }

      .description {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: calc(var(--app-margin) / 2);
      }
    }
  }
}

.participants {
  h5 {
    margin: var(--app-margin) 0 var(--app-margin-mini);
  }

  ul {
    font-size: var(--text-small);
    column-width: 300px;
  }
}
</style>
