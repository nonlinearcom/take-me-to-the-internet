<template>
  <NuxtLink :to="data.link">
    <code> {{ data.code }} </code>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()
</script>

<style lang="postcss" scoped>
code {
  font-size: calc(var(--text) - 2px);
  padding: 1px;
}
</style>
