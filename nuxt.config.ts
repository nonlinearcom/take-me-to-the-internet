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
        // Preload fonts
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Inter-Light.woff2?v=4.1', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Inter-Medium.woff2?v=4.1', crossorigin: '' },
      ],
    },

    pageTransition: { name: 'page', mode: 'out-in' },
  },

  routeRules: {
    // Fonts are cache-busted via the ?v= query param, so they can be immutable
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    'nuxt-umami',
    'reka-ui/nuxt',
  ],

  site: {
    // Runtime-overridable via NUXT_PUBLIC_SITE_URL / NUXT_PUBLIC_SITE_ENV
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'Take me to the internet',
    description: 'Teaching portal of Manuel Ehrenfeld, designer & developer based in Geneva.',
    defaultLocale: 'en',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    disallow: ['/api/'],
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Manuel Ehrenfeld',
      jobTitle: 'Designer & Developer',
      url: 'https://www.take-me-to-the-internet.com',
    },
  },

  ogImage: {
    // A static og:image is set globally in app.vue; the generator would need
    // the satori/resvg runtime dependencies.
    enabled: false,
  },

  i18n: {
    // No baseUrl here: nuxt-site-config feeds site.url into i18n at runtime.
    // Setting it would bake the build-time value in and break the
    // NUXT_PUBLIC_SITE_URL runtime override.
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
    // Custom provider so the Directus asset baseURL is read from runtime config
    // at request time (see app/providers/directus-runtime.ts), not baked in at
    // build time. Changing NUXT_PUBLIC_DIRECTUS_URL no longer requires a rebuild.
    provider: 'directusRuntime',
    providers: {
      directusRuntime: {
        provider: '~/providers/directus-runtime',
        options: {
          modifiers: { withoutEnlargement: true },
        },
      },
    },
    quality: 80,
    format: ['webp'],
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
    domains: ['take-me-to-the-internet.com', 'tmtti.com'],
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

})
