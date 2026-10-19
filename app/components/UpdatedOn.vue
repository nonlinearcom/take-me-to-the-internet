<template>
  <time
    class="updated-on"
    :datetime="date.slice(0, 10)"
  >
    {{ relative ? t('updated', { time: label }) : t('updatedOn', { date: label }) }}
  </time>
</template>

<script lang="ts" setup>
const props = defineProps<{
  // ISO timestamp, see lastUpdated()
  date: string
  // "3 days ago" instead of the calendar date
  relative?: boolean
}>()

const { t, locale } = useI18n()
const languageCode = useLanguageCode()

// formatTimeAgoIntl over useTimeAgoIntl: the composable's locale option is not reactive, and the label doesn't need live ticking during a visit
const label = computed(() => props.relative
  ? formatTimeAgoIntl(new Date(props.date), { locale: locale.value })
  : formatDate(props.date, { locale: languageCode.value }))
</script>

<style lang="postcss">
.updated-on {
  display: block;
  font-family: var(--font-stack-mono);
  color: var(--text-secondary);
  font-size: var(--text-mini);
  text-transform: uppercase;
  margin-block-start: 8px;
}
</style>
