<template>
	<section class="home-table">

		<transition name="fade">
			<AppPreview
				v-if="!isOutside && isLaptop && currentCover !==null"
				:cover="currentCover"
				:x-pos="xPos"
				:y-pos="yPos"
			/>
		</transition>

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
		const currentCover = ref(null)
		const { isLaptop } = useMyBreakpoints()

		function getCoverUrl(url) {
			currentCover.value = url
		}

		return {
			table,
			isLaptop,
			currentCover,
			getCoverUrl,
			...useFollowMe(table)
		}
	}
}
</script>

<style lang="postcss">
.home-table {
	margin: 25vh 0 50px 0;
}
</style>
