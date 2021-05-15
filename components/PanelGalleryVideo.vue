<template>
	<div class="gallery-video">

		<video ref="video" class="responsive" />

		<button
			v-if="!isOutside || isMobile"
			class="followCursor"
			:class="{'mobile' : isMobile}"
			:style="moveButton"
			@click="isPlaying = !isPlaying"
		>
			<svg-icon v-if="isPlaying" name="pause"/>
			<svg-icon v-else name="play"/>
		</button>

		<!-- <span>{{ currentTime }} / {{ duration }}</span> -->
	</div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import { useMediaControls, useMouseInElement, useBreakpoints } from '@vueuse/core'

export default {
	props: {
		item: {
			type: Object,
			default: () => {},
		},
	},

	setup (props) {
		const video = ref()
		const videoSrc = computed(() => 'https://res.cloudinary.com/non-linear/video/upload/v1/' + props.item.media)

		const breakpoints = useBreakpoints({
			mobile: 768,
			// tablet: 1024,
			// laptop: 1200,
			// desktop: 1280,
			// desktopL: 1440,
			// desktopXL: 1600,
		})

		const isMobile = breakpoints.smaller('mobile')

		const moveButton = computed(() => {
			return (isMobile.value)
				? ''
				: `transform: translate(${elementX.value - 25}px, ${elementY.value - 25}px)`
		})

		// TODO: add Scrubber & poster
		// https://github.com/vueuse/vueuse/blob/main/packages/core/useMediaControls/demo.vue
		// poster: 'https://bitmovin.com/wp-content/uploads/2016/06/sintel-poster.jpg',

		const { playing, currentTime, duration } = useMediaControls(video, {
			src: videoSrc,
		})

		const { elementX, elementY, isOutside } = useMouseInElement(video)

		return {
			video,
			isPlaying:	playing,
			// currentTime,
			// duration,
			elementX ,
			elementY,
			isOutside,
			moveButton,
			isMobile
		}
	},
}
</script>

<style lang="postcss">
.gallery-video {
	position: relative;

	video {
		display: block;

	}

	.followCursor{
		width: 50px;
		height: 50px;
		padding: 12px;
		text-align: center;
		position: absolute;
		top:0;
		left:0;
		color: var(--color);
		background-color: var(--bg);
		border-radius: 50%;
		cursor: none;

		svg{
			width:100%;
			height:100%;
		}

		&.mobile{
			top:auto;
			bottom:0;
			border-radius: 0;
			cursor: pointer;
		}
	}
}
</style>
