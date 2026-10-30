import type { SitemapUrlInput } from '#sitemap/server'
import { readItems } from '@directus/sdk'

// Feeds the Directus-backed dynamic routes into @nuxtjs/sitemap
// (wired up via `sitemap.sources` in nuxt.config.ts). The filters mirror what
// each public listing page shows, so drafts never leak into the sitemap.
//
// `_i18nTransform` makes the module emit one URL per locale (/x and /it/x)
// with hreflang alternates. Translated collections only get it when every
// non-default locale has a translation, since a missing translation renders
// an empty page. Log and resources have no translations: their Italian page
// is the English content in Italian chrome, which hreflang allows.
export default defineSitemapEventHandler(async (event) => {
  const directus = useServerDirectus()

  const { locales, defaultLocale } = useRuntimeConfig(event).public.i18n
  const otherLanguages = locales
    .filter(locale => locale.code !== defaultLocale)
    .map(locale => locale.language)

  const isTranslated = (item: { translations?: { languages_code: string }[] }) =>
    otherLanguages.every(language => item.translations?.some(t => t.languages_code === language))

  const [pages, glossary, logs, resources] = await Promise.all([
    directus.request(readItems('pages', {
      filter: PUBLISHED,
      fields: [
        'slug',
        'type',
        'date_updated',
        {
          translations: ['languages_code'],
        },
      ],
      limit: -1,
    })),
    directus.request(readItems('glossary', {
      filter: PUBLISHED,
      fields: [
        'slug',
        'date_updated',
        {
          translations: ['languages_code'],
        },
      ],
      limit: -1,
    })),
    // Published only: archived log entries are listed on /log but not reachable
    directus.request(readItems('log', {
      filter: PUBLISHED,
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
    directus.request(readItems('resources', {
      filter: NOT_DRAFT,
      fields: ['slug', 'date_updated'],
      limit: -1,
    })),
  ])

  return [
    ...pages.map(page => ({
      loc: page.type === 'page'
        ? `/${page.slug}`
        : `/articles/${page.slug}`,
      lastmod: page.date_updated ?? undefined,
      _i18nTransform: isTranslated(page),
    })),
    ...glossary.map(item => ({
      loc: `/glossary/${item.slug}`,
      lastmod: item.date_updated ?? undefined,
      _i18nTransform: isTranslated(item),
    })),
    ...logs.map(log => ({
      loc: `/log/${log.slug}`,
      lastmod: log.date_updated ?? undefined,
      _i18nTransform: true,
    })),
    ...resources.map(resource => ({
      loc: `/resources/${resource.slug}`,
      lastmod: resource.date_updated ?? undefined,
      _i18nTransform: true,
    })),
  ] satisfies SitemapUrlInput[]
})
