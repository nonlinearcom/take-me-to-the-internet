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
			page = await $content('activities', params.slug).fetch()
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
	transition: transform 0.5s ease-out;
	transform: translateX(0%);
	overflow-y: auto;
}
// Page transitions
.page-enter-active,
.page-leave-active {
	transition: transform 0.5s ease-out;
}

.page-enter,
.page-leave-to {
	/* opacity: 0; */
	transform: translateX(100%);
}

@media (max-width: 1024px) {
	.panel {
		width: 66.66%;
	}
}

@media (max-width: 640px) {
	.panel {
		width: 90%;
	}
}
</style>
