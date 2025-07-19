<template>
  <table>
    <tbody role="presentation">
      <tr
        v-for="(item, index) in tableData"
        :key="item.slug"
        :class="{ offline: item.status === 'archived' }"
        tabindex="0"
        role="row"
        :aria-disabled="item.status === 'archived'"
        @click="goToPanel(item)"
        @mouseover="$emit('showCover', item.cover)"
      >
        <td
          class="year"
          :class="{ visible: dateCheck(item.year, index) }"
        >
          {{ item.year }}
        </td>
        <td class="type">
          {{ item.type }}
        </td>
        <td class="title">
          <h3 v-if="item.status === 'archived'">
            {{ item.title }}
          </h3>
          <NuxtLink
            v-else
            class="stretched-link"
            :to="`/log/${item.slug}`"
          >
            {{ item.title }}
          </NuxtLink>
        </td>
        <td class="role">
          {{ item.role }}
        </td>
        <td class="institution">
          {{ item.institution }}
        </td>
        <td class="location">
          {{ item.location }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['showCover'])

function goToPanel(item) {
  if (item.status === 'archived')
    return
  console.log('naviagte to:', `/log/${item.slug}`)
  return navigateTo(`/log/${item.slug}`)
}

function getYear(index) {
  return props.tableData[index].year
}
function dateCheck(year, index) {
  const prevIndex = index - 1

  // display first by default
  if (prevIndex === -1) {
    return true
  }

  if (year === getYear(prevIndex)) {
    return false
  } else {
    return true
  }
}
</script>

<style lang="postcss">
table {
  margin-top: auto;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  cursor: pointer;
  tr {
    position: relative;

    &:last-child {
      border-bottom: 1px solid var(--border-color);
    }
    &:hover {
      /* cursor: pointer; */
    }
    &.offline {
      cursor: default;
      color: #888;
    }
    &:focus {
      background-color: var(--bg-hover);
      border: none;
      outline: none;
    }
    td {
      font-size: var(--text-small);
      font-weight: 400;
      text-align: left;
      vertical-align: top;
      line-height: 1.4;
      padding: 8px 16px;
      border-top: 1px solid var(--border-color);

      &.year {
        border-top: none;
        opacity: 0;
      }
      &.year.visible {
        border-top: 1px solid var(--border-color);
        opacity: 1;
      }
      &.title a:focus {
        background-color: var(--bg-hover);
      }
      h3 {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 1024px) {
  table .location {
    display: none;
  }
}

@media (max-width: 900px) {
  table .role {
    display: none;
  }
}

@media (max-width: 640px) {
  table .type {
    display: none;
  }
}

@media (max-width: 540px) {
  table tr {
    border-top: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;

    td {
      border-top: none;
      padding: 0;
    }
  }
  table tr td {
    padding: 8px 0 0 var(--app-margin-mini);
  }
  table .year {
    flex: 0 1 60px;
  }
  table .title {
    border-top: 1px solid var(--border-color);
    flex-basis: calc(100% - 60px);
  }

  table .location {
    display: none;
  }

  table .institution {
    margin-left: 60px;
    padding-bottom: 8px;
    /* display: none; */
  }
}
</style>
