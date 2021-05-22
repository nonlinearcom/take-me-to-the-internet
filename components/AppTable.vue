<template>
	<table>
		<tbody role="presentation">
			<tr
				v-for="(item, index) in tableData"
				:key="item.createdAt"
				:class="{ offline: item.offline }"
				tabindex="0"
				role="row"
				:aria-disabled="item.offline"
				@click="goToPanel(item.slug)"
				@mouseover="getCover(item.cover)"
			>
				<td
					class="year"
					:class="{ visible: dateCheck(item.year, index) }"
				>
					{{ item.year }}
				</td>
				<td class="type">{{ item.type }}</td>
				<td class="title">
					<h3 v-if="item.offline">{{ item.title }}</h3>
					<nuxt-link v-else :to="`/${item.slug}`">{{
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
		getCover(cover) {
			this.$emit('getCurrentCover', cover)
		},
		getYear(index) {
			return this.tableData[index].year
		},
		dateCheck(year, index) {
			const prevIndex = index - 1

			// display first by default
			if (prevIndex === -1) {
				return true
			}

			if (year === this.getYear(prevIndex)) {
				return false
			} else return true
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
		/* border-top: 1px solid var(--border-color); */

		&:last-child {
			border-bottom: 1px solid var(--border-color);
		}
		&:hover {
			cursor: pointer;
		}
		&.offline {
			cursor: deafult;
			pointer-events: none;
			color: #888;
		}
		&:focus {
			/* background-color: red; */
		}
		td {
			font-size: var(--text-small);
			font-weight: 400;
			text-align: left;
			vertical-align: top;
			line-height: 1.4;
			padding: 8px 16px;
			border-top: 1px solid var(--border-color);
			&:first-child {
				padding-left: 0;
			}
			&:last-child {
				padding-right: 0;
			}

			&.year {
				border-top: none;
				opacity: 0;
			}
			&.year.visible {
				border-top: 1px solid var(--border-color);
				opacity: 1;
			}

			h3 {
				margin-bottom: 0;
			}
		}
	}
}

@media (max-width: 1024px) {
	table .location {
		display: none;
	}
}

@media (max-width: 900px) {
	table .role {
		display: none;
	}
}

@media (max-width: 640px) {
	table .type {
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
	table .year {
		flex: 0 1 60px;
		padding-top: 8px;
	}
	table .title {
		border-top: 1px solid var(--border-color);
		flex-basis: calc(100% - 60px);
		padding-top: 8px;
	}

	table .location {
		display: none;
	}

	table .institution {
		margin-left: 60px;
		padding-bottom: 8px;
		/* display: none; */
	}
}
</style>
