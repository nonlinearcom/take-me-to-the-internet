<template>
	<button class="color-button" :class="$colorMode.preference" @click="toogleColor()"></button>
</template>
<script>
export default {
	// data() {
	// 	return {
	// 		colors: ['light', 'dark'],
	// 	}
	// },
	methods: {
		toogleColor() {
			(this.$colorMode.preference === 'light') ? this.$colorMode.preference = 'dark' : this.$colorMode.preference = 'light'
		}
	},
}
</script>
<style lang="postcss">
.color-button{
	padding: 0;
	border: none;
	background: none;
	width:25px;
	height: 25px;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s ;

	/* background-color: var(--color); */
	border:1px solid var(--color);

	&:hover{
		background-color: var(--color);
	}

}
</style>