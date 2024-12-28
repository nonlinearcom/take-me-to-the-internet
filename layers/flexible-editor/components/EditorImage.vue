<template>
  <NuxtImg
    class="image"
    loading="lazy"
    :src="data.image"
    :alt="data.image?.description"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()
</script>
