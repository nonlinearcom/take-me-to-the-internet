export default defineNuxtConfig({
  extends: [
    './layers/flexible-editor',
    // ['github:nonlinearcom/non-linear-ui', { install: true, auth: process.env.GITHUB_TOKEN }],
    ['./layers/ui', { install: true }],
  ],

  experimental: {
    localLayerAliases: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      title: 'Take me to the internet',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },

    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-umami',
  ],

  i18n: {
    baseUrl: process.env.NUXT_BASE_URL,
    strategy: 'no_prefix', // 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      fallbackLocale: 'en',
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    langDir: 'locales/',
    lazy: true,
    locales: [
      { code: 'en', file: 'en-US.json', language: 'en-US', name: 'English' },
      { code: 'it', file: 'it-IT.json', language: 'it-IT', name: 'Italiano' },
    ],
  },

  image: {
    directus: {
      baseURL: `${process.env.NUXT_PUBLIC_DIRECTUS_URL}/assets/`,
      modifiers: { withoutEnlargement: 'true' },
    },
    quality: 80,
    format: ['webp'],
    sizes: 'xs:320 sm:640 md:768 lg:1024 xl:1280 xxl:1920',
    provider: 'directus',
  },

  umami: {
    host: 'https://analytics.non-linear.dev',
    id: '51130bf5-f8f9-47d7-8848-6a54f6017518',
    domains: ['www.take-me-to-the-internet.com'],
    ignoreLocalhost: true,
  //  version: 2,
  },

  postcss: {
    plugins: {
      'postcss-nested': {},
      'autoprefixer': {},
      'cssnano': {},
    },
  },

  css: [
    '@/assets/css/fonts.css',
    '@/assets/css/global.css',
  ],

  devtools: {
    enabled: true,
  },

  // How to use icons form local assets?
  // svgTransformer: {
  //   fallback: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><path d="M15.8,12H42l6.2,6v34H15.8L15.8,12z M38.2,12v10h10 M26.5,32l11,11 M37.5,32l-11,11" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  //   svgDir: './assets/icons',
  //   svg: {
  //     sizeInherit: true,
  //     title: true,
  //   },
  //   warning: true,
  // },

  compatibilityDate: '2024-10-25',
})
