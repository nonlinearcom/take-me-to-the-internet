const createSitemapRoutes = async () => {
	const { $content } = require('@nuxt/content')
	const posts = await $content({ deep: true }).where({ offline: {$eq: false}}).only(['slug', 'active']).fetch();
	return posts.map((post)=>(post.path === '/index' ? '/' : post.slug))
}

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
		link: [
			{ rel: 'icon', type: 'image/png', href: '/favicon.png' }
		],
		script: [
			{
				hid: 'umami',
				'data-website-id':'c7c20644-536c-4ba9-9a75-4b49ec150576',
				src: 'https://umami-production-def7.up.railway.app/umami.js',
				defer: true,
			},
		]
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

	modules: ['@nuxt/content', 'nuxt-webfontloader', '@nuxtjs/sitemap'],

	image: {
		sizes: [420, 768, 1024, 1200, 2048],
		// intersectOptions: {
		// 	rootMargin: '50px',
		// },
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/non-linear/image/upload/',
		},
	},

	webfontloader: {
		webfontloader: {
			google: {
				families: ['Inter:400&display=swap'],
			},
		},
	},

	colorMode: {
		preference: 'dark',
	},

	sitemap: {
		hostname: 'https://take-me-to-the-internet.com',
		gzip:  true,
		routes: createSitemapRoutes
	},

	// this is working
	// https://github.com/nuxt/content/issues/398

	// content: {
	// 	markdown: {
	// 		remarkExternalLinks: {
	// 			content: {
	// 			  type: "element",
	// 			  tagName: "icon-external-link",
	// 			},
	// 		},
	// 	},
    // },

	build: {
		standalone: true,
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
	},
}
