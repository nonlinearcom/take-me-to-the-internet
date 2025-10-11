<template>
  <div
    class="editor-iframe"
    v-html="data.iframe"
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

<style lang="postcss">
.editor-iframe {
  position: relative;
  width: 100%;
  margin: var(--app-margin) 0;
  padding-bottom: calc(100% * 1 / 1);

  iframe {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
