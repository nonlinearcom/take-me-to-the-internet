<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
useHead({

	titleTemplate: titleChunk => {
		return titleChunk
			? `${titleChunk} - Take me to the internet`
			: 'Take me to the internet'
	},
	meta: [
		{ name: 'description', content: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.' },
		{ property: 'og:description', content: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.' },
		{ property: 'og:image', content: 'https://res.cloudinary.com/non-linear/image/upload/f_webp,q_auto,w_1536/take-me-to-the-internet/post-screen/2016/img_1' },
		{ name: 'twitter:card', content: `summary_large_image` }
	]
})
</script>

<style lang="postcss">
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

.modal-enter,
.modal-leave-to {
	opacity: 0;

	.panel {
		transform: translateX(100%);
	}
}
</style>
