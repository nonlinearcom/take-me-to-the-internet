import { createDirectus, rest } from '@directus/sdk'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Server: internal Docker URL (fast, never leaves the VPS).
  // Browser: public URL. Falls back to public if NUXT_DIRECTUS_URL isn't set.
  const url = import.meta.server
    ? config.directus.url || config.public.directus.url
    : config.public.directus.url

  const directus = createDirectus(url).with(rest())

  // readItem/readItems are stateless SDK helpers — import them directly at call
  // sites instead of injecting them. Only the configured client is provided.
  return {
    provide: { directus },
  }
})
