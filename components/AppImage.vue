<template>
	<figure
		class="responsive"
		:class="{ active: inView }"
		@mouseenter="showCaption = true"
		@mouseleave="showCaption = false"
	>
		 <nuxt-picture
		 	class="responsive"
			provider="cloudinary"
			:src="item.media"
		/>

		<transition name="fade">
			<figcaption v-if="showCaption">{{ item.caption }}</figcaption>
		</transition>
	</figure>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			showCaption: false,
			lqip: 20,
			small: 480,
			medium: 960,
			large: 1600,
			inView: false,
		}
	},
	methods: {
		visibilityChanged(isVisible, entry) {
			this.inView = isVisible
			// console.log(isVisible, entry)
		},
	},
}
</script>

<style lang="postcss">
figure {
	position: relative;
	width: 100%;

	&.active picture img {
		transition: opacity 0.5s;
		opacity: 1;
	}

	picture {
		width: 100%!important;
		height: auto;
		overflow: hidden;

		img {
			transition: opacity 0.5s;

			/* opacity: 0.5; */
			width: 100%; /* stretch to fill the picture element */
			transition: filter 0.5s;
		}
	}
	figcaption {
		display: block;
		position: absolute;
		right: calc(var(--app-margin) / 2);
		bottom: calc(var(--app-margin) / 2);
		/* right: 0;
		bottom: 0; */
		border-radius: 20px;



		font-size: var(--text-mini);

		color: var(--color);
		background:rgba(var(--bg-rgb), 0.8);
		padding: 0 10px;
	}
}
</style>
