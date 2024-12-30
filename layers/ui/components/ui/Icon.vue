<template>
  <SvgIcon
    class="ui-icon"
    :name="(name as SvgName)"
    reactive
    aria-hidden
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'UiIcon' })
defineProps<{ name: string }>()
</script>
