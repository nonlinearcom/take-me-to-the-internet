<template>
	<div ref="galleryContainer" @mousemove.passive="getMousePosition">
		<div v-for="item in gallery" :key="item.media">
			<AppVideo
				v-if="item.type == 'video'"
				:item="item"
				:mouse-coord="mouseCoord"
			/>
			<AppImage v-else :item="item" />
		</div>
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
			this.mouseCoord.x =
				e.clientX - e.target.getBoundingClientRect().x - 50
			this.mouseCoord.y =
				e.clientY - e.target.getBoundingClientRect().y - 50
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
