import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			title: 'Take me to the internet',
			link: [
				{ rel: 'icon', type: 'image/png', href: '/favicon.png' }
			],
			script: [
				{
					hid: 'umami',
					'data-website-id':'c7c20644-536c-4ba9-9a75-4b49ec150576',
					src: 'https://analytics.non-linear.com/uma.js',
					async: true,
					defer:true,
				},
			]
		},
		// pageTransition: {
		// 	name: 'fade',
		// 	mode: 'out-in'
		// },
		// layoutTransition: {
		// 	name: 'fade',
		// 	mode: 'out-in'
		// }
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
