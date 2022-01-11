<template>
	<section class="home-table">
		<AppPreview
			v-if="isLaptop"
			:is-active="!isOutside"
			:cover="currentCover"
			:x-pos="xPos"
			:y-pos="yPos"
		/>
		<AppTable
			ref="table"
			:table-data="tableData"
			@showCover="getCoverUrl($event)"
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
			currentCover: null,
		}
	},

	methods: {
		getCoverUrl(url) {
			this.currentCover = url
		},
	},
}
</script>

<style lang="postcss">
.home-table {
	margin-top: 25vh;
}
</style>
