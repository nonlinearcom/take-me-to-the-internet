import type { ProviderGetImage } from '@nuxt/image'
import directusProvider from '@nuxt/image/runtime/providers/directus'
import { useRuntimeConfig } from '#imports'

// Reuse the built-in Directus provider for all modifier/operation handling.
// The only difference: resolve `baseURL` from runtime config at request time
// instead of baking NUXT_PUBLIC_DIRECTUS_URL in at build time. This means a
// backend URL change only needs an env update + restart — no rebuild.
const { getImage: directusGetImage } = directusProvider()

const getImage: ProviderGetImage<{ baseURL?: string }> = (src, options, ctx) => {
  const baseURL = options.baseURL
    || `${useRuntimeConfig().public.directus.url.replace(/\/+$/, '')}/assets/`

  return directusGetImage(src, { ...options, baseURL } as Parameters<typeof directusGetImage>[1], ctx)
}

export default () => ({ getImage })
