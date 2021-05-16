<template>
	<section class="table-preview">
		<AppPreview
			v-if="isLaptop && previewCover !== null"
			:is-active="!isOutside && previewIsActive"
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

import { ref } from '@vue/composition-api'
import useFollowMe from '~/composables/useFollowMe'
import{ useMyBreakpoints } from '~/composables/useMyBreakpoints'

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
		const { isLaptop } = useMyBreakpoints()
		return {
			table,
			isLaptop,
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
