import type { MaybeElementRef } from '@vueuse/core'

// Shared cursor-following cover-preview wiring used by the log and resources
// tables: owns the current cover + its setter and the useFollowMe position.
// The caller still owns its own table template ref and its own useApp() flag.
export function useCoverPreview(tableRef: MaybeElementRef) {
  const currentCover = ref<string | null>(null)
  const { isOutside, xPos, yPos } = useFollowMe(tableRef)

  function setCover(url?: string) {
    currentCover.value = url ?? null
  }

  return { currentCover, setCover, isOutside, xPos, yPos }
}
