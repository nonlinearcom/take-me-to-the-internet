<template>
  <div class="resource-grid">
    <ResourceGridItem
      v-for="resource in resources"
      :key="resource.id"
      :resource="resource"
      @row-hover="$emit('rowHover', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  resources: Resource[]
}>()

defineEmits(['rowHover'])
</script>

<style lang="postcss" scoped>
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--app-margin);
  padding: var(--app-margin);
}
</style>
