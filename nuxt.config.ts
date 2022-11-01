import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			title: 'Take me to the internet',
			meta: [
				{
					name: 'description',
					content:
						'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.',
				},
				{ name: 'robots', content: 'index, follow' },
				// facebook
				{ hid: 'og:type', property: 'og:type', content: 'website' },
				{
					hid: 'og:url',
					property: 'og:url',
					content: 'https://take-me-to-the-internet.com/',
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: 'https://take-me-to-the-internet.com/img/cover.jpg',
				},

				{
					hid: 'og:title',
					property: 'og:title',
					content: 'Take me to the internet',
				},
				{
					hid: 'og:description',
					property: 'og:description',
					content:
						'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.',
				},

				// twitter
				{ name: 'twitter:card', content: 'summary_large_image' },
				{
					name: 'twitter:image',
					content:
						'https://take-me-to-the-internet.com/img/cover_test.jpg',
				},

				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: 'Take me to the internet',
				},
				{
					hid: 'twitter:description',
					name: 'twitter:description',
					content:
						'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.',
				},
			],
			link: [
				{ rel: 'icon', type: 'image/png', href: '/favicon.png' }
			]
		},
		pageTransition: {
			name: 'fade',
			mode: 'out-in'
		}
	},

	nitro: {
		prerender: {
			routes: ['/sitemap.xml']
		}
	},

	modules: [
		'@nuxt/content',
		'@nuxtjs/color-mode',
		'@nuxt/image-edge',
		'@vueuse/nuxt',
		'nuxt-umami'
	],
	content: {
		markdown: {}
	},
	image: {
		sizes: [420, 768, 1024, 1200, 2048],
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/non-linear/image/upload/',
		},
	},
	umami: {
		autoTrack: true,
		doNotTrack: false,
		cache: false,
		domains: 'take-me-to-the-internet.com',
		websiteId: 'c7c20644-536c-4ba9-9a75-4b49ec150576',
		scriptUrl: 'https://analytics.non-linear.com/uma.js',
	},

	postcss: {
		plugins: {
			'postcss-nested': {},
			autoprefixer: {},
			cssnano: {}
		}
	},
	css: [
		'@/assets/css/fonts.css',
		'@/assets/css/variables.css',
		'@/assets/css/global.css'
	],

	vite: {
		plugins: [
			svgLoader({})
		]
	}
})
