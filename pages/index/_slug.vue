<template>
	<article class="panel">
		<nuxt-link class="close text-mini" to="/">CLOSE</nuxt-link>
		<header>
			<div class="full">
				<h2 v-if="page.title" class="title">{{ page.title }}</h2>
				<h2 v-if="page.subtitle" class="title">{{ page.subtitle }}</h2>
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
			// default slug
			// page = await $content('activities', params.slug).fetch()

			// custom slug
			page = await $content('activities', { deep: true })
				.where({ slug: params.slug })
				.fetch()
		} catch (e) {
			return error({ statusCode: 404, message: 'Page not found' })
		}
		return { page: page[0] }
	},
	head() {
		return {
			title: `${this.page.title}`,
			meta: [
				{
					hid: 'og:title',
					name: 'og:title',
					content: this.page.title,
				},
				{
					hid: 'og:description',
					name: 'og:description',
					content: `${this.page.subtitle}, ${this.page.departement}, ${this.page.institution}, ${this.page.year}`,
				},
				{
					hid: 'og:image',
					name: 'og:image',
					// content: this.$cloudinary.image.url(this.page.cover),
					// content: `https://res.cloudinary.com/non-linear/image/upload/${this.page.cover}`,
					content: `https://res.cloudinary.com/non-linear/image/upload/f_auto,q_auto/v1/${this.page.cover}`,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: this.page.title,
				},
				{
					hid: 'twitter:description',
					name: 'twitter:description',
					content: `${this.page.subtitle}, ${this.page.departement}, ${this.page.institution}, ${this.page.year}`,
				},
				{
					hid: 'twitter:image',
					name: 'twitter:image',
					// content: this.$cloudinary.image.url(this.page.cover),
					content: `https://res.cloudinary.com/non-linear/image/upload/f_auto,q_auto/v1/${this.page.cover}`,
				},
			],
		}
	},
}
</script>
<style lang="postcss">
.panel {
	position: fixed;
	top: 0;
	right: 0;

	transform: translateX(100%);
	background-color: var(--bg);
	width: 50%;
	height: 100vh;
	transition: transform 0.5s ease-out;
	transform: translateX(0%);
	overflow-y: auto;
	overflow-x: hidden;
	z-index: 20;

	/* https://alligator.io/css/transition-box-shadows/ */
	box-shadow: 0 0px 40px rgba(0, 0, 0, 0.3);

	a.close {
		display: block;
		position: absolute;
		top: 18px;
		right: var(--app-margin);
		font-size: 12px;
		font-weight: 400;
		border: 1px solid var(--color);
		border-radius: 20px;
		padding: 0 10px;
	}
}

.panel header {
	margin: var(--app-margin);
	display: grid;
	grid-template-columns: 2fr 1fr;
	/* grid-template-columns: repeat(3, 1fr); */

	grid-gap: calc(var(--app-margin) / 2);

	.full {
		grid-column: 1 / span 2;
		margin-bottom: 100px;

	}
	.title{
		font-size: var(--title);
	}
	.description{
		grid-column: 1 / span 1;
	}

	h2 {
		font-size: var(--text);
		margin-bottom: 0;
	}
	.subtitle span {
		display: block;
	}
	p {
		grid-column: 1 / span 2;
		/* max-width: 600px; */
	}

	aside {
		h3 {
			margin-bottom: 0;
		}
	}
}

.panel img {
	display: block;
}

.panel .partecipants {
	margin: calc(var(--app-margin) / 2);
	ul {
		padding: 0;
		font-size: var(--text-small);
		font-weight: 400;
		column-width: 400px;

		li {
			margin: 0;
			list-style-type: none;
		}
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

@media (max-width: 1440px) {
	.panel {
		width: 66.66%;
	}
}


@media (max-width: 1024px) {
	.panel {
		width: 100%;
		box-shadow: none;
		header {
			display: flex;
			flex-direction: column;
			.meta {
				order: 1;
			}
			.description {
				order: 2;
			}
		}
	}
}
</style>
