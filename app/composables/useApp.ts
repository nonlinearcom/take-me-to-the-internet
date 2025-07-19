import { useMediaQuery } from '@vueuse/core'

export const useApp = () => {
  // Media query reactive variables (local to the composable)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)', { ssrWidth: 1024 })
  const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1024px)', { ssrWidth: 768 })
  const isSmallScreen = useMediaQuery('(max-width: 768px)', { ssrWidth: 768 })

  return {
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
  }
}
