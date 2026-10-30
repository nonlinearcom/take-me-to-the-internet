// `pages` collection types served at /articles/:slug; every other page
// (type 'page') is a standalone page served at /:slug.
export const ARTICLE_TYPES = ['note', 'tutorial']

// Directus status filters shared by the listing pages, the detail routes,
// search and the sitemap, so what counts as public is decided once.
export const PUBLISHED = {
  status: { _eq: 'published' },
}
export const NOT_DRAFT = {
  status: { _neq: 'draft' },
}
