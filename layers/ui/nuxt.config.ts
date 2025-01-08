// UI layer
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    // 'unplugin-svg-transformer/nuxt',
  ],

  devtools: {
    enabled: true,
  },

  css: [
    '@layer/assets/css/preflight.css',
    '@layer/assets/css/transitions.css',
    '@layer/assets/css/variables.css',
  ],

  alias: {
    '@layer': resolve('./'),
  },

  typescript: {
    includeWorkspace: true,
  },

  postcss: {
    plugins: {
      'postcss-nested': {},
      'autoprefixer': {},
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
})
