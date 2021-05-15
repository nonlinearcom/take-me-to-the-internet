<template>
	<button class="color-button" :class="$colorMode.preference" @click="toogleColor()">
		<svg-icon name="dark" />
	</button>
</template>
<script>
export default {
	methods: {
		toogleColor() {
			(this.$colorMode.preference === 'light') ? this.$colorMode.preference = 'dark' : this.$colorMode.preference = 'light'
		}
	},
}
</script>
<style lang="postcss">
.color-button{

	/* width:50px;
	height: 50px; */
	/* border-radius: 50%; */
	cursor: pointer;
	transition: background-color 0.2s ;

	color:var(--color);
	/* border:1px solid var(--color);

	&:hover{
		background-color: var(--color);
	} */

}
</style>