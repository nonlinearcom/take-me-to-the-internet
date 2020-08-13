<template>
	<div>
		<article>
			<nuxt-content :document="page" />
			<AppTable :table-data="list" />
		</article>

		<NuxtChild />
	</div>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
		const page = await $content('index').fetch()
		const list = await $content('activities').sortBy('slug', 'desc').fetch()
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

	.nuxt-content {
		margin-bottom: 25vh;

		.info {
			position: absolute;
			top: 0;
			right: 0;
		}
	}
}
</style>
