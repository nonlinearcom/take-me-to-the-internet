<template>
	<article class="panel">
		<nuxt-link class="close text-mini" to="/">CLOSE</nuxt-link>
		<header>
			<div class="full">
				<h2 v-if="page.title" class="title">{{ page.title }}</h2>
				<h2 v-if="page.subtitle" class="title">{{ page.subtitle }}</h2>
			</div>

			<nuxt-content :document="page" />

			<aside v-if="page.role" class="meta">
				<h3>{{ page.department }}</h3>
				<h3>{{ page.institution }}</h3>
				<h3>{{ page.location }}, {{ page.year }}</h3>
				<h3>{{ page.type }}</h3>
				<!-- <h3>{{ page.role }}</h3>
				<h3>{{ page.assistant }}</h3> -->
			</aside>
		</header>
		<AppGallery v-if="page.gallery" :gallery="page.gallery" />
		<AppVideoGallery v-if="page.videos" :videos="page.videos" />
	</article>
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
	transform: translateX(100%);
	background-color: white;
	background-color: #f5f5f5;
	/* border-left: 1px solid #888; */
	width: 50%;
	height: 100vh;
	transition: transform 0.5s ease-out;
	transform: translateX(0%);
	overflow-y: auto;
	z-index: 20;

	a.close {
		display: block;
		position: absolute;
		top: 18px;
		right: var(--app-margin);
		font-size: 12px;
		font-weight: 400;
		border: 1px solid var(--text-color);
		border-radius: 20px;
		padding: 0 10px;
	}
	header {
		margin: var(--app-margin);

		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-gap: calc(var(--app-margin) / 2);

		.full {
			grid-column: 1 / span 2;
			margin-bottom: 100px;
		}
		h2 {
			font-size: var(--font-size);
			font-weight: 400;
			margin-bottom: 0;
		}
		.subtitle span {
			display: block;
		}
		p {
			max-width: 600px;
		}

		aside {
			h3 {
				margin-bottom: 0;
			}
		}
	}

	img {
		display: block;
	}
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
		width: 100%;
		header {
			display: block;
		}
	}
}
</style>
