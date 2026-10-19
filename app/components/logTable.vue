<template>
  <section class="log-table">
    <AppPreview
      :visible
      :cover="currentCover"
      :x-pos="xPos"
      :y-pos="yPos"
    />

    <AppTable
      ref="table"
      :table-data="tableData"
      @show-cover="setCover($event)"
    />
  </section>
</template>

<script setup>
defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
})

const table = ref(null)
const { currentCover, setCover, visible, xPos, yPos } = useCoverPreview(table)
</script>

<style lang="postcss">
.log-table {
  margin: 25vh 0 250px;
}
</style>
