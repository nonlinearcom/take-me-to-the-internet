export default {
	target: 'static',
	components: true,
	/*
	 ** Headers of the page
	 */
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		title: process.env.npm_package_name || 'Take me to the internet',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
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
		link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
	},

	loading: { color: '#fff' },

	css: ['assets/css/variables.css', 'assets/css/global.css'],

	plugins: ['~/plugins/vue-observe-visibility.client.js'],

	buildModules: [
		'@nuxt/postcss8',
		'@nuxt/image',
		'@nuxtjs/eslint-module',
		'@nuxtjs/composition-api/module',
		'@nuxtjs/color-mode',
		'@nuxtjs/svg-sprite',
	],

	modules: ['@nuxt/content', 'nuxt-webfontloader'],

	image: {
		sizes: [420, 768, 1024, 1200, 2048],
		// intersectOptions: {
		// 	rootMargin: '50px',
		// },
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/non-linear/image/upload/',
		},
	},
	// cloudinary: {
	// 	cloudName: 	process.env.CLOUDINARY_NAME,  // 'non-linear',
	// 	api_key: 	process.env.CLOUDINARY_API_KEY, // '331859946444422'
	// 	api_secret: process.env.CLOUDINARY_API_SECRET // 'MmCfq0eIphktvVU6K3LpEctdP-0'
	// },
	webfontloader: {
		webfontloader: {
			google: {
				families: ['Inter:200,400,700&display=swap'],
			},
		},
	},

	build: {
		postcss: {
			plugins: {
				'postcss-nested': {},
			},
			preset: {
				features: {
					'custom-media-queries': true,
				},
				importFrom: ['./assets/css/variables.css'],
				autoprefixer: {
					grid: true,
				},
			},
		},

		analyze: false,
		extractCSS: true,
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

		extend(config, ctx) {},
	},
}
