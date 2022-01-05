<template>
	<section class="header-info">

		<TransitionExpand>
			<nuxt-content v-if="expanded" :document="info" />
		</TransitionExpand>

	</section>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: ()=>{}
			},
			expanded: {
				type: Boolean,
				default: false
			},
		}
	}
</script>

<style lang="postcss">

.header-info {

	padding-left: calc(50% + 30px);
	padding-right: var(--app-margin);

	.nuxt-content {
		max-width: 45ch;
		padding-top: var(--app-margin);
	}
}
@media (max-width: 1024px) {
	.header-info {
		padding-left: calc(50% + 20px);
	}
}
@media (max-width: 768px) {
	.header-info {

		padding:var(--app-margin-mini);

		.nuxt-content {
			max-width: auto;
		}
	}
}
</style>