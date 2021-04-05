import { ref, reactive, toRefs, computed, watch } from '@vue/composition-api'
import { useMouseInElement, useRafFn } from '@vueuse/core'


export function useFollowMe(el) {
	// const el = ref(null)
	const { elementX, elementY, isOutside } = useMouseInElement(el)

	const state = reactive({
		xPos:0,
		yPos:0,
		dX: computed(() => elementX.value - state.xPos),
		dY: computed(() => elementY.value - state.yPos),
	})


	function updatePosition(){
		// from demo = 0.000001234
		// state.xPos += state.dX / 10
		// state.yPos += state.dY / 10

		// optimization
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
		...toRefs(state)
	}
}