// Lets the /resources/:slug overlay apply a filter on the parent list page.
export const resourceFilterKey: InjectionKey<(payload: ResourceFilterPayload) => void> = Symbol('resource-filter')

export function useResources(resourcesData: Ref<Resource[] | null | undefined>) {
  const filters = ref<{ topics: string[], tags: string[], type: string[] }>({
    topics: [],
    tags: [],
    type: [],
  })
  const search = ref<string | undefined>()
  const searchDebounced = refDebounced(search, 1000)

  const hasActiveFilters = computed(() => {
    return (
      filters.value.topics.length > 0
      || filters.value.tags.length > 0
      || filters.value.type.length > 0
      || !!searchDebounced.value
    )
  })

  const resetFilters = () => {
    filters.value = {
      topics: [],
      tags: [],
      type: [],
    }
    search.value = undefined
  }

  const sortKey = ref<ResourceSortKey | null>(null)
  const sortDirection = ref<'asc' | 'desc' | null>(null)

  const toggleSort = (key: ResourceSortKey) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDirection.value = 'asc'
    }
  }

  const filteredResources = computed(() => {
    const { topics, tags, type } = filters.value
    const q = searchDebounced.value?.toLowerCase()
    return (resourcesData.value ?? []).filter(resource =>
      (!topics.length || topics.some(t => topicTitles(resource).includes(t)))
      && (!tags.length || tags.some(t => tagTitles(resource).includes(t)))
      && (!type.length || (!!resource.type && type.includes(resource.type)))
      && (!q || [resource.title, resource.description, authorNames(resource)].join(' ').toLowerCase().includes(q)),
    )
  })

  const isDisabled = ({ tag, topic, type }: { tag?: string, topic?: string, type?: string }) => {
    if (tag)
      return !filteredResources.value.some(r => tagTitles(r).includes(tag))
    if (topic)
      return !filteredResources.value.some(r => topicTitles(r).includes(topic))
    if (type)
      return !filteredResources.value.some(r => r.type === type)
  }

  const isEmpty = (value: unknown) => value == null || value === ''
  const sortValue = (resource: Resource, key: ResourceSortKey) =>
    key === 'author' ? authorNames(resource) : resource[key as keyof Resource]

  const sortedResources = computed(() => {
    const key = sortKey.value
    const direction = sortDirection.value
    if (!key || !direction)
      return filteredResources.value

    return [...filteredResources.value].sort((a, b) => {
      let valueA = sortValue(a, key)
      let valueB = sortValue(b, key)

      // Push empty values to the end of the list
      if (isEmpty(valueA))
        return isEmpty(valueB) ? 0 : 1
      if (isEmpty(valueB))
        return -1

      // Case-insensitive sorting for strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.trim().toLowerCase()
        valueB = valueB.trim().toLowerCase()
      }

      return direction === 'asc'
        ? (valueA > valueB ? 1 : -1)
        : (valueA < valueB ? 1 : -1)
    })
  })

  const isSortedBy = (key: string, direction: 'asc' | 'desc') => {
    return sortKey.value === key && sortDirection.value === direction
  }

  return {
    filters,
    search,
    hasActiveFilters,
    resetFilters,
    sortKey,
    sortDirection,
    toggleSort,
    filteredResources,
    isDisabled,
    sortedResources,
    isSortedBy,
  }
}
