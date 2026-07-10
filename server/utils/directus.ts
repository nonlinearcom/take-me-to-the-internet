import { createDirectus, rest } from '@directus/sdk'

// Server-side Directus REST client. Mirrors app/plugins/directus.ts for nitro
// routes, reading the URL from runtime config at request time.
export function useServerDirectus() {
  const config = useRuntimeConfig()
  return createDirectus(config.public.directus.url).with(rest())
}
