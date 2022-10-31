export default function useFollowMe(el) {
	// const el = ref(null)
	const { elementX, elementY, isOutside } = useMouseInElement(el)
	const xOffset = 60
	const yOffset = 0
	const state = reactive({
		xPos:0,
		yPos:0,
		dX: computed(() => elementX.value - state.xPos + xOffset),
		dY: computed(() => elementY.value - state.yPos + yOffset),
	})


	function updatePosition(){
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