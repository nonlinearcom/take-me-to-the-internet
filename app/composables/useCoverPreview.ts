import type { MaybeElementRef } from '@vueuse/core'

// Shared cursor-following cover-preview wiring used by the log and resources
// tables: owns the current cover, its setter, the useFollowMe position and
// the visibility rule. The caller still owns its table template ref.
export function useCoverPreview(tableRef: MaybeElementRef) {
  const { isLargeScreen } = useApp()
  const currentCover = ref<string | null>(null)
  const { isOutside, xPos, yPos } = useFollowMe(tableRef)

  function setCover(url?: string) {
    currentCover.value = url ?? null
  }

  const visible = computed(() => !isOutside.value && isLargeScreen.value && currentCover.value !== null)

  return { currentCover, setCover, visible, xPos, yPos }
}
