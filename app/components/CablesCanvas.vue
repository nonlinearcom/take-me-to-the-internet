<template>
  <div class="cables-canvas">
    <canvas
      ref="canvas"
      tabindex="0"
    />
  </div>
</template>

<script lang="ts">
// Every export bundles its own cables runtime, and every runtime installs
// itself on the same window globals. Two exports rarely share a runtime
// version, and the ops of one break on the classes of another, so each export
// gets its own set of globals: the window is cleared before its script runs,
// what the script installed is kept, and it is put back on the window before
// its patch is built.
const RUNTIME_GLOBALS = [
  'CABLES',
  'CG',
  'CGL',
  'Ops',
  'glMatrix',
  'mat2',
  'mat2d',
  'mat3',
  'mat4',
  'quat',
  'quat2',
  'vec2',
  'vec3',
  'vec4',
]
const runtimes = new Map<string, Record<string, any>>()
// loads happen one at a time so two runtimes never share a clearing
let loading: Promise<unknown> = Promise.resolve()

async function fetchScript(url: string) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`could not load ${url}: ${response.status}`)
  return response.text()
}

// an inline classic script runs synchronously when it is appended
function runScript(code: string, url: string) {
  const el = document.createElement('script')
  el.textContent = `${code}\n//# sourceURL=${url}`
  document.head.append(el)
  el.remove()
}

function loadCablesRuntime(url: string) {
  const load = loading.then(async () => {
    const win = window as unknown as Record<string, any>
    let globals = runtimes.get(url)
    if (!globals) {
      const code = await fetchScript(url)
      // clearing, running and capturing happen in one synchronous step, so
      // nothing left over from a previous patch (a listener, a timer) can
      // find the globals missing in between
      for (const name of RUNTIME_GLOBALS)
        win[name] = undefined
      runScript(code, url)
      globals = Object.fromEntries(RUNTIME_GLOBALS.map(name => [name, win[name]]))
      runtimes.set(url, globals)
    }
    Object.assign(win, globals)
    return globals.CABLES
  })
  loading = load.catch(() => {})
  return load
}
</script>

<script lang="ts" setup>
// Runs a cables.gl export (the folder cables hands out: patch.js next to its
// assets) in a canvas, and keeps the patch's variables in sync with `variables`.
const props = defineProps({
  // folder the export lives in under /public; assets resolve relative to it
  patchDir: { type: String, required: true },
  // where patch.js sits inside patchDir — '' for current exports, 'js/' for older ones
  jsPath: { type: String, default: '' },
  // the id in cables' edit URL (also in doc.md); the runtime keys exported patches by it
  patchId: { type: String, required: true },
  // the canvas tracks either the window or the component's box
  resizeTo: { type: String as () => 'window' | 'parent', default: 'window' },
  // patch variable values; applied at load and whenever they change
  variables: { type: Object, default: () => ({}) },
  // anything else CABLES.Patch accepts; wins over the defaults above
  patchOptions: { type: Object, default: () => ({}) },
})

const dir = computed(() => props.patchDir.replace(/\/$/, ''))
const src = computed(() => `${dir.value}/${props.jsPath}patch.js`)

const canvas = ref<HTMLCanvasElement | null>(null)
let cables: any = null
let patch: any = null
let unmounted = false

// the runtime creates vars as ops init, so the initial values go in via
// config.variables and only later changes are pushed with setValue
const applied = new Map<string, unknown>()
const applyVariables = (variables: Record<string, unknown>) => {
  for (const [name, value] of Object.entries(variables)) {
    if (applied.get(name) === value)
      continue
    applied.set(name, value)
    patch?.getVar(name)?.setValue(value)
  }
}
watch(() => props.variables, applyVariables, { deep: true })

onMounted(async () => {
  const CABLES = await loadCablesRuntime(src.value)
  if (unmounted || !canvas.value)
    return
  cables = CABLES
  // the runtime only sets CABLES.exportedPatch on first load, so look the
  // patch up by id rather than trusting it
  patch = new CABLES.Patch({
    patch: CABLES.exportedPatches[props.patchId],
    prefixAssetPath: `${dir.value}/`,
    jsPath: `${dir.value}/${props.jsPath}`,
    glCanvas: canvas.value,
    glCanvasResizeToWindow: props.resizeTo === 'window',
    glCanvasResizeToParent: props.resizeTo === 'parent',
    canvas: { alpha: true, premultipliedAlpha: true },
    variables: { ...props.variables },
    ...props.patchOptions,
  })
  CABLES.patch = patch
  for (const [name, value] of Object.entries(props.variables))
    applied.set(name, value)
})

onBeforeUnmount(() => {
  unmounted = true
  if (!patch)
    return
  // the resize listener outlives the patch and would touch the removed canvas
  if (patch.cgl)
    patch.cgl.autoReSize = false
  patch.dispose()
  if (cables.patch === patch)
    cables.patch = null
  patch = null
})
</script>

<style lang="postcss">
.cables-canvas {
  inline-size: 100%;
  block-size: 100%;

  canvas {
    display: block;
    outline: 0;
  }
}
</style>
