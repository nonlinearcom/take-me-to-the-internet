<template>
  <transition
    name="modal"
    appear
  >
    <div
      class="panel__overlay"
      @click="closeModal()"
    >
      <transition
        name="panel"
        appear
      >
        <article class="panel">
          <UiButton
            class="close"
            icon="arrow-left"
            variant="outline"
            rounded
            invert-icon
            label="BACK"
            size="sm"
            @click="closeModal()"
          />
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
            <div class="description">
              <!-- <ContentRenderer :value="page" /> -->
              lorem ipsum
            </div>
            <aside
              v-if="page.role"
              class="meta"
            >
              <h3>{{ page.department }}</h3>
              <h3>{{ page.institution }}</h3>
              <h3>{{ page.type }}</h3>
              <h3>{{ page.location }}, {{ page.year }}</h3>

              <template v-if="page.assistant">
                <h3><br>Teaching assistant <br>{{ page.assistant }}</h3>
              </template>
            </aside>
          </header>
          <!--
          <PanelGallery
            v-if="page.gallery"
            :gallery="page.gallery"
          /> -->

          <!-- <section
            v-if="page.partecipants"
            class="partecipants"
          >
            <h3>Partecipants</h3>
            <ul>
              <li
                v-for="partecipant in page.partecipants"
                :key="partecipant"
              >
                {{ partecipant }}
              </li>
            </ul>
          </section> -->
        </article>
      </transition>
    </div>
  </transition>
</template>

<script setup>
const route = useRoute()
const isPanelOpen = ref(false)

const { $directus, $readItem } = useNuxtApp()

const { data: page, error } = await useAsyncData(
  'log-page',
  () => {
    console.log('route.params.slug: ', route.params.slug)
    return $directus.request(
      $readItem('log', route.params.slug, {
        fields: ['*', { '*': ['*'] }],
      }),
    )
  },
)
console.log('page', page.value)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Log Not Found:${error.value}`,
  })
}

function closeModal() {
  // router.back()
  navigateTo('/log')
}

onBeforeMount(() => {
  isPanelOpen.value = true
})
onUnmounted(() => {
  isPanelOpen.value = false
})

const pageTitle = computed(() => {
  if (!page.value?.subtitle) {
    return page.value?.title
  } else {
    return `${page.value?.title} ${page.value?.subtitle}`
  }
})

// useHead({
//   bodyAttrs: {
//     class: isPanelOpen.value ? 'panel-opened' : '',
//   },
//   title: pageTitle,
//   meta: [
//     { name: 'description', content: page.value?.description },
//     { property: 'og:description', content: page.value?.description },
//     // { property: 'og:image', content: `https://res.cloudinary.com/non-linear/image/upload/f_webp,q_auto,w_1536/${page.value?.cover}` },
//     { name: 'twitter:card', content: `summary_large_image` },
//   ],
// })
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

  .close {
    position: absolute;
    top: 28px;
    right: var(--app-margin-small);
  }
}

.panel header {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: calc(var(--app-margin) / 2);

  margin: var(--app-margin-small);

  .full {
    grid-column: 1 / span 2;
    padding-right: 100px;
    margin-bottom: 100px;
  }

  .header-title {
    font-size: var(--title);
    line-height: var(--title-height);
  }

  .description {
    grid-column: 1 / span 1;
  }

  p {
    grid-column: 1 / span 2;
    /* max-width: 600px; */
  }

  aside {
    margin-bottom: var(--app-margin);

    h3 {
      margin-bottom: 0;
    }
  }
}

.panel img {
  display: block;
}

.panel .partecipants {
  margin: var(--app-margin) calc(var(--app-margin) / 2);

  ul {
    padding: 0;
    font-size: var(--text-small);
    font-weight: 400;
    column-width: 300px;

    li {
      margin: 0;
      list-style-type: none;
    }
  }
}

@media (max-width: 1440px) {
  .panel {
    width: 66.66%;
  }
}

@media (max-width: 1024px) {
  .panel {
    width: 100%;
    box-shadow: none;

    header {
      display: flex;
      flex-direction: column;

      .meta {
        order: 1;
      }

      .description {
        order: 2;
      }
    }
  }
}

@media (max-width: 540px) {
  .panel {
    header {
      margin: var(--app-margin-mini);
    }

    .partecipants {
      column-width: 200px;
    }
  }
}
</style>
