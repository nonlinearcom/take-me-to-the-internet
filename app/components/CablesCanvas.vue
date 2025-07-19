<template>
  <div>
    <canvas
      :id="canvasId"
      tabIndex="1"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  patchDir: {
    type: String,
    default: '/patches/cover2/patch/',
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
  console.log(`${props.patchDir} initialized`)
}

const _patchFinishedLoading = (patch) => {
  // The patch is ready now, all assets have been loaded
  console.log(`${props.patchDir} finished loading`)
}

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

    // const rootElement = getComputedStyle(document.documentElement)
    // const darkColor =  rootElement.getPropertyValue('--gray-11');
    // const lightColor = rootElement.getPropertyValue('--gray-1')

    const clearColor = CABLES.patch.getVar('clearColor')

    const isDark = useDark({
      onChanged(dark) {
        if (dark) {
          clearColor.setValue('#222222')
        } else {
          clearColor.setValue('#fcfcfc')
        }
      },
    })
  }),
)
</script>

<style></style>
