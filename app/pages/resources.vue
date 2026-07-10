<template>
  <article class="resources-page">
    <ResourceFilters
      :resources="resourcesData"
      :filters="filters"
      :search="search"
      :has-active-filters="hasActiveFilters"
      :is-disabled="isDisabled"
      :active-tab="activeTab"
      @update:filters="filters = $event"
      @update:search="search = $event"
      @reset="resetFilters"
      @update:active-tab="activeTab = $event"
    >
      <UiButton
        :icon="viewMode === 'table' ? 'view-grid' : 'list'"
        :label="viewMode === 'table' ? 'Grid view' : 'List view'"
        variant="ghost"
        invert-icon
        @click="viewMode = viewMode === 'table' ? 'grid' : 'table'"
      />
    </ResourceFilters>

    <ResourceTable
      v-if="viewMode === 'table'"
      ref="table"
      :resources="sortedResources"
      :is-sorted-by="isSortedBy"
      @toggle-sort="toggleSort"
      @row-hover="setCover"
      @view-resource="openResourceDialog"
    />
    <ResourceGrid
      v-else
      :resources="sortedResources"
      @view-resource="openResourceDialog"
    />

    <!-- Preview -->
    <transition name="fade">
      <AppPreview
        v-if="!isOutside && isLargeScreen && currentCover !== null"
        :cover="currentCover"
        :x-pos="xPos"
        :y-pos="yPos"
      />
    </transition>

    <!-- Resource Dialog -->
    <UiDialog
      v-if="selectedResource"
      v-model:open="isDialogOpen"
      side="right"
      title="Resource Details"
      hide-title
      :aria-label="`Resource ${selectedResource?.title}`"
      inset
      inset-auto-height
    >
      <ResourceCard
        :resource="selectedResource"
        @select-filter="onSelectFilter"
      />
    </UiDialog>
  </article>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

useSeoMeta({
  title: 'Resources',
  description: 'A curated collection of resources on creative coding, web design and development.',
})

const { isLargeScreen } = useApp()
const { $directus } = useNuxtApp()

const viewMode = ref<'table' | 'grid'>('table')

const { data: resourcesData } = await useAsyncData('page-resources', () => {
  return $directus.request<Resource[]>(
    readItems('resources', {
      filter: {
        status: {
          _neq: 'draft',
        },
      },
      fields: [
        '*',
        'people.people_id.*',
        'people.people_id.*.resources_id.title',
        'people.people_id.*.resources_id.link',
        'tags.tags_id.title',
        'tags.tags_id.slug',
        'topics.topics_id.title',
        'topics.topics_id.slug',
      ],
    }),
  )
})

const {
  filters,
  search,
  hasActiveFilters,
  resetFilters,
  toggleSort,
  isDisabled,
  sortedResources,
  isSortedBy,
} = useResources(resourcesData)

const table = useTemplateRef<HTMLElement>('table')
const { currentCover, setCover, isOutside, xPos, yPos } = useCoverPreview(table)
const isDialogOpen = ref(false)
const selectedResource = ref<Resource | null>(null)
const activeTab = ref<'topics' | 'tags' | 'type' | 'search'>('topics')

function openResourceDialog(resource: Resource) {
  selectedResource.value = resource
  isDialogOpen.value = true
}

function onSelectFilter(payload: { kind: 'topics' | 'tags' | 'type', value: string }) {
  const { kind, value } = payload
  if (kind === 'topics') {
    filters.value = { topics: [value], tags: [], type: [] }
    activeTab.value = 'topics'
  } else if (kind === 'tags') {
    filters.value = { topics: [], tags: [value], type: [] }
    activeTab.value = 'tags'
  } else if (kind === 'type') {
    filters.value = { topics: [], tags: [], type: [value] }
    activeTab.value = 'type'
  }

  // Auto-close the dialog after applying the filter
  isDialogOpen.value = false
  selectedResource.value = null
}
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
  margin: 10vh 0 0 0;
}
</style>
