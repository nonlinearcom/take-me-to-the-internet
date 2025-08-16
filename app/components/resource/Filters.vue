<template>
  <section class="resources-filters">
    <div class="view-mode">
      <slot />
    </div>

    <!-- tabs -->
    <UiTabs
      class="filters-tabs"
      default-value="topics"
      :model-value="activeTab"
      :tabs="[
        { value: 'topics', label: 'Topics' },
        { value: 'tags', label: 'Tags' },
        { value: 'type', label: 'Type' },
        { value: 'search', label: 'Search' },
      ]"
      @update:model-value="onTabsUpdate"
    >
      <!-- Topics -->
      <template #topics>
        <UiToggleGroup
          :model-value="filters.topics"
          size="sm"
          @update:model-value="emit('update:filters', { ...filters, topics: $event })"
        >
          <UiToggleGroupItem
            v-for="value in topics"
            :key="value"
            :value="value"
            :disabled="!!isDisabled({ topic: value })"
          >
            {{ value }}
          </UiToggleGroupItem>
        </UiToggleGroup>
      </template>

      <!-- Tags -->
      <template #tags>
        <UiToggleGroup
          :model-value="filters.tags"
          size="sm"
          @update:model-value="emit('update:filters', { ...filters, tags: $event })"
        >
          <UiToggleGroupItem
            v-for="value in tags"
            :key="value"
            :value="value"
            :disabled="!!isDisabled({ tag: value })"
          >
            {{ value }}
          </UiToggleGroupItem>
        </UiToggleGroup>
      </template>

      <!-- Type -->
      <template #type>
        <UiToggleGroup
          :model-value="filters.type"
          size="sm"
          @update:model-value="emit('update:filters', { ...filters, type: $event })"
        >
          <UiToggleGroupItem
            v-for="value in types"
            :key="value"
            :value="value"
            :disabled="!!isDisabled({ type: value })"
          >
            {{ value }}
          </UiToggleGroupItem>
        </UiToggleGroup>
      </template>

      <!-- Search -->
      <template #search>
        <UiInput
          :model-value="search"
          class="search-input"
          placeholder="Search resources"
          @update:model-value="emit('update:search', $event)"
        />
      </template>
    </UiTabs>

    <!-- Clear filters -->
    <Transition name="fade">
      <UiButton
        v-if="hasActiveFilters"
        class="clear-filters-button"
        size="xs"
        icon="update"
        rounded
        variant="secondary"
        aria-label="Clear filters"
        @click="emit('reset')"
      />
    </Transition>
  </section>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  resources?: Resource[] | null | undefined
  filters: { topics: string[], tags: string[], type: string[] }
  search?: string
  hasActiveFilters?: boolean
  isDisabled: ({ tag, topic, type }: { tag?: string, topic?: string, type?: string }) => boolean | undefined
  activeTab?: 'topics' | 'tags' | 'type' | 'search'
}>(), {
  resources: null,
  filters: () => ({ topics: [], tags: [], type: [] }),
  hasActiveFilters: false,
  isDisabled: () => false,
  activeTab: undefined,
})

const emit = defineEmits(['update:filters', 'update:search', 'reset', 'update:activeTab'])

const topics = computed(() => arrayUnion(props.resources?.flatMap(({ topics }) => topics ?? []).map(({ topics_id }) => topics_id.title)))
const tags = computed(() => arrayUnion(props.resources?.flatMap(({ tags }) => tags ?? []).map(({ tags_id }) => tags_id.title)))
const types = computed(() => arrayUnion(props.resources?.flatMap(({ type }) => type ?? [])))

function onTabsUpdate(value: string | number) {
  const v = String(value)
  emit('update:activeTab', v)
}
</script>

<style lang="postcss" scoped>
.resources-filters {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  width: 100%;
  padding: 0 16px;
  margin-bottom: 10vh;

  @media (max-width: 1280px) {
    padding: 0 8px;
    flex-direction: column;
    gap: var(--app-margin);
  }

  .view-mode {
    display: flex;
    width: 50%;
  }

  .filters-tabs {
    flex: 1;
    .ToggleGroup {
      flex-wrap: wrap;
      gap: 4px;
    }
    .ToggleGroupItem {
      padding: 8px 12px;
      border-radius: 40px;
    }
  }

  .clear-filters-button {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
