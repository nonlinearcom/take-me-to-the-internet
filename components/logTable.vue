<template>
  <section class="log-table">
    <transition name="fade">
      <AppPreview
        v-if="!isOutside && isLaptop && currentCover !== null"
        :cover="currentCover"
        :x-pos="xPos"
        :y-pos="yPos"
      />
    </transition>

    <AppTable
      ref="table"
      :table-data="tableData"
      @show-cover="getCoverUrl($event)"
    />
  </section>
</template>

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
})
const table = ref(null)
const currentCover = ref(null)
const { isLaptop } = useMyBreakpoints()

function getCoverUrl(url) {
  currentCover.value = url
}

const { isOutside, xPos, yPos } = useFollowMe(table)
</script>

<style lang="postcss">
.log-table {
  /* margin: 25vh 0 50px; */
  margin: 25vh 0 250px;
}
</style>
