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
      @view-resource="openResource"
    />
    <ResourceGrid
      v-else
      :resources="sortedResources"
      @view-resource="openResource"
    />

    <!-- Preview -->
    <AppPreview
      :visible
      :cover="currentCover"
      :x-pos="xPos"
      :y-pos="yPos"
    />

    <!-- Resource overlay route (/resources/:slug) -->
    <NuxtPage />
  </article>
</template>

<script lang="ts" setup>
import { readItems } from '@directus/sdk'

useSeoMeta({
  title: 'Resources',
  description: 'A curated collection of resources on creative coding, web design and development.',
})

const { $directus } = useNuxtApp()

const viewMode = ref<'table' | 'grid'>('table')

const { data: resourcesData } = await useAsyncData('page-resources', () => {
  return $directus.request<Resource[]>(
    readItems('resources', {
      filter: NOT_DRAFT,
      fields: RESOURCE_FIELDS,
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
const { currentCover, setCover, visible, xPos, yPos } = useCoverPreview(table)
const activeTab = ref<'topics' | 'tags' | 'type' | 'search'>('topics')

const localePath = useLocalePath()

function openResource(resource: Resource) {
  if (!resource.slug)
    return
  navigateTo(localePath(`/resources/${resource.slug}`))
}

function onSelectFilter({ kind, value }: ResourceFilterPayload) {
  filters.value = {
    topics: [],
    tags: [],
    type: [],
    [kind]: [value],
  }
  activeTab.value = kind
}

// The overlay route renders inside this page's tree, so it can apply filters here.
provide(resourceFilterKey, onSelectFilter)
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
  margin: 10vh 0 0 0;
}
</style>
