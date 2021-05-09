<template>
	<header class="app-header">
			<h1 class="header__title">Take me to the internet <br> Teaching portal of Manuel Ehrenfeld</h1>
			</h1>
			<nav class="header__navigation">
				<nuxt-link class="info" to="/manuel-ehrenfeld">Info</nuxt-link>
				<ColorButton />
			</nav>

	</header>
</template>

<script>
	export default {

	}
</script>

<style lang="postcss">
.app-header{

	display: flex;
	align-items: baseline;
	padding:  var(--app-margin-small);
	.header__title{
		margin-bottom: 0;
	}
	.header__navigation{
		margin-left: auto;
		display:flex;
		/* flex-direction: column; */
		align-items: center;
		> *{
			margin-left: 16px;
		}
	}
}

@media (max-width: 1024px) {

	.app-header {
		.header__title{
			font-size:var(--text);
		}
	}

}

@media (max-width: 540px) {
	.app-header{
		flex-direction: column;
		padding: var(--app-margin-mini);
		.header__navigation{
			position: relative;
			margin-left: 0!important;
			margin-top: var(--app-margin);
			flex-direction: column;

			> *{
				margin-left: 0;
				margin-top:8px;
			}
		}
	}


}
</style>