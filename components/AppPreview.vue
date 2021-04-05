<template>
	<transition name="fade">
		<nuxt-img
			v-show="isActive"
			provider="cloudinary"
			class="previewCover"
			:src="preview"
			alt="alt"
			:style="{ transform: translatePosition }"
		/>
	</transition>
</template>

<script>



export default {
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		cover: {
			type: String,
			default: 'test1',
		},
		offset:{
			type: Number,
			default:0,
			required:false
		},
		xPos:{
			type:Number,
			default:0
		},
		yPos:{
			type:Number,
			default:0
		}
	},

	computed: {
		preview() {
			return `${this.cover}`
		},
		translatePosition(){
			return`translate(${this.xPos}px, ${this.yPos}px)`
		},
	},
}
</script>

<style lang="postcss">
.previewCover {
	position: absolute;
	/* transition: all 2s; */
	max-width: 600px;
	width: 400px;
	height: auto;
	z-index: 5;
	pointer-events: none;
}
</style>
