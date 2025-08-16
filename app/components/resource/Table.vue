<template>
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
          @click="emit('toggleSort', header.key)"
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
        v-for="(item, index) in resources"
        :key="index"
        @mouseover="emit('rowHover', item?.cover)"
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
            <UiButton
              variant="ghost"
              size="sm"
              :padded="false"
              :label="item.title + (item.subtitle ? ` ${item.subtitle}` : '')"
              class="resource-title"
              @click="emit('viewResource', item)"
            />
          </span>
        </td>
        <td class="type">
          {{ item.type }}
        </td>
        <td class="table-year">
          {{ item.year }}
        </td>
        <td class="author">
          {{ item.people.map(({ people_id }) => people_id.name).join(', ') }}
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
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  resources?: Resource[]
  isSortedBy?: (key: string, direction: 'asc' | 'desc') => boolean
}>(), {
  resources: () => [],
  isSortedBy: () => false,
})
const emit = defineEmits(['toggleSort', 'rowHover', 'viewResource'])

const headers: { key: ResourceSortKey, label: string }[] = [
  { key: 'slug', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'year', label: 'Year' },
  { key: 'author', label: 'Author' },
  { key: 'open', label: 'Open' },
]

const table = ref(null)
defineExpose({ table })
</script>

<style lang="postcss" scoped>
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
  }
  .resource {
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    /* allow multiline children to expand the row height */
    > * {
      align-self: stretch;
    }
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
  }

  .ui-button {
    line-height: 1.2;
    flex-shrink: 1;
  }

  /* Allow long titles to wrap within available space */
  .resource-title {
    white-space: normal;
    text-align: left;
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: break-word;
    flex: 1 1 auto;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0;
  }

  tr {
    width: 100%;
    display: flex;
    align-items: stretch;
    position: relative;
  }

  td,
  th {
    border-top: 1px solid rgba(var(--current-gray-rgb-inverted), 0.25);
    align-items: stretch;
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
