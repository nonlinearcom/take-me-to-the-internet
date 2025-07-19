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

    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    'nuxt-swiper',
    'nuxt-umami',
    'reka-ui/nuxt',
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

  runtimeConfig: {
    public: {
      directus: {
        url: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      },
    },
  },

  umami: {
    host: 'https://analytics.non-linear.dev',
    id: '51130bf5-f8f9-47d7-8848-6a54f6017518',
    domains: ['www.take-me-to-the-internet.com'],
    ignoreLocalhost: true,
    // version: 2,
  },

  css: [
    '@/assets/styles/fonts.css',
    '@/assets/styles/global.css',
  ],

  compatibilityDate: '2024-10-25',

  icon: {
    clientBundle: {
      includeCustomCollections: true,
      scan: true,
    },
    size: '24px',
    mode: 'svg',
    customCollections: [
      { prefix: 'app', dir: './app/assets/icons' },
    ],
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
        // ...
      },
    },
  },
})
