export default defineNuxtConfig({

  app: {
    head: {
      charset: 'utf-8',
      title: 'Take me to the internet',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Inter-Light.woff2?v=4.2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Inter-Medium.woff2?v=4.2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/IBMPlexMono-Regular.woff2?v=4.2', crossorigin: '' },
      ],
    },

    pageTransition: { name: 'page', mode: 'out-in' },
  },

  routeRules: {
    // Pages: an hour at the Cloudflare edge (its cache rule respects origin headers), served stale while it refetches.
    // No max-age, so browsers always come back to the edge. More specific rules below and Nuxt's own /_nuxt/** rules override this one.
    '/**': { headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    '/api/**': { headers: { 'cache-control': 'no-store' } },
    // Fonts are cache-busted via the ?v= query param, so they can be immutable
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Cables exports: one month, they land in fresh cover dirs
    '/patches/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
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
    // A static og:image is set globally in app.vue; the generator would need the satori/resvg runtime dependencies.
    enabled: false,
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    // detectBrowserLanguage: {
    //   fallbackLocale: 'en',
    //   useCookie: false, // required for Cloudflare catching to work.
    //   cookieKey: 'i18n_redirected', // ignored because useCookie is false
    //   redirectOn: 'root',
    // },
    detectBrowserLanguage: false, // we will cache the homepage too
    experimental: {
      // i18n emits <html lang>, hreflang alternates, canonical and og:url
      // itself; unhead dedupes them against nuxt-seo-utils' tags
      strictSeo: true,
    },
    locales: [
      { code: 'en', file: 'en-US.json', language: 'en-US', name: 'English' },
      { code: 'it', file: 'it-IT.json', language: 'it-IT', name: 'Italiano' },
    ],
  },

  image: {
    // Images are served from this site's own domain: /assets/** is proxied to
    // Directus by server/routes/assets/[...path].ts, which reads the backend
    // URL from runtime config. The provider itself needs no host at all.
    provider: 'directus',
    directus: {
      baseURL: '/assets/',
      modifiers: { withoutEnlargement: true },
    },
    quality: 80,
    format: ['webp'],
  },

  runtimeConfig: {
    directus: {
      url: '', // server-side only, filled at runtime by NUXT_DIRECTUS_URL
    },
    public: {
      directus: {
        url: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      },
      i18n: {
        // Absolute base for the hreflang/canonical tags i18n emits (strictSeo).
        // i18n only reads this key, never site.url, so the site URL is baked in
        // at build time. Should a deploy ever need a different value at runtime,
        // NUXT_PUBLIC_I18N_BASE_URL overrides it.
        baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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

  build: {
    transpile: ['@blossom-carousel/vue'],
  },

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
