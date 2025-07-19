import { createDirectus, readItem, readItems, rest } from '@directus/sdk'

const directus = createDirectus('https://tmtti.non-linear.dev').with(rest())

export default defineNuxtPlugin(() => {
  return {
    provide: { directus, readItem, readItems },
  }
})
