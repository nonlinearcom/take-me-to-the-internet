export function formatDate(d: Date | string | undefined, options: { locale?: string } = {}) {
  if (!d)
    return undefined

  return new Date(d).toLocaleDateString(options.locale ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
