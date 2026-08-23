import type { SitemapUrlInput } from '#sitemap/types'
import { readItems } from '@directus/sdk'

// Feeds the Directus-backed dynamic routes into @nuxtjs/sitemap
// (wired up via `sitemap.sources` in nuxt.config.ts). The filters mirror what
// each public listing page shows, so drafts never leak into the sitemap.
export default defineSitemapEventHandler(async () => {
  const directus = useServerDirectus()

  const [pages, glossary, logs, resources] = await Promise.all([
    directus.request(readItems('pages', {
      filter: { status: { _eq: 'published' } },
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
    directus.request(readItems('glossary', {
      filter: { status: { _eq: 'published' } },
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
    directus.request(readItems('log', {
      filter: { status: { _neq: 'draft' } },
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
    directus.request(readItems('resources', {
      filter: { status: { _neq: 'draft' } },
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
  ])

  return [
    ...pages.map(page => ({
      loc: STATIC_PAGE_SLUGS.includes(page.slug) ? `/${page.slug}` : `/articles/${page.slug}`,
      lastmod: page.date_updated ?? undefined,
    })),
    ...glossary.map(item => ({
      loc: `/glossary/${item.slug}`,
      lastmod: item.date_updated ?? undefined,
    })),
    ...logs.map(log => ({
      loc: `/log/${log.slug}`,
      lastmod: log.date_updated ?? undefined,
    })),
    ...resources.map(resource => ({
      loc: `/resources/${resource.slug}`,
      lastmod: resource.date_updated ?? undefined,
    })),
  ] satisfies SitemapUrlInput[]
})
