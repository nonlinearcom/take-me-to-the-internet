<template>
	<img
		:key="item.media"
		class="responsive"
		:src="getImage(item.media)"
		:alt="item.alt"
	/>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => {},
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
