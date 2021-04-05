import { reactive, toRefs, computed } from '@vue/composition-api'
import { useMouse, useRafFn } from '@vueuse/core'


export function useMouseFollow() {
	const { x, y } = useMouse({ touch: false })

	const state = reactive({
		xPos:0,
		yPos:0,
		dX: computed(() => x.value - state.xPos),
		dY: computed(() => y.value - state.yPos),
	})


	function updatePosition(){
		// from demo = 0.000001234
		// state.xPos += state.dX / 10
		// state.yPos += state.dY / 10

		// optimization
		state.xPos += Math.floor(state.dX / 10)
		state.yPos += Math.floor(state.dY / 10)
		console.log('running')
	}

	const { pause, resume } = useRafFn(() => {
		updatePosition()
	})

	return{
		pause,
		resume,
		...toRefs(state)
	}
}