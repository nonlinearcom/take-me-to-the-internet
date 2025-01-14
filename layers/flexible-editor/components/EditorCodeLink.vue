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
  position: relative;

  @media (hover) {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
