<template>
	<section @mousemove.passive="getMousePosition">
		<AppPreview
			v-if="$device.isDesktop"
			:is-active="previewIsActive"
			:cover="previewCover"
			:cover-x="followX"
			:cover-y="followY"
		/>
		<AppTable
			ref="table"
			:table-data="tableData"
			@getCurrentCover="setPreviewCover($event)"
			@mouseenter.native="previewIsActive = true"
			@mouseleave.native="previewIsActive = false"
		/>
	</section>
</template>

<script>
export default {
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			followX: 0,
			followY: 0,
			x: 0,
			y: 0,
			previewIsActive: false,
			previewCover: null,
		}
	},
	computed: {
		dX() {
			return this.x - this.followX
		},
		dY() {
			return this.y - this.followY
		},
	},

	mounted() {
		this.movePreview()
	},
	methods: {
		setPreviewCover(coverName) {
			this.previewCover = coverName
		},
		movePreview() {
			// https://codepen.io/tguelcan-the-sasster/pen/ROoxWm
			// this.dX = this.x - this.followX
			// this.dY = this.y - this.followY
			this.followX += this.dX / 10
			this.followY += this.dY / 10

			window.requestAnimationFrame(this.movePreview)
		},
		getMousePosition(e) {
			this.x = e.clientX
			this.y = e.clientY - this.$refs.table.$el.getBoundingClientRect().y
		},
	},
}
</script>

<style lang="postcss">
section {
}
</style>
