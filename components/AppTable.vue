<template>
	<table>
		<tbody>
			<tr v-for="item in tableData" :key="item.createdAt">
				<th>{{ item.type }}</th>
				<th>{{ item.year }}</th>
				<th>
					<nuxt-link :to="`/${item.slug}`">{{
						item.title
					}}</nuxt-link>
				</th>
				<th>{{ item.role }}</th>
				<th>{{ item.institution }}</th>
				<th>{{ item.location }}</th>
				<th>{{ item.extra }}</th>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
	},
}
</script>

<style lang="postcss">
table {
	margin-top: auto;
	border-collapse: collapse;
	border-spacing: 0;

	tr {
		&:hover {
			cursor: pointer;
		}
		th {
			border-top: 1px solid #e5e5e5;
			font-size: 16px;
			font-weight: 400;
			text-align: left;
			line-height: 36px;
			padding: 0 16px;
		}
	}
}
</style>
