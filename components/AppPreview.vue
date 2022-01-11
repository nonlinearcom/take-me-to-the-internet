<template>
	<transition name="fade">
		<nuxt-img
			v-show="showPreview"
			provider="cloudinary"
			class="previewCover"
			:src="cover"
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
			type: [String, Object],
			default: '',
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
		showPreview() {
			return !!(this.isActive && this.cover !== null)
		},
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
	margin-top: ;
}
</style>
