import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// UI layer
import { createResolver } from '@nuxt/kit'

const currentDir = dirname(fileURLToPath(import.meta.url))

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  components: {
    dirs: [
      {
        path: resolve('./app/components'),
        prefix: 'Ui',
      },
    ],
  },

  icon: {
    customCollections: [
      { prefix: 'ui', dir: join(currentDir, 'app/assets/icons') },
    ],
  },

  css: [
    '#layers/ui/app/assets/styles/preflight.css',
    '#layers/ui/app/assets/styles/transitions.css',
    '#layers/ui/app/assets/styles/variables.css',
  ],
})
