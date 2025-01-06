<template>
  <article class="resources-page">
    <table class="resources-table">
      <thead v-if="headers">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="sortable"
            :class="{ 'sorted-asc': isSortedBy(header.key, 'asc'), 'sorted-desc': isSortedBy(header.key, 'desc') }"
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
        >
          <td>
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
          <td>{{ item.type }}</td>
          <td>{{ item.year }}</td>
          <td>
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
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()

const { data: resourcesData } = await useAsyncData('resources', () => {
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

const headers = [
  { key: 'slug', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'year', label: 'Year' },
  { key: 'author', label: 'Author' },
]

// Sorting state
const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc' | null>(null)

// Toggle sorting when a header is clicked
const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    // Toggle between 'asc' and 'desc'
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new sort key and default to ascending
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// Computed property to get sorted resources
const sortedResources = computed(() => {
  if (!resourcesData.value || !sortKey.value || !sortDirection.value) {
    return resourcesData.value || []
  }
  console.log(resourcesData.value)
  // Sort based on the active sort key and direction
  return [...resourcesData.value].sort((a, b) => {
    const key = sortKey.value as keyof Resource

    // Handle nested keys for 'author' sorting
    const valueA = key === 'author' ? a.people[0]?.people_id.name : a[key]
    const valueB = key === 'author' ? b.people[0]?.people_id.name : b[key]

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
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
}

.resources-table {
  button {
    font-size: inherit !important;
  }
  td {
    font-size: var(--text-small);
    vertical-align: middle;
    border-top: 1px solid var(--border-color);

    &:last-child {
      border-bottom: 1px solid var(--border-color);
    }
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
}
</style>
