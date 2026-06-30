// Single source for the Directus `languages_code` value of the active locale.
// `localeProperties.value.language` is configured per locale in nuxt.config
// ('en-US' / 'it-IT'), so this matches the values stored in Directus
// translations and used in `languages_code` filters.
export function useLanguageCode() {
  const { localeProperties } = useI18n()
  return computed(() => localeProperties.value.language)
}
