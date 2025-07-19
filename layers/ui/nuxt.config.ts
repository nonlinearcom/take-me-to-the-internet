// https://github.com/nuxt/icon/issues/351#issuecomment-2633510998
import { dirname, join } from 'node:path'

import { fileURLToPath } from 'node:url'
// UI layer
import { createResolver } from '@nuxt/kit'

const currentDir = dirname(fileURLToPath(import.meta.url))

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({

  components: [
    { path: './components', prefix: 'Ui' },
  ],
  icon: {
    customCollections: [
      { prefix: 'ui', dir: join(currentDir, 'assets/icons') },
    ],
  },

  css: [
    '#layers/ui/assets/styles/preflight.css',
    '#layers/ui/assets/styles/transitions.css',
    '#layers/ui/assets/styles/variables.css',
  ],
})
