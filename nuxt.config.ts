import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({

	extends: ['github:ijkml/nuxt-umami'],
	appConfig: {
		umami: {
			host: 'https://umami-production-db3b.up.railway.app',
			id: '51130bf5-f8f9-47d7-8848-6a54f6017518',
			ignoreLocalhost: true,
		},
	},
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
			// script: [
			// 	{
			// 		hid: 'umami',
			// 		'data-website-id': 'c7c20644-536c-4ba9-9a75-4b49ec150576',
			// 		src: 'https://analytics.non-linear.com/uma.js',
			// 		async: true,
			// 		defer: true,
			// 	},
			// ]
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

	// nitro: {
	// 	prerender: {
	// 		routes: ['/sitemap.xml']
	// 	}
	// },


	modules: [
		'@nuxt/content',
		'@nuxtjs/color-mode',
		'@nuxt/image',
		'@vueuse/nuxt',
	],

	content: {
		markdown: {}
	},

	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/non-linear/image/upload/',
		},
		quality: 80,
		format: ['webp'],
		screens: {
			'xs': 320,
			'sm': 640,
			'md': 768,
			'lg': 1024,
			'xl': 1280,
			'xxl': 1536,
			'2xl': 2048
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
	},

	devtools: {
		enabled: true
	}
})
