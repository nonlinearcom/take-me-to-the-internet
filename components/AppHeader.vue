<template>
	<header class="app-header">
		<h1 class="header__title">Take — me — to — the — internet</h1>
		<!-- <h1 class="header__title">TMTTI</h1> -->

		<h2 class="header__subtitle title--h1">Teaching portal <span>of Manuel Ehrenfeld</span></h2>
		<nuxt-link class="info title--h1" to="/manuel-ehrenfeld">About</nuxt-link>
		<ColorButton />

	</header>
</template>

<script>
	export default {

	}
</script>

<style lang="postcss">
.app-header{
	position: relative;
	display: grid;
	grid-template-columns: 6fr 3fr 3fr;
	align-items: baseline;
	padding:  var(--app-margin-small);

	.header__title{
		margin-bottom: 0;
		padding-right: 16px;
	}

	.header__subtitle{
		margin-bottom: 16px;
		span{
			white-space: nowrap;
			padding-right: 16px;
		}
	}

	.color-button{
		position: absolute;
		right:var(--app-margin-small);
		top:var(--app-margin-mini);
		height: 50px;
	}

}

@media (max-width: 1024px) {

	.app-header {
		grid-template-columns: 2fr 1fr;

		.header__title,.header__subtitle, .info{
			font-size:var(--text);
		}
		.header__subtitle{
			grid-column: 2;
		}
		.info{
			grid-column: 2;
			grid-row: 3;
		}
	}

}

@media (max-width: 768px) {
	.app-header{
		grid-template-columns: 1fr 1fr;
		padding: var(--app-margin-mini);

		.header__title{
			grid-column: 1 / span 2;
			/* line-height: 50px; */
			margin-bottom: 25px;
		}
		.header__subtitle{
			/* padding-top:var(--app-margin); */
			grid-column: 1;
			margin-bottom: 25px;
		}
		.info{
			grid-column: 1;
			grid-row: 4;
		}
		.color-button{
			grid-column: 1;
			grid-row: 1;
			position: relative;
			text-align: left;
			left:-8px;
			top:0px;
			height: 40px;
			margin-bottom: 25px;

		}

	}


}
</style>