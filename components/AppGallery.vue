<template>
	<div>
		<img
			v-for="item in gallery"
			:key="item.alt"
			class="responsive"
			:src="getImage(item.image)"
		/>
	</div>
</template>

<script>
export default {
	props: {
		gallery: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		getImage(image) {
			return this.$cloudinary().url(image, {
				// width: 300,
				// crop: 'scale',
				// dpr: '2.0',
			})
		},
	},
}
</script>

<style lang="postcss">
.responsive {
	width: 100%;
	height: auto;
}
</style>
