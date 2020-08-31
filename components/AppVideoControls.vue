<template>
	<section>
		<img
			v-if="controlIsActive"
			:src="cursorIcon"
			:alt="isPlaying ? 'Play' : 'Pause'"
			:style="{ transform: translatePosition }"
		/>
	</section>
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
	data() {
		return {
			followX: 0,
			followY: 0,
		}
	},
	computed: {
		dX() {
			return this.mouseCoord.x - this.followX
		},
		dY() {
			return this.mouseCoord.y - this.followY
		},
		translatePosition() {
			return `translate(${this.followX}px, ${this.followY}px)`
		},
		cursorIcon() {
			if (this.isPlaying) {
				return '/svg/icon_play.svg'
			} else return '/svg/icon_pause.svg'
		},
	},

	mounted() {
		this.movePreview()
	},
	methods: {
		movePreview() {
			// https://codepen.io/tguelcan-the-sasster/pen/ROoxWm
			// this.dX = this.x - this.followX
			// this.dY = this.y - this.followY
			this.followX += this.dX
			this.followY += this.dY

			window.requestAnimationFrame(this.movePreview)
		},
	},
}
</script>

<style lang="postcss">
section {
	img {
		position: absolute;
		z-index: 5;
		pointer-events: none;
		width: 50px;
		height: auto;
	}
}
</style>
