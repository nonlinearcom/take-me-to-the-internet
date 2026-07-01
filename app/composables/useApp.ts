import { createSharedComposable, useMediaQuery } from '@vueuse/core'

// Shared so the three matchMedia listeners are created once and reused across
// all consumers instead of one fresh set per call site.
export const useApp = createSharedComposable(() => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)', { ssrWidth: 1024 })
  const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1024px)', { ssrWidth: 768 })
  const isSmallScreen = useMediaQuery('(max-width: 768px)', { ssrWidth: 768 })

  return {
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
  }
})
