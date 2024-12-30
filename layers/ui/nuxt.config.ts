// UI layer
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({

  alias: { '@layer': resolve('./') },

  css: [
    '@layer/assets/css/preflight.css',
    '@layer/assets/css/transitions.css',
    '@layer/assets/css/variables.css',
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    'unplugin-svg-transformer/nuxt',
  ],

  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  // For layer Icons
  svgTransformer: {
    fallback: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><path d="M15.8,12H42l6.2,6v34H15.8L15.8,12z M38.2,12v10h10 M26.5,32l11,11 M37.5,32l-11,11" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    svgDir: './layers/ui/assets/icons',
    svg: {
      sizeInherit: true,
      title: true,
    },
    warning: true,
  },

})
