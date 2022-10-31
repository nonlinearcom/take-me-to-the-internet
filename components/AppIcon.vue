<template>
  <component :is="icon" class="icon sprite-icons"/>
</template>

<script setup>
// vite-svg-loader solution for custom icons (@nuxtjs/svg-sprite workaround )
const props = defineProps({
	name: String,
})
const icon = computed(() =>
  defineAsyncComponent(() => import(`../assets/icons/${props.name}.svg`))
)
</script>
