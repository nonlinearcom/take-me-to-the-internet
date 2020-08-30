<template>
	<div>
		<article class="home">
			<!-- <nuxt-link class="info" to="/info">Info</nuxt-link> -->
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
		const list = await $content('activities').sortBy('slug', 'desc').fetch()
		return { page, list }
	},
	// data() {
	// 	return {
	// 		x: 0,
	// 		y: 0,
	// 	}
	// },
	// methods: {
	// 	getMousePosition(e) {
	// 		if (e.pageX || e.pageY) {
	// 			this.x = e.pageX
	// 			this.y = e.pageY
	// 		} else if (e.clientX || e.clientY) {
	// 			this.x =
	// 				e.clientX +
	// 				document.body.scrollLeft +
	// 				document.documentElement.scrollLeft
	// 			this.y =
	// 				e.clientY +
	// 				document.body.scrollTop +
	// 				document.documentElement.scrollTop
	// 		}
	// 	},
	// },
}
</script>

<style lang="postcss">
/* fade transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

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
}
</style>
