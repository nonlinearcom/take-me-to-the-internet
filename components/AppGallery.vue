<template>
	<div ref="galleryContainer" @mousemove.passive="getMousePosition">
		<template v-for="item in gallery">
			<AppVideo
				v-if="item.type == 'video'"
				:key="item.media"
				:item="item"
				:mouse-coord="mouseCoord"
			/>
			<AppImage v-else :key="item.media" :item="item" />
		</template>
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
	data() {
		return {
			mouseCoord: {
				x: 0,
				y: 0,
			},
		}
	},
	methods: {
		getMousePosition(e) {
			this.mouseCoord.x = e.clientX - e.target.getBoundingClientRect().x
			// e.clientX - e.target.getBoundingClientRect().x - 50
			this.mouseCoord.y = e.clientY - e.target.getBoundingClientRect().y
			// e.clientY - e.target.getBoundingClientRect().y - 50
		},
	},
}
</script>

<style lang="postcss">

</style>
