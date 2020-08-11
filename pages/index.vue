<template>
	<div>
		<article>
			<nuxt-content :document="page" />
			<AppTable :table-data="list" />
		</article>
		<NuxtChild :key="$route.params.id" />
	</div>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
		const page = await $content('index').fetch()
		const list = await $content('activities').sortBy('slug', 'asc').fetch()
		return { page, list }
	},
}
</script>

<style lang="postcss">
article {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: var(--app-margin);
}
</style>
