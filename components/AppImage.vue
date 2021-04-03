<template>
	<figure
		class="responsive"
		:class="{ active: inView }"
		@mouseenter="showCaption = true"
		@mouseleave="showCaption = false"
	>
		<!-- <picture
			v-observe-visibility="{
				callback: visibilityChanged,
				once: true,
			}"
		>
			<source
				:srcset="getImage(small)"
				:media="`(max-width: ${small}px)`"
			/>
			<source
				:srcset="getImage(medium)"
				:media="`(max-width: ${medium}px)`"
			/>
			<source
				:srcset="getImage(large)"
				:media="`(max-width: ${large}px)`"
			/>

			<img :src="getImage(large)" :alt="item.alt" loading="lazy" />
		</picture> -->

		 <nuxt-picture
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
		width: 100%;
		height: auto;
		overflow: hidden;

		img {
			transition: opacity 0.5s;

			/* opacity: 0.5; */
			width: 100%; /* stretch to fill the picture element */
			transition: filter 0.5s;
		}

		/* &.lazy img {
			filter: blur(10px);
		} */
	}
	figcaption {
		position: absolute;
		left: calc(var(--app-margin) / 2);
		bottom: calc(var(--app-margin) / 2);

		display: block;
		font-size: var(--font-size-small);
		font-weight: 400;
		color: #888;
		background: rgba(255, 255, 255, 1);
		border-radius: 20px;
		padding: 0 10px;
	}
}
</style>
