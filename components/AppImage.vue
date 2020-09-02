<template>
	<figure
		class="responsive"
		@mouseenter="showCaption = true"
		@mouseleave="showCaption = false"
	>
		<img
			:key="item.media"
			:alt="item.alt"
			:width="lqip"
			height="15"
			:src="getImage(item.media, lqip)"
			:srcset="getSrcs(item.media)"
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
			small: 600,
			medium: 1000,
			large: 1500,
		}
	},
	methods: {
		getImage(image, size) {
			return this.$cloudinary().url(image, {
				width: size,
				crop: 'scale',
				dpr: '2.0',
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
	img {
		width: 100%;
		height: auto;
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
