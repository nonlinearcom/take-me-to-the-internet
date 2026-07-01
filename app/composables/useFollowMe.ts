import type { MaybeElementRef } from '@vueuse/core'
import { useMouseInElement, useRafFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export function useFollowMe(el: MaybeElementRef) {
  const { elementX, elementY, elementPositionY, isOutside } = useMouseInElement(el)
  const xOffset = 40
  const yOffset = -400

  const xPos = ref(0)
  const yPos = ref(0)
  const dX = computed(() => elementX.value - xPos.value + xOffset)
  const dY = computed(() => elementPositionY.value + elementY.value - yPos.value + yOffset)

  function updatePosition() {
    xPos.value += Math.floor(dX.value / 10)
    yPos.value += Math.floor(dY.value / 10)
  }

  // Start paused so the rAF loop only runs while the pointer is inside the
  // element; the watcher resumes it on enter and pauses on leave.
  const { pause, resume } = useRafFn(updatePosition, { immediate: false })

  watch(isOutside, (outside) => {
    if (outside)
      pause()
    else
      resume()
  })

  return {
    pause,
    resume,
    isOutside,
    xPos,
    yPos,
  }
}
