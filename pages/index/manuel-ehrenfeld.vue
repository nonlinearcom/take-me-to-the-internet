<template>
	<article class="panel">
		<nuxt-link class="close text-mini" to="/">CLOSE</nuxt-link>
		<header>
			<div class="full">
				<h2 v-if="page.title" class="header-title">
					{{ page.title }}
					<template v-if="page.subtitle"><br>{{ page.subtitle }}</template>
				</h2>
			</div>
			<div class="description">
				<nuxt-content :document="page" />
			</div>
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

		<div v-if="page.partecipants" class="partecipants">
			<h3>Partecipants</h3>
			<ul>
				<li v-for="partecipant in page.partecipants" :key="partecipant">
					{{ partecipant }}
				</li>
			</ul>
		</div>
	</article>
</template>

<script>
export default {
	layout: 'panel',
	transition: 'page',
	async asyncData({ params, $content, error }) {
		let page
		try {
			page = await $content('', 'info').fetch()
		} catch (e) {
			return error({ statusCode: 404, message: 'Page not found' })
		}
		return { page }
	},
}
</script>
