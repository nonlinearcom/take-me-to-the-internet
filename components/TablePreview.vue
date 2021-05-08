<template>
	<section class="table-preview">
		<AppPreview
			v-if="$device.isDesktop"
			:is-active="!isOutside"
			:cover="previewCover"
			:x-pos="xPos"
			:y-pos="yPos"
		/>
		<AppTable
			ref="table"
			:table-data="tableData"
			@getCurrentCover="setPreviewCover($event)"
			@mouseenter.native="previewIsActive = true"
			@mouseleave.native="previewIsActive = false"
		/>
	</section>
</template>

<script>

import { ref, reactive, computed } from '@vue/composition-api'
import useFollowMe from '~/composables/useFollowMe'
export default {
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
	},

	setup () {
		// we need to pass the table $ref as target
		// https://markus.oberlehner.net/blog/refs-and-the-vue-3-composition-api/
		const table = ref(null)

		return {
			table,
			...useFollowMe(table)
		}
	},

	data() {
		return {
			previewIsActive: false,
			previewCover: null,
		}
	},

	methods: {
		setPreviewCover(coverName) {
			this.previewCover = coverName
		},
	},
}
</script>

<style lang="postcss">
.table-preview {
	margin-top: 200px;
}
</style>
