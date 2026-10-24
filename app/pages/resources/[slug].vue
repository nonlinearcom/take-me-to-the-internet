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
      @close-complete="navigateTo(localePath('/resources'))"
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
const localePath = useLocalePath()

const slug = String(route.params.slug)

const { data: list } = useNuxtData<Resource[]>('page-resources')

const { data: resource } = await useAsyncData(`resource-${slug}`, () => $directus.request<Resource[]>(
  readItems('resources', {
    filter: { slug: { _eq: slug }, ...NOT_DRAFT },
    limit: 1,
    fields: RESOURCE_FIELDS,
  }),
), {
  transform: rows => rows[0] ?? null,
  // Opened from the list, the record is already in the parent page's
  // payload (same RESOURCE_FIELDS shape): only a direct link has to fetch
  getCachedData: () => list.value?.find(r => r.slug === slug),
})

if (!resource.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Resource Not Found',
  })
}

// Resolved eagerly: the runtime-config image provider needs the Nuxt
// instance, which lazy head getters don't have.
const ogImage = resource.value?.cover
  ? img(resource.value.cover, { width: 1200, height: 630, fit: 'cover', format: 'webp' })
  : undefined

useSeoMeta({
  title: () => joinTitle(resource.value?.title, resource.value?.subtitle),
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
