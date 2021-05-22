<template>
	<div>
		<article class="home">
			<TablePreview :table-data="list" />
		</article>
		<NuxtChild />
	</div>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
		// const page = await $content('index').fetch()
		const list = await $content('activities', { deep: true })
			.only([
				'title',
				'slug',
				'type',
				'role',
				'institution',
				'location',
				'offline',
				'cover',
				'dir',
				'year',
				'path',
			])
			.sortBy('year', 'desc')
			.fetch()

		return { list }
	},
}
</script>

<style lang="postcss">
article.home {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	/* padding: var(--app-margin-small); */

	.nuxt-content {
		margin-bottom: 25vh;
	}
	.info {
		position: absolute;
		top: var(--app-margin);
		right: var(--app-margin);
		z-index: 10;
	}

	.container {
		max-width: 50ch;
	}
}
@media (max-width: 540px) {
	/* article.home {
		padding: var(--app-margin-mini);
	} */
}
</style>
