<template>
  <section class="log-table">
    <transition name="fade">
      <AppPreview
        v-if="!isOutside && isLargeScreen && currentCover !== null"
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
const { isLargeScreen } = useApp()

const table = ref(null)
const currentCover = ref(null)
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
