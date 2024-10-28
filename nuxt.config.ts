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
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-umami',
  ],

  content: {
    markdown: {},
  },

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
      '2xl': 2048,
    },
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
    '@/assets/css/variables.css',
    '@/assets/css/global.css',
  ],

  vite: {
    plugins: [
      svgLoader({}),
    ],
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2024-10-25',
})
