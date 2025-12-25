import { useMouseInElement, useRafFn } from '@vueuse/core'

export function useFollowMe(el) {
  // const el = ref(null)
  const { elementX, elementY, elementPositionY, isOutside } = useMouseInElement(el)
  const xOffset = 40
  // const yOffset = -200 // header height
  const yOffset = -400

  const state = reactive({
    xPos: 0,
    yPos: 0,
    dX: computed(() => elementX.value - state.xPos + xOffset),
    dY: computed(() => elementPositionY.value + elementY.value - state.yPos + yOffset),
  })

  function updatePosition() {
    state.xPos += Math.floor(state.dX / 10)
    state.yPos += Math.floor(state.dY / 10)
  }

  const { pause, resume } = useRafFn(() => {
    updatePosition()
  })

  watch(isOutside, (newValue) => {
    (newValue === true)
      ? pause()
      : resume()
  })

  return {
    pause,
    resume,
    isOutside,
    ...toRefs(state),
  }
}
