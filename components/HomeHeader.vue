<template>
	<header class="home-header">
		<h1 class="header__title">
			Take — me — to — the — internet
			<!-- <br>
			Visual design and coding fundamentals -->
		</h1>

		<h2 class="header__subtitle title--h1" @click="toogleInfo()">
			Teaching portal <br>of Manuel Ehrenfeld
		</h2>

		<button class="expand"
			:class="{active : isActive}"
			@click="toogleInfo()">
			<svg-icon name="plus" aria-hidden="true" />
			info
		</button>

		<ColorButton />
	</header>
</template>

<script>
export default {
	data() {
		return {
			isActive: false
		}
	},
	methods: {
		toogleInfo() {

			this.$emit('expand')
			this.isActive = !this.isActive
		}
	},
}
</script>

<style lang="postcss">
.home-header {
	display: grid;
	grid-template-columns: 50% 1fr 1fr 50px;
	align-items: baseline;
	padding: var(--app-margin-small);

			position: relative;

	.header__title {
		margin-bottom: 0;
		padding-right: 16px;
	}

	.header__subtitle{
		min-width: 300px;
		/* margin-bottom: 0; */
	}

	.expand{


		display: flex;
		align-items: center;
		height: 28px;

		margin-right: auto;
		padding-left:4px;
		padding-right:12px;

		border: 1px solid var(--color);
		border-radius: 25px;

		font-size: var(--font-size-small);
		text-transform: uppercase;

		cursor: pointer;

		.icon{
			transition: transform 0.5s;
			width: 30px;
		}

		&.active .icon{
			transform: rotate(45deg);
		}
	}

	.color-button {
		margin-left: auto;
	}
}

@media (max-width: 1024px) {
	.home-header {
		grid-template-columns: 50% 1fr auto 50px;

		.header__title,
		.header__subtitle,
		.info {
			font-size: var(--text);
		}
		.header__subtitle {
			min-width: auto;
		}
		.expand {
			margin-left: auto;
			margin-right: 0;
		}

	}
}

@media (max-width: 768px) {
	.home-header {
		grid-template-columns: 1fr 1fr;
		padding: var(--app-margin-mini);

		.header__title {
			grid-column: 1 / span 2;
			grid-row: 1;
			/* line-height: 50px; */
			margin-bottom: 25px;
		}
		.header__subtitle {
			/* padding-top:var(--app-margin); */
			grid-column: 1;
			margin-bottom: 25px;
		}
		.info {
			grid-column: 1;
			grid-row: 4;
		}
		.color-button {
			grid-column: 2;
			grid-row: 1;
			transform: translate(8px,-6px);
		}
	}
}
</style>
