<template>
  <Icon
    class="ui-icon"
    :name="`${collection}:${name}`"
    aria-hidden
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'UiIcon' })
withDefaults(defineProps<{
  name: string
  collection?: string
}>(), { collection: 'ui' })
</script>
