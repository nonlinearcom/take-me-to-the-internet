export default {
	mode: 'universal',
	target: 'static',
	components: true,
	/*
	 ** Headers of the page
	 */
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || '',
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
				content:
					'Take me to the internet | Teaching portal of Manuel Ehrenfeld',
			},
			{
				hid: 'og:description',
				property: 'og:description',
				content: process.env.npm_package_description || '',
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
				content:
					'Take me to the internet | Teaching portal of Manuel Ehrenfeld',
			},
			{
				hid: 'twitter:description',
				name: 'twitter:description',
				content: process.env.npm_package_description || '',
			},
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },
	/*
	 ** Global CSS
	 */
	css: [
		'assets/css/variables.css',
		'assets/css/global.css',
		// 'plyr/dist/plyr.css',
	],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		// '~/plugins/vue-observe-visibility.client.js',
		// '~/plugins/plyr.client.js'
	],

	buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/google-analytics'],

	modules: [
		'@nuxt/content',
		'@nuxtjs/cloudinary',
		'nuxt-webfontloader',
		'@nuxtjs/device',
	],

	googleAnalytics: {
		id: 'UA-304654-50',
	},
	cloudinary: {
		cloudName: 'non-linear',
		/* all other options */
	},
	webfontloader: {
		webfontloader: {
			google: {
				families: ['Inter:200,400,700&display=swap'],
			},
		},
	},

	/*
	 ** Build configuration
	 */
	build: {
		analyze: false,
		extractCSS: false,
		optimization: {
			splitChunks: {
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.(css|vue)$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		postcss: {
			// parser: require('postcss-comment'),
			plugins: {
				'postcss-import': {},
				'postcss-url': {},
				'postcss-nested': {},
			},
			preset: {
				stage: 0,
				importFrom: './assets/css/variables.css',
				autoprefixer: {
					// TODO: check fixes for warnings when grid: true,
					grid: false,
				},
			},
		},

		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {},
	},
}
