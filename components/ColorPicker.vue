<template>
	<div>
		<ul>
			<li
				v-for="color of colors"
				:key="color"
				@click="$colorMode.preference = color"
			>        {{color}}
</li>
		</ul>
	</div>
</template>
<script>
export default {
	data() {
		return {
			colors: ['light', 'dark'],
		}
	},
}
</script>