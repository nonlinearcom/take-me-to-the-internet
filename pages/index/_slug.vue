<template>
	<section class="panel">
		<nuxt-link to="/">back</nuxt-link>
		<h2>{{ page.institution }}</h2>
		<h2>{{ page.title }}</h2>
		<h3>{{ page.role }}</h3>
		<h3>{{ page.assistant }}</h3>
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
	z-index: 20;
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

@media (max-width: 1200px) {
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
