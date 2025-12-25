import { createDirectus, readItem, readItems, rest } from '@directus/sdk'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const directus = createDirectus(config.public.directus.url).with(rest())

  return {
    provide: { directus, readItem, readItems },
  }
})
