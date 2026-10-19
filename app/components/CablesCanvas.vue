<template>
  <div>
    <canvas
      :id="canvasId"
      tabindex="0"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  patchDir: {
    type: String,
    default: '/patches/cover3/patch',
  },
  canvasId: {
    type: String,
    default: 'glcanvas',
  },
  patchOptions: {
    type: Object,
    default: () => ({}),
  },
})

const src = computed(() => `${props.patchDir}/js/patch.js`)

const mergedPatchOptions = computed(() => ({
  prefixAssetPath: props.patchDir,
  jsPath: `${props.patchDir}/js/`,
  glCanvasId: props.canvasId,
  glCanvasResizeToWindow: true,
  canvas: { alpha: true, premultipliedAlpha: true },
  ...props.patchOptions,
}))

const isDark = useDark()

const { onLoaded } = useScript(src.value, {
  async: true,
  defer: true,
  use() {
    return window
  },
})

// The patch drives its own requestAnimationFrame loop, so it is torn down
// with the component; otherwise it keeps rendering behind every later page.
// The dark-mode watcher is created outside setup and must be stopped by hand.
let patch
let stopDarkWatch

onMounted(() =>
  onLoaded(() => {
    patch = new CABLES.Patch({ patch: CABLES.exportedPatch, ...mergedPatchOptions.value })
    CABLES.patch = patch

    const clearColor = patch.getVar('clearColor')
    stopDarkWatch = watch(isDark, dark => clearColor.setValue(dark ? '#222222' : '#fcfcfc'))
  }),
)

onBeforeUnmount(() => {
  stopDarkWatch?.()
  patch?.dispose()
  patch = undefined
})
</script>
