<template>
  <article class="resources-page">
    <transition name="fade">
      <AppPreview
        v-if="!isOutside && isLargeScreen && currentCover !== null"
        :cover="currentCover"
        :x-pos="xPos"
        :y-pos="yPos"
      />
    </transition>

    <ResourcesFilters
      :resources="resourcesData"
      :filters="filters"
      :search="search"
      :has-active-filters="hasActiveFilters"
      :is-disabled="isDisabled"
      @update:filters="filters = $event"
      @update:search="search = $event"
      @reset="resetFilters"
    />

    <ResourcesTable
      ref="table"
      :resources="sortedResources"
      :is-sorted-by="isSortedBy"
      @toggle-sort="toggleSort"
      @row-hover="getCoverUrl"
    />
  </article>
</template>

<script lang="ts" setup>
const { isLargeScreen } = useApp()
const { $directus, $readItems } = useNuxtApp()

const { data: resourcesData } = await useAsyncData('page-resources', () => {
  return $directus.request<Resource[]>(
    $readItems('resources', {
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
const currentCover = ref<string | undefined>()

function getCoverUrl(url?: string) {
  currentCover.value = url
}

const { isOutside, xPos, yPos } = useFollowMe(table)
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
  margin: 10vh 0 0 0;
}
</style>
