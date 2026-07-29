<template>
  <section class="resource-grid">
    <article
      v-for="resource in resources"
      :key="resource.id"
      class="resource-grid-item"
      @click="$emit('viewResource', resource)"
    >
      <NuxtImg
        v-if="resource.cover"
        class="cover"
        :src="resource.cover"
        :width="300"
        fit="inside"
        format="auto"
        :alt="resource.title"
      />
      <h2 class="title">
        {{ resource.title }}
      </h2>
    </article>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  resources: Resource[]
}>()

defineEmits(['rowHover', 'viewResource'])
</script>

<style lang="postcss" scoped>
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--app-margin);
  padding: var(--app-margin);

  .resource-grid-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-self: self-start;
    cursor: pointer;

    &:hover {
      .title {
        text-decoration: underline;
      }
    }

    .cover {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
    .title {
      font-size: var(--text-small);
      cursor: pointer;
    }
  }
}
</style>
