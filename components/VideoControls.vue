<template>
	<!-- <cursor-icon
		v-if="$device.isMobile || controlIsActive"
		class="cursor"
		alt="cursor"
		:is-playing="isPlaying"
		:class="{ mobile: $device.isMobile, dark: isDark }"
		:style="transformCursor"
	/> -->
	<svg-icon v-if="isVisible" name="play"
		class="cursor"
		alt="cursor"
		:is-playing="isPlaying"
		:class="{ mobile: $device.isMobile, dark: isDark }"
		:style="transformCursor"
	/>


</template>

<script>
export default {
	props: {
		isPlaying: {
			type: Boolean,
			default: false,
		},
		isDark: {
			type: Boolean,
			default: false,
		},
		isVisible: {
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
		transformCursor() {
			if (!this.$device.isMobile) {
				return {
					transform: this.translatePosition,
				}
			}
			return {}
		},
	},
}
</script>

<style lang="postcss">
.cursor {
	position: absolute;
	z-index: 5;
	pointer-events: none;
	width: 30px;
	height: auto;
}
.mobile {
	position: absolute;
	left: calc(var(--app-margin) / 2);
	bottom: calc(var(--app-margin) / 2);
}

.dark {
	color: white;
}
</style>
