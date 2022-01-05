<template>
	<div>
		<template v-for="item in gallery">
			<PanelGalleryVideo
				v-if="item.type == 'video'"
				:key="item.media"
				:item="item"
			/>
			<PanelGalleryImage v-else :key="item.media" :item="item" />
		</template>
	</div>
</template>

<script>
export default {
	props: {
		gallery: {
			type: Array,
			default: () => [],
		},
	},
}
</script>

<style lang="postcss"></style>
