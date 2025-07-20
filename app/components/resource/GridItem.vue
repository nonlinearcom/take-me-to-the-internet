<template>
  <article class="resource-grid-item">
    <NuxtImg
      v-if="resource.cover"
      class="cover"
      :src="`${resource.cover}?fit=inside&width=300&&format=auto&withoutEnlargement=true`"
      :alt="resource.title"
    />
    <h2 class="title">
      {{ resource.title }}
    </h2>
  </article>
</template>

<script lang="ts" setup>
defineProps<{
  resource: Resource
}>()
</script>

<style lang="postcss" scoped>
.resource-grid-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: self-start;
  .cover {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }
  .title {
    font-size: var(--text-small);
  }
}
</style>
