<template>
	<table>
		<tbody>
			<tr
				v-for="item in tableData"
				:key="item.createdAt"
				:class="{ offline: item.offline }"
				@click="goToPanel(item.slug)"
			>
				<td class="year">{{ item.year }}</td>
				<td class="type">{{ item.type }}</td>
				<td class="title">
					<nuxt-link :to="`/${item.slug}`">{{
						item.title
					}}</nuxt-link>
				</td>
				<td class="role">{{ item.role }}</td>
				<td class="institution">{{ item.institution }}</td>
				<td class="location">{{ item.location }}</td>
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
	methods: {
		goToPanel(slug) {
			this.$router.push({ path: slug })
		},
	},
}
</script>

<style lang="postcss">
table {
	margin-top: auto;
	border-collapse: collapse;
	border-spacing: 0;
	width: 100%;
	tr {
		border-top: 1px solid #e5e5e5;
		&:last-child {
			border-bottom: 1px solid #e5e5e5;
		}
		&:hover {
			cursor: pointer;
		}
		&.offline {
			cursor: normal;
			pointer-events: none;
			color: #888;
		}
		td {
			font-size: var(--font-size-small);
			font-weight: 400;
			text-align: left;
			vertical-align: top;
			line-height: 1.4;
			padding: 8px 16px;

			&:first-child {
				padding-left: 0;
			}
			&:last-child {
				padding-right: 0;
			}
		}
	}
}

@media (max-width: 1024px) {
	.location {
		display: none;
	}
}

@media (max-width: 900px) {
	.role {
		display: none;
	}
}

@media (max-width: 640px) {
	.type {
		display: none;
	}
}

@media (max-width: 540px) {
	table tr {
		border-top: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		td {
			border-top: none;
			position: relative;
			padding: 0;
		}
	}
	.year {
		border-top: 1px solid #e5e5e5;
		flex: 0 1 70px;
		padding-top: 8px;
	}
	.title {
		border-top: 1px solid #e5e5e5;
		flex-basis: calc(100% - 70px);
		padding-top: 8px;
	}

	.location {
		display: none;
	}

	.institution {
		margin-left: 70px;
		padding-bottom: 8px;
		/* display: none; */
	}
}
</style>
