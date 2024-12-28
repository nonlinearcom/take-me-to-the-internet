<template>
  <div class="editor-gallery">
    <NuxtImg
      v-for="image in data.content"
      :key="image.id"
      class="image"
      loading="lazy"
      :src="image.directus_files_id"
      :alt="image.directus_files_id?.description"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()
</script>
