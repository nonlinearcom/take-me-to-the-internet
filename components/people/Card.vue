<template>
  <div class="people-card">
    <NuxtImg
      v-if="author.picture"
      class="cover"
      :src="`${author.picture}?fit=cover&width=200&height=200&format=auto&withoutEnlargement=true`"
      :alt="author.name"
    />
    <p v-if="author.description">
      {{ author.description }}
    </p>

    <UiButton
      v-if="author.link"
      :label="author.name"
      icon="external-link"
      variant="primary"
      size="sm"
      :to="author.link"
      target="_blank"
    />
    <p>{{ author.resources }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  author: Person
}>()
</script>

<style lang="postcss">
.people-card {
  padding: var(--app-margin);
}
</style>
