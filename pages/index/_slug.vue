<template>
	<section class="panel">
		<nuxt-link to="/">back</nuxt-link>
		<nuxt-content :document="page" />
	</section>
</template>

<script>
export default {
	async asyncData({ app, params, $content }) {
		const { slug } = params
		const page = await $content('activities', slug).fetch()
		console.log(page)
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
	background-color: #e5e5e5;
	width: 50%;
	height: 100vh;
	transition: all 0.5s;
	transform: translateX(0%);
}
// Page transitions

.page-enter-active,
.page-leave-active {
	transition: all 0.5s;
}
.page-enter,
.page-leave-active {
	opacity: 0;
	transform: translateX(100%);
}
</style>
