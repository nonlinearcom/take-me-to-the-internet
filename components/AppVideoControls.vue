<template>
	<img
		v-if="$device.isMobile"
		:src="cursorIcon"
		class="cursor mobile"
		alt="cursor"
	/>
	<img
		v-else-if="controlIsActive"
		class="cursor"
		alt="cursor"
		:src="cursorIcon"
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
img.mobile {
	position: absolute;
	left: calc(var(--app-margin) / 2);
	bottom: calc(var(--app-margin) / 2);
}
</style>
