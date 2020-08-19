<template>
	<div>
		<article ref="canvas" @mousemove.passive="getMousePosition">
			<nuxt-link class="info" to="/info">Info</nuxt-link>
			<nuxt-content :document="page" />

			<transition name="fade">
				<img
					v-if="previewIsActive"
					class="previewCover"
					:src="preview"
					alt="alt"
					:style="{ transform: translatePosition }"
				/>
			</transition>

			<AppTable
				:table-data="list"
				@mouseover.native="previewIsActive = true"
				@mouseleave.native="previewIsActive = false"
			/>
		</article>
		<NuxtChild />
	</div>
</template>

<script>
export default {
	async asyncData({ app, $content }) {
		const page = await $content('index').fetch()
		const list = await $content('activities').sortBy('slug', 'desc').fetch()
		return { page, list }
	},
	data() {
		return {
			followX: 0,
			followY: 0,
			x: 0,
			y: 0,
			dX: 0,
			dY: 0,
			friction: 0.03,
			animation: false,
			previewIsActive: false,
		}
	},
	computed: {
		preview() {
			return this.$cloudinary().url('take-me-to-the-internet/test1', {
				width: 300,
				crop: 'scale',
				dpr: '2.0',
			})
		},
		translatePosition() {
			return `translate(${this.followX}px, ${this.followY}px)`
		},
	},
	mounted() {
		// this.movePreview()
		this.movePreview()
	},
	methods: {
		movePreview() {
			// https://codepen.io/tguelcan-the-sasster/pen/ROoxWm
			this.dX = this.x - this.followX
			this.dY = this.y - this.followY

			this.followX += this.dX / 40
			this.followY += this.dY / 40

			window.requestAnimationFrame(this.movePreview)
		},
		getMousePosition(e) {
			if (e.pageX || e.pageY) {
				this.x = e.pageX
				this.y = e.pageY
			} else if (e.clientX || e.clientY) {
				this.x =
					e.clientX +
					document.body.scrollLeft +
					document.documentElement.scrollLeft
				this.y =
					e.clientY +
					document.body.scrollTop +
					document.documentElement.scrollTop
			}
		},
	},
}
</script>

<style lang="postcss">
article {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: var(--app-margin);

	.nuxt-content {
		margin-bottom: 25vh;
	}
	.info {
		position: absolute;
		top: var(--app-margin);
		right: var(--app-margin);
		z-index: 10;
	}
	.previewCover {
		position: absolute;
		z-index: 5;
		max-width: 300px;
		height: auto;
		opacity: 1;

		/* transition: all 2s; */
	}
}

/* fade transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
