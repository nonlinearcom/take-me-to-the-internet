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

    <section class="resources-filters">
      <h5>Filter by:</h5>
      <h5>Topics</h5>
      <UiToggleGroup
        v-model="filters.topics"
        size="sm"
      >
        <UiToggleGroupItem
          v-for="value in arrayUnion(resourcesData?.flatMap(({ topics }) => topics ?? []).map(({ topics_id }) => topics_id.title))"
          :key="value"
          :value
          :disabled="!!isDisabled({ topic: value })"
        >
          {{ value }}
        </UiToggleGroupItem>
      </UiToggleGroup>

      <h5>Tags</h5>
      <UiToggleGroup
        v-model="filters.tags"
        size="sm"
      >
        <UiToggleGroupItem
          v-for="value in arrayUnion(resourcesData?.flatMap(({ tags }) => tags ?? []).map(({ tags_id }) => tags_id.title))"
          :key="value"
          :value
          :disabled="!!isDisabled({ tag: value })"
        >
          {{ value }}
        </UiToggleGroupItem>
      </UiToggleGroup>

      <UiInput
        v-model="search"
        placeholder="Search…"
      />
    </section>

    <table
      ref="table"
      class="resources-table"
    >
      <thead v-if="headers">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="sortable"
            :class="[header.key, { 'sorted-asc': isSortedBy(header.key, 'asc'), 'sorted-desc': isSortedBy(header.key, 'desc'), 'table-year': header.key === 'year' }]"
            @click="toggleSort(header.key)"
          >
            {{ header.label }}
            <span class="sort-indicator">
              <!-- Visual indicators for sorting -->
              <span v-if="isSortedBy(header.key, 'asc')">↑</span>
              <span v-else-if="isSortedBy(header.key, 'desc')">↓</span>

            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in sortedResources"
          :key="index"
          @mouseover="getCoverUrl(item?.cover)"
        >
          <td class="slug">
            <span class="resource">
              <UiButton
                icon="external-link"
                variant="ghost"
                padded
                size="sm"
                :to="item.link"
                target="_blank"
              />
              <UiDialog
                side="right"
                title="Resource Details"
                hide-title
                :aria-label="`Resource ${item.title}`"
              >
                <template #trigger>
                  <UiButton
                    variant="ghost"
                    size="sm"
                    padded
                    :label="item.title"
                  />
                </template>
                <ResourceCard :resource="item" />
              </UiDialog>
            </span>
          </td>
          <td class="type">
            {{ item.type }}
          </td>
          <td class="table-year">
            {{ item.year }}
          </td>
          <td class="author">
            <UiDialog
              v-for="author in item.people"
              :key="author.people_id.name"
              title="Author Details"
              hide-title
            >
              <template #trigger>
                <UiButton
                  class="author"
                  variant="ghost"
                  :label="author.people_id.name"
                />
              </template>
              <PeopleCard :author="author.people_id" />
            </UiDialog>
          </td>
          <td class="open">
            <span
              v-if="item.open"
              class="dot"
            />
          </td>
        </tr>
      </tbody>
    </table>
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

const filters = ref<{ topics: string[], tags: string[] }>({
  topics: [],
  tags: [],
})
const search = ref<string | undefined>()
const searchDebounced = refDebounced(search, 1000)

const headers: { key: ResourceSortKey, label: string }[] = [
  { key: 'slug', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'year', label: 'Year' },
  { key: 'author', label: 'Author' },
  { key: 'open', label: 'Open' },
]

type ResourceSortKey = keyof Resource | 'author'

// Sorting state
const sortKey = ref<ResourceSortKey | null>(null)
const sortDirection = ref<'asc' | 'desc' | null>(null)

// Toggle sorting when a header is clicked
const toggleSort = (key: ResourceSortKey) => {
  if (sortKey.value === key) {
    // Toggle between 'asc' and 'desc'
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new sort key and default to ascending
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const filteredResources = computed(() => {
  let res = resourcesData.value ?? undefined
  if (filters.value.topics?.length)
    res = res?.filter(({ topics }) => filters.value.topics.some(r => topics?.map(({ topics_id }) => topics_id.title)?.includes(r)))
  if (filters.value.tags?.length)
    res = res?.filter(({ tags }) => filters.value.tags.some(r => tags?.map(({ tags_id }) => tags_id.title)?.includes(r)))
  if (searchDebounced.value) {
    res = res?.filter((item) => {
      const title = item.title.toLowerCase()
      const description = item.description?.toLowerCase()
      const people = item.people.map(({ people_id }) => people_id.name.trim()).join(', ').toLowerCase()
      return `${title} ${description} ${people}`.includes(searchDebounced.value?.toLowerCase() ?? '')
    })
  }

  return res
})

const isDisabled = ({ tag, topic }: { tag?: string, topic?: string }) => {
  if (tag)
    return !filteredResources.value?.some(({ tags }) => tags?.map(({ tags_id }) => tags_id.title).includes(tag))
  if (topic)
    return !filteredResources.value?.some(({ topics }) => topics?.map(({ topics_id }) => topics_id.title).includes(topic))
}

// Computed property to get sorted resources
const sortedResources = computed(() => {
  if (!filteredResources.value || !sortKey.value || !sortDirection.value) {
    return filteredResources.value || []
  }
  console.log(filteredResources.value)
  // Sort based on the active sort key and direction
  return [...filteredResources.value].sort((a, b) => {
    const key = sortKey.value as ResourceSortKey

    // Handle nested keys for 'author' sorting
    const valueA = key === 'author' ? a.people[0]?.people_id.name : a[key as keyof Resource]
    const valueB = key === 'author' ? b.people[0]?.people_id.name : b[key as keyof Resource]

    if (!valueA || !valueB)
      return 0

    console.log(valueA, valueB)

    if (sortDirection.value === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })
})

// Helper function to check sorting state
const isSortedBy = (key: string, direction: 'asc' | 'desc') => {
  return sortKey.value === key && sortDirection.value === direction
}

const table = ref(null)
const currentCover = ref()

function getCoverUrl(url?: string) {
  currentCover.value = url
}

const { isOutside, xPos, yPos } = useFollowMe(table)
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
  margin: 0 0 25vh;
}

.resources-filters {
  display: grid;
  gap: var(--app-margin-mini);
  /* margin-bottom: var(--app-margin); */
  padding: var(--app-margin-small);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 3fr;

    .ui-input {
      max-width: 480px;
      grid-column: 2 / span 1;
      margin: var(--app-margin-small) 0 var(--app-margin-mini);
    }
  }

  h5 {
    font-weight: 500;
    font-size: var(--text-small);
    grid-column: 1 / span 1;
  }

  .ToggleGroup {
    flex-wrap: wrap;
    gap: 4px;
  }
  .ToggleGroupItem {
    padding: 8px 12px;
  }
}

table tr td {
  border: none;
}

.resources-table {
  button {
    font-size: inherit !important;
  }

  tbody tr {
    border-top: 1px solid var(--border-color);
  }

  thead tr {
    border: none;
  }

  td {
    font-size: var(--text-small);
    vertical-align: middle;

    /*isOpen */
    /* &:last-child {
      border-bottom: 1px solid var(--border-color);
      text-align: center;
    } */
  }
  .resource {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .author {
    z-index: 20;
  }

  /* sorting */
  thead {
    height: 54px;
    th {
      padding: 0 16px;
      color: var(--text-hover);
      font-weight: var(--regular);
      text-align: left;
      font-size: var(--text-small);
    }
    th.sortable {
      cursor: pointer;
      user-select: none;
    }
    th.sorted-asc,
    th.sorted-desc {
    }
  }

  .ui-button {
    line-height: 1.2;
    flex-shrink: 1;
  }

  tr {
    width: 100%;
    display: flex;

    align-items: center;
    position: relative;
  }

  td,
  th {
    border-top: 1px solid rgba(var(--current-gray-rgb-inverted), 0.25);
    &.table-year {
      flex: 0 1 10%;
      max-width: 100px;
    }

    &.type {
      flex: 0 1 10%;
      max-width: 150px;
    }

    &.open {
      flex: 0 1 5%;
      max-width: 70px;
    }

    &.slug {
      flex: 0 1 40%;
    }

    &.author {
      flex: 1 0 30%;
    }
  }

  @media (max-width: 768px) {
    td,
    th {
      &.slug {
        flex: 1 0 80%;
      }
      &.type {
        display: none;
      }
      &.table-year {
        display: none;
      }
      &.author {
        display: none;
      }
      &.open {
        flex: 0 1 10%;
      }
    }
  }

  @media (max-width: 480px) {
    .open {
      display: none;
    }
  }
}
</style>
