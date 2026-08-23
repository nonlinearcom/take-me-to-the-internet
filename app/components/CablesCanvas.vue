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
    default: () => { },
  },
})

const src = computed(() => `${props.patchDir}/js/patch.js`)

const mergedPatchOptions = computed(() => {
  const defaultOptions = {
    prefixAssetPath: props.patchDir,
    jsPath: `${props.patchDir}/js/`,
    glCanvasId: props.canvasId,
    glCanvasResizeToWindow: true,
    canvas: { alpha: true, premultipliedAlpha: true },
  }
  return { ...defaultOptions, ...props.patchOptions }
})

const _patchInitialized = (patch) => {
  // You can now access the patch object (patch), register variable watchers and so on
}

const _patchFinishedLoading = (patch) => {
  // The patch is ready now, all assets have been loaded
}

const isDark = useDark()

const { onLoaded } = useScript(src.value, {
  async: true,
  defer: true,
  use() {
    return window
  },
})

onMounted(() =>
  onLoaded(() => {
    const patchOptions = mergedPatchOptions.value
    if (!patchOptions.patch)
      patchOptions.patch = CABLES.exportedPatch
    if (!patchOptions.onPatchLoaded)
      patchOptions.onPatchLoaded = _patchInitialized
    if (!patchOptions.onFinishedLoading)
      patchOptions.onFinishedLoading = _patchFinishedLoading
    CABLES.patch = new CABLES.Patch(patchOptions)

    const clearColor = CABLES.patch.getVar('clearColor')

    watch(isDark, dark => clearColor.setValue(dark ? '#222222' : '#fcfcfc'))
  }),
)
</script>

<style></style>
