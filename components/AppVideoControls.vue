<template>
	<img
		v-if="controlIsActive"
		class="cursor"
		:src="cursorIcon"
		alt="cursor"
		:style="{ transform: translatePosition }"
	/>
</template>

<script>
export default {
	props: {
		isPlaying: {
			type: Boolean,
			default: false,
		},
		controlIsActive: {
			type: Boolean,
			default: false,
		},
		mouseCoord: {
			type: Object,
			default: () => {},
		},
	},

	computed: {
		translatePosition() {
			return `translate(
				${this.mouseCoord.x - 15}px,
				${this.mouseCoord.y - 15}px
			)`
		},
		cursorIcon() {
			const icon = this.isPlaying ? 'icon_play' : 'icon_pause'

			return require(`@/assets/img/svg/${icon}.svg`)
		},
	},
}
</script>

<style lang="postcss">
img.cursor {
	position: absolute;
	z-index: 5;
	pointer-events: none;
	width: 30px;
	height: auto;
}
</style>
