<template>
  <div class="resource-page">
    <UiDrawer
      class="resource-drawer"
      :open="isOpen"
      swipe-direction="right"
      hide-handle
      inset
      :title="resource?.title ?? 'Resource'"
      @update:open="isOpen = $event"
      @close-complete="navigateTo('/resources')"
    >
      <ResourceCard
        v-if="resource"
        :resource="resource"
        @select-filter="onSelectFilter"
      />
    </UiDrawer>
  </div>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

const route = useRoute()
const { $directus } = useNuxtApp()
const img = useImage()

const slug = String(route.params.slug)

const { data: resource, error } = await useAsyncData(
  `resource-${slug}`,
  () => {
    return $directus.request<Resource[]>(
      readItems('resources', {
        filter: {
          slug: { _eq: slug },
          status: { _neq: 'draft' },
        },
        limit: 1,
        fields: [
          '*',
          'people.people_id.*',
          'people.people_id.*.resources_id.title',
          'people.people_id.*.resources_id.link',
          'tags.tags_id.id',
          'tags.tags_id.title',
          'tags.tags_id.slug',
          'topics.topics_id.id',
          'topics.topics_id.title',
          'topics.topics_id.slug',
        ],
      }),
    )
  },
  {
    transform: data => data[0] ?? null,
  },
)

if (!resource.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Resource Not Found:${error.value ?? ''}`,
  })
}

// Resolved eagerly: the runtime-config image provider needs the Nuxt
// instance, which lazy head getters don't have.
const ogImage = resource.value?.cover
  ? img(resource.value.cover, { width: 1200, height: 630, fit: 'cover', format: 'webp' })
  : undefined

useSeoMeta({
  title: () => [resource.value?.title, resource.value?.subtitle].filter(Boolean).join(' – '),
  description: () => htmlToDescription(resource.value?.description),
  ...(ogImage ? { ogImage } : {}),
})

// The drawer is state-driven but the overlay is a route: closing only flips
// `isOpen`; navigation back to /resources happens on `closeComplete`, after
// the exit animation has played.
const isOpen = ref(true)

const applyResourceFilter = inject(resourceFilterKey, null)

function onSelectFilter(payload: ResourceFilterPayload) {
  applyResourceFilter?.(payload)
  isOpen.value = false
}
</script>

<style lang="postcss">
/* Same sizing as the old right-side UiDialog: 50vw, near-full width on small screens. */
.Drawer.right.resource-drawer {
  width: 50vw;
  min-width: 300px;
  max-width: none;

  @media (max-width: 1024px) {
    width: calc(100vw - 64px);
  }
}
</style>
