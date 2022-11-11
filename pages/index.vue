<template>
	<article class="intro ">
		<HomeHeader @expand="expand()"/>
		<HomeInfo :info="info" :expanded="expanded"/>
		<HomeTable :table-data="activities" />
		<NuxtPage />
	</article>
</template>

<script setup>
	// definePageMeta({
	// 	keepalive: true
	// })
	const { data: info }  = await useAsyncData(() => queryContent('info').findOne())
	const { data: activities } = await useAsyncData('activities', () => queryContent('activities').only([
		'title',
		'slug',
		'type',
		'role',
		'institution',
		'location',
		'offline',
		'cover',
		'dir',
		'year',
		'path',
	])
		.sort({ title: 1 })
		.sort({ year: -1 })
		.find())

	const expanded = ref(false);

	function expand() {
		expanded.value = !expanded.value
	}
useHead({
	title: 'Teaching portal of Manuel Ehrenfeld'
})
</script>

<style lang="postcss">

.bio{
	padding-left: 50%;
	padding-right: var(--app-margin-small);

	p{
		max-width: 44ch;
	}
}


article.intro {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

}

/* panel + overlay nested transitions ! */
.modal-enter-active {
	transition: opacity 0.5s ease-out 0s;

	.panel {
		transition: transform 0.5s ease-out;
	}
}

.modal-leave-active {
	transition: opacity 0.2s ease-in;

	.panel {
		transition: transform 0.2s ease-out;
	}
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;

	.panel {
		transform: translateX(100%);
	}
}
</style>
