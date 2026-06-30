import { createDirectus, rest } from '@directus/sdk'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const directus = createDirectus(config.public.directus.url).with(rest())

  // readItem/readItems are stateless SDK helpers — import them directly at call
  // sites instead of injecting them. Only the configured client is provided.
  return {
    provide: { directus },
  }
})
