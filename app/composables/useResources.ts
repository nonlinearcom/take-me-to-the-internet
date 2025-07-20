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
    let res = resourcesData.value ?? undefined
    if (filters.value.topics?.length)
      res = res?.filter(({ topics }) => filters.value.topics.some(r => topics?.map(({ topics_id }) => topics_id.title)?.includes(r)))
    if (filters.value.tags?.length)
      res = res?.filter(({ tags }) => filters.value.tags.some(r => tags?.map(({ tags_id }) => tags_id.title)?.includes(r)))
    if (filters.value.type?.length)
      res = res?.filter(({ type }) => type && filters.value.type.includes(type))
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

  const isDisabled = ({ tag, topic, type }: { tag?: string, topic?: string, type?: string }) => {
    if (tag)
      return !filteredResources.value?.some(({ tags }) => tags?.map(({ tags_id }) => tags_id.title).includes(tag))
    if (topic)
      return !filteredResources.value?.some(({ topics }) => topics?.map(({ topics_id }) => topics_id.title).includes(topic))
    if (type)
      return !filteredResources.value?.some(r => r.type === type)
  }

  const sortedResources = computed(() => {
    if (!filteredResources.value || !sortKey.value || !sortDirection.value)
      return filteredResources.value || []

    return [...filteredResources.value].sort((a, b) => {
      const key = sortKey.value as ResourceSortKey
      let valueA = key === 'author' ? a.people.map(({ people_id }) => people_id.name.trim()).join(', ') : a[key as keyof Resource]
      let valueB = key === 'author' ? b.people.map(({ people_id }) => people_id.name.trim()).join(', ') : b[key as keyof Resource]

      // Push empty values to the end of the list
      if (valueA === null || valueA === undefined || valueA === '')
        return (valueB === null || valueB === undefined || valueB === '') ? 0 : 1

      if (valueB === null || valueB === undefined || valueB === '')
        return -1

      // Case-insensitive sorting for strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.trim().toLowerCase()
        valueB = valueB.trim().toLowerCase()
      }

      if (sortDirection.value === 'asc')
        return valueA > valueB ? 1 : -1
      else
        return valueA < valueB ? 1 : -1
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
