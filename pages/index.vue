<template>
	<article class="intro ">
		<HomeHeader @expand="expand()"/>
		<HomeInfo :info="info" :expanded="expanded"/>
		<HomeTable :table-data="list" />
		<NuxtChild />
	</article>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
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

		const info = await $content('', 'info').fetch()

		return { list, info }
	},
	data() {
		return {
			expanded: false
		}
	},
	methods: {
		expand() {
			console.log('expand')
			this.expanded = !this.expanded
		}
	},
}
</script>

<style lang="postcss">

.bio{
	padding-left: 50%;
	padding-right: var(--app-margin-small);

	p{
		max-width: 44ch;
	}
}


article.intro {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

}
@media (max-width: 540px) {

}
</style>
