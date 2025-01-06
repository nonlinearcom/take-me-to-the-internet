<template>
  <div class="people-card">
    <h2 class="title">
      {{ author.name }}
    </h2>
    <NuxtImg
      v-if="author.picture"
      class="cover"
      :src="`${author.picture}?fit=contain&width=200&format=auto&withoutEnlargement=true`"
      :alt="author.name"
    />
    <div
      v-if="author.description"
      class="description"
      v-html="author.description"
    />

    <ul class="resources">
      <li
        v-for="resource in author.resources"
        :key="resource.resources_id.id"
      >
        <UiButton
          icon="external-link"
          :label="resource.resources_id.title"
          variant="primary"
          padded
          size="sm"
          :to="resource.resources_id.link"
          target="_blank"
        />
      </li>
    </ul>

    <UiButton
      v-if="author.link"
      :label="author.name"
      icon="external-link"
      variant="accent"
      size="sm"
      :to="author.link"
      target="_blank"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  author: Person
}>()
</script>

<style lang="postcss">
.people-card {
  display: flex;
  flex-direction: column;
  padding: var(--app-margin-small);
  gap: var(--text);

  .title {
    margin-top: 0px !important;
    margin-bottom: 8px !important;
    font-size: var(--text-large);
  }
  .cover {
    width: 150px;
    height: auto;
    border-radius: 4px;
  }
  .description {
    font-size: var(--text-small);
  }
  .resources {
    display: flex;
    gap: 4px;
    flex-direction: column;
    font-size: var(--text-small);
  }
}
</style>
