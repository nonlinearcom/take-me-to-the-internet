// Serves Directus assets from this site's own domain: /assets/<id>?width=…
// is forwarded to <directus>/assets/<id>?width=…, so the backend host never reaches the browser.
// The URL is read from runtime config at request time.
// NUXT_DIRECTUS_URL (internal) wins over NUXT_PUBLIC_DIRECTUS_URL when set.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = (config.directus.url || config.public.directus.url).replace(/\/+$/, '')
  const { search } = getRequestURL(event)
  return proxyRequest(event, `${base}/assets/${getRouterParam(event, 'path')}${search}`)
})
