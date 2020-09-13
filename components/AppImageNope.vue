<template>
	<img
		v-observe-visibility="{
			callback: visibilityChanged,
			once: true,
		}"
		:class="{ active: inView }"
		class="responsive"
		:alt="item.alt"
		:src="getLqip(item.media)"
		:srcset="getSrcs(item.media)"
		sizes="70vmin"
	/>
</template>

<script>
import lozad from 'lozad'

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
			small: 600,
			medium: 1000,
			large: 1500,
			inView: false,
		}
	},

	methods: {
		visibilityChanged(isVisible, entry) {
			this.inView = isVisible
			// console.log(isVisible, entry)
		},
		getLqip(image) {
			return this.$cloudinary().url(image, {
				width: this.lqip,
				crop: 'scale',
				blur: 500,
			})
		},
		getImage(image, size) {
			return this.$cloudinary().url(image, {
				width: size,
				crop: 'scale',
				dpr: 'auto',
				fetchFormat: 'auto',
			})
		},
		getSrcs(image) {
			return `
			${this.getImage(image, this.small)} ${this.small}w,
			${this.getImage(image, this.medium)} ${this.medium}w,
			${this.getImage(image, this.large)} ${this.large}w
		`
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

			opacity: 0.5;
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
