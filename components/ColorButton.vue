<template>
	<button
		width="40"
		height="28"
		class="color-button"
		:class="$colorMode.preference"
		aria-label="color mode button"
		@click="toogleColor()"
	>
		<svg-icon name="dark" aria-hidden="true" />
	</button>
</template>
<script>
export default {
	methods: {
		toogleColor() {
			this.$colorMode.preference === 'light'
				? (this.$colorMode.preference = 'dark')
				: (this.$colorMode.preference = 'light')
		},
	},
}
</script>
<style lang="postcss">
.color-button {
	height: 40px;
	width: 40px;
	transform: translateY(-6px);
	cursor: pointer;
	transition: background-color 0.2s;
	color: var(--color);

	svg{
		height:100%;
		width:100%;
	}
}
</style>
