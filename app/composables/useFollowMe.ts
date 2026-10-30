import type { MaybeElementRef } from '@vueuse/core'
import { useMouseInElement, useRafFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export function useFollowMe(el: MaybeElementRef) {
  const { elementX, elementY, elementPositionY, isOutside } = useMouseInElement(el)

  const xOffset = 40
  const yOffset = 0

  const xPos = ref(0)
  const yPos = ref(0)
  const dX = computed(() => elementX.value - xPos.value + xOffset)
  const dY = computed(() => elementPositionY.value + elementY.value - yPos.value + yOffset)

  // Ease toward the target; snap the last pixel so it settles exactly on it (flooring left it up to 10px short, always on the same side).
  function updatePosition() {
    xPos.value += Math.abs(dX.value) < 1
      ? dX.value
      : dX.value / 10
    yPos.value += Math.abs(dY.value) < 1
      ? dY.value
      : dY.value / 10
  }

  // Start paused so the rAF loop only runs while the pointer is inside the element; the watcher resumes it on enter and pauses on leave.
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
