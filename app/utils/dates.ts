export function formatDate(d: Date | string | undefined, options: { locale?: string } = {}) {
  if (!d)
    return undefined

  return new Date(d).toLocaleDateString(options.locale ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Directus leaves date_updated empty until an item is edited after creation
export function lastUpdated(item: { date_created: string, date_updated?: string | null }) {
  return item.date_updated ?? item.date_created
}
