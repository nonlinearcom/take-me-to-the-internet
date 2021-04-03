<template>
	<transition name="fade">
		<img
			v-show="isActive"
			class="previewCover"
			:src="preview"
			alt="alt"
			:style="{ transform: translatePosition }"
		/>
	</transition>
</template>

<script>
export default {
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		cover: {
			type: String,
			default: 'take-me-to-the-internet/test1',
		},
		coverX: {
			type: Number,
			default: 0,
		},
		coverY: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		preview() {
			return this.$cloudinary.image.url(this.cover, { width: 600, crop: 'scale', dpr: '2.0',})
		},
		translatePosition() {
			return `translate(${this.coverX}px, ${this.coverY}px)`
		},
	},
}
</script>

<style lang="postcss">
.previewCover {
	position: absolute;
	/* transition: all 2s; */
	max-width: 600px;
	width: 400px;
	height: auto;
	z-index: 5;
	pointer-events: none;
}
</style>
