<template>
	<section class="panel">
		<nuxt-link to="/">back</nuxt-link>
		<nuxt-content :document="page" />
	</section>
</template>

<script>
export default {
	async asyncData({ params, $content, error }) {
		let page
		try {
			page = await $content('', 'info').fetch()
		} catch (e) {
			return error({ statusCode: 404, message: 'Page not found' })
		}
		return { page }
	},
	layout: 'panel',
	transition: 'page',
}
</script>
<style lang="postcss">
.panel {
	position: fixed;
	top: 0;
	right: 0;
	padding: var(--app-margin);
	transform: translateX(100%);
	background-color: white;
	border-left: 1px solid #888;
	width: 50%;
	height: 100vh;
	transition: all 0.5s;
	transform: translateX(0%);
}
</style>
