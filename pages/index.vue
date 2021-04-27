<template>
	<div>
		<article class="home">
			<nuxt-link class="info" to="/info">Info</nuxt-link>
			<nuxt-content :document="page" />
			<TablePreview :table-data="list" />
		</article>
		<NuxtChild />
	</div>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
		const page = await $content('index').fetch()
		const list = await $content('activities',{deep: true})
			.only(['title', 'slug', 'type', 'role', 'institution', 'location', 'offline', 'cover' , 'dir', 'year', 'path'])
			.sortBy('year', 'desc').fetch()

		return { page, list }
	},
}
</script>

<style lang="postcss">


article.home {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: var(--app-margin);

	.nuxt-content {
		margin-bottom: 25vh;
	}
	.info {
		position: absolute;
		top: var(--app-margin);
		right: var(--app-margin);
		z-index: 10;
	}

	.container{
		max-width: 50ch;
	}
}
</style>
