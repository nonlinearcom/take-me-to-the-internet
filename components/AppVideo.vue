<template>
	<div class="video_wrapper">
		<AppVideoControls
			:control-is-active="controlIsActive"
			:is-playing="isPlaying"
			:is-dark="item.dark"
			:mouse-coord="mouseCoord"
		/>
		<!-- TODO: poster -->
		<!-- :poster="getPoster(item.media)" -->
		<video
			:ref="item.media"
			class="responsive"
			muted
			loop
			@click="togglePlay"
			@mouseenter="controlIsActive = true"
			@mouseleave="controlIsActive = false"
		>
			<source :src="getVideo(item.media)" type="video/mp4" />
		</video>
	</div>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => {},
		},
		mouseCoord: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			isPlaying: true,
			controlIsActive: false,
		}
	},

	methods: {
		getVideo(url) {
			return this.$cloudinary('video').url(url, {})
		},
		// getPoster(url) {
		// 	return this.$cloudinary().url(url, {
		// 		effect: 'preview',
		// 		resource_type: 'video',
		// 	})
		// },

		togglePlay(e) {
			const video = e.target
			if (video.paused === true) {
				video.play()
				this.isPlaying = false
			} else {
				video.pause()
				this.isPlaying = true
			}
		},
	},
}
</script>

<style lang="postcss">
.video_wrapper {
	position: relative;
	video {
		display: block;
		cursor: none;
	}
}
</style>
