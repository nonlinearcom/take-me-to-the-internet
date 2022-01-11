<template>
		<nuxt-img
			provider="cloudinary"
			class="previewCover"
			:src="cover"
			alt="Take me to the internet"
			:style="{ transform: translatePosition }"
		/>
</template>

<script>



export default {
	props: {
		cover: {
			type: String,
			default: null,
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
		translatePosition(){
			return`translate(${this.xPos}px, ${this.yPos - 130}px)`
		},
	},
}
</script>

<style lang="postcss">
.previewCover {
	position: absolute;
	/* transition: all 2s; */
	max-height: 260px;
	width: auto;
	/* height: auto; */
	z-index: 5;
	pointer-events: none;
}
</style>
