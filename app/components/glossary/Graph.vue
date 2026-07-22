<template>
  <div
    ref="container"
    class="glossary-graph"
  >
    <svg
      v-if="ready"
      :viewBox="`0 0 ${width} ${height}`"
      role="group"
      :aria-label="t('glossaryGraph')"
    >
      <path
        v-for="edge in renderEdges"
        :key="edge.key"
        class="edge"
        :class="{
          active: activeId !== null && (edge.source.id === activeId || edge.target.id === activeId),
          dimmed: activeId !== null && edge.source.id !== activeId && edge.target.id !== activeId,
        }"
        :d="edgePath(edge)"
      />
      <NuxtLink
        v-for="node in renderNodes"
        :key="node.id"
        class="node"
        :class="{
          current: node.slug === currentSlug,
          dimmed: isDimmed(node),
        }"
        :to="`/glossary/${node.slug}`"
        :aria-current="node.slug === currentSlug ? 'page' : undefined"
        @mouseenter="hoverId = node.id"
        @mouseleave="hoverId = null"
        @focus="hoverId = node.id"
        @blur="hoverId = null"
      >
        <text
          :x="node.x"
          :y="node.y"
          dy="0.35em"
          text-anchor="middle"
        >
          {{ labels.get(node.id) ?? node.slug }}
        </text>
      </NuxtLink>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'

// Structural subset of GlossaryItem: defineProps can't resolve the global declarations from app/types, so the shape is repeated here.
interface GraphSourceItem {
  id: number
  slug: string
  translations: { languages_code: string, term: string }[]
  related_terms?: { related_glossary_id: number }[]
}

interface SimNode extends SimulationNodeDatum {
  id: number
  slug: string
  x: number
  y: number
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode
  target: SimNode
  key: string
  seed: number
}

const props = defineProps<{
  items: GraphSourceItem[]
  currentSlug?: string
}>()

// ---- layout tuning ----
// Distances (LINK_DISTANCE, REPULSION, REPULSION_RANGE) are for the
// SPREAD_BASELINE canvas and scale with min(width, height) / baseline,
// so the graph fills the available space on any screen.
const SPREAD_BASELINE = 480
// Connected nodes: spring rest length + how rigidly it is enforced (0..1).
const LINK_DISTANCE = 260
const LINK_STRENGTH = 0.4
// Spread: node-node repulsion (more negative = wider graph) and the range
// beyond which nodes stop repelling each other.
const REPULSION = -240
const REPULSION_RANGE = 250
// Pull toward the center — the counterweight to repulsion; also keeps isolated nodes near the cluster. Raise for a tighter graph.
const CENTER_PULL_X = 0.1
const CENTER_PULL_Y = 0.3
// Hard minimum gap between any two node centers = sum of their collide radii (base + per-label-character, capped).
const COLLIDE_BASE = 42
const COLLIDE_PER_CHAR = 3
const COLLIDE_MAX = 70

// ---- edge look ----
// Hand-drawn wobble: distance between wobble points (smaller = wigglier),
// jitter amplitude in px, and max bow as a fraction of edge length (each
// edge bows a seeded amount to its own side).
const EDGE_SEGMENT = 35
const EDGE_WOBBLE = 4
const EDGE_BOW = 0.12

const { t, locale } = useI18n()

// Layout survives the per-slug page remount, so prev/next navigation re-settles gently instead of re-scrambling the whole graph.
const savedPositions = useState<Record<number, { x: number, y: number }>>('glossary-graph-positions', () => ({}))

const container = useTemplateRef('container')
// The container's size is owned by CSS (see .glossary-graph); the
// simulation and viewBox just follow the measured box.
const { width, height } = useElementSize(container)

const reducedMotion = usePreferredReducedMotion()

const ready = ref(false)
const hoverId = ref<number | null>(null)

// The current page's node acts as the default selection: hovering another
// node takes over, and the highlight falls back when the pointer leaves.
const currentId = computed(() => props.items.find(item => item.slug === props.currentSlug)?.id ?? null)
const activeId = computed(() => hoverId.value ?? currentId.value)

// d3 mutates node x/y in place, so triggerRef() is the only reliable
// re-render signal: since Vue 3.4 a computed that re-evaluates to the
// same reference does not notify its subscribers.
const renderNodes = shallowRef<SimNode[]>([])
const renderEdges = shallowRef<SimLink[]>([])

let simulation: ReturnType<typeof forceSimulation<SimNode, SimLink>> | null = null
let adjacency = new Map<number, Set<number>>()
let lastWidth = 0
let lastHeight = 0

const labels = computed(() => {
  const map = new Map<number, string>()
  for (const item of props.items) {
    const translation = item.translations?.find(tr => tr.languages_code.startsWith(locale.value))
    map.set(item.id, translation?.term ?? item.slug)
  }
  return map
})

function isDimmed(node: SimNode) {
  if (activeId.value === null || node.id === activeId.value)
    return false
  return !adjacency.get(activeId.value)?.has(node.id)
}

// Deterministic -1..1 noise: seeded per edge so the wobble is stable
// frame-to-frame (no shimmer while the simulation animates).
function noise(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

function edgePath({ source, target, seed }: SimLink) {
  const dx = target.x - source.x
  const dy = target.y - source.y
  const length = Math.hypot(dx, dy)
  if (length < 1)
    return `M${source.x},${source.y}`

  const perpX = -dy / length
  const perpY = dx / length
  const bow = EDGE_BOW * length * noise(seed)

  const segments = Math.max(2, Math.round(length / EDGE_SEGMENT))
  const points = [{ x: source.x, y: source.y }]
  for (let i = 1; i < segments; i++) {
    const p = i / segments
    // sin() tapers the offset to zero at both ends so the stroke still
    // meets the nodes exactly.
    const taper = Math.sin(Math.PI * p)
    const offset = (bow + EDGE_WOBBLE * noise(seed + i)) * taper
    points.push({
      x: source.x + dx * p + perpX * offset,
      y: source.y + dy * p + perpY * offset,
    })
  }
  points.push({ x: target.x, y: target.y })

  // Smooth through the points: each interior point becomes a quadratic
  // control point, joined at segment midpoints.
  let d = `M${points[0]!.x},${points[0]!.y}`
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i]!.x + points[i + 1]!.x) / 2
    const midY = (points[i]!.y + points[i + 1]!.y) / 2
    d += ` Q${points[i]!.x},${points[i]!.y} ${midX},${midY}`
  }
  d += ` L${points[points.length - 1]!.x},${points[points.length - 1]!.y}`
  return d
}

function applyForces(w: number, h: number) {
  if (!simulation)
    return
  const spread = Math.min(w, h) / SPREAD_BASELINE
  simulation
    .force('link', forceLink<SimNode, SimLink>(renderEdges.value).distance(LINK_DISTANCE * spread).strength(LINK_STRENGTH))
    .force('charge', forceManyBody<SimNode>().strength(REPULSION * spread).distanceMax(REPULSION_RANGE * spread))
    .force('collide', forceCollide<SimNode>().radius((node) => {
      const label = labels.value.get(node.id) ?? node.slug
      return Math.min(COLLIDE_MAX, COLLIDE_BASE + label.length * COLLIDE_PER_CHAR)
    }))
    // Center pull weakens as the canvas grows, so it stops compressing
    // the cluster on large screens.
    .force('x', forceX<SimNode>(w / 2).strength(CENTER_PULL_X / spread))
    .force('y', forceY<SimNode>(h / 2).strength(CENTER_PULL_Y / spread))
}

function initSimulation(w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const saved = savedPositions.value

  const nodes: SimNode[] = props.items.map((item, i) => {
    // Deterministic golden-angle seed near the center: the settle blooms outward instead of exploding in from d3's origin-based defaults.
    // Saved positions are center-relative, so they stay centered even if
    // the canvas size changed since they were stored.
    const angle = i * 2.399
    const radius = 30 + (i % 5) * 8
    return {
      id: item.id,
      slug: item.slug,
      x: cx + (saved[item.id]?.x ?? Math.cos(angle) * radius),
      y: cy + (saved[item.id]?.y ?? Math.sin(angle) * radius),
    }
  })

  const nodeById = new Map(nodes.map(node => [node.id, node]))
  const seen = new Set<string>()
  const links: SimLink[] = []
  for (const item of props.items) {
    for (const rel of item.related_terms ?? []) {
      const targetId = rel.related_glossary_id
      if (targetId === item.id || !nodeById.has(targetId))
        continue
      const key = item.id < targetId ? `${item.id}-${targetId}` : `${targetId}-${item.id}`
      if (seen.has(key))
        continue
      seen.add(key)
      links.push({ source: nodeById.get(item.id)!, target: nodeById.get(targetId)!, key, seed: item.id * 73 + targetId * 179 })
    }
  }

  adjacency = new Map()
  for (const link of links) {
    if (!adjacency.has(link.source.id))
      adjacency.set(link.source.id, new Set())
    if (!adjacency.has(link.target.id))
      adjacency.set(link.target.id, new Set())
    adjacency.get(link.source.id)!.add(link.target.id)
    adjacency.get(link.target.id)!.add(link.source.id)
  }

  renderNodes.value = nodes
  renderEdges.value = links

  simulation = forceSimulation<SimNode, SimLink>(nodes).alphaDecay(0.04)
  applyForces(w, h)

  const onTick = () => {
    triggerRef(renderNodes)
    triggerRef(renderEdges)
  }

  const hasSavedPositions = nodes.some(node => saved[node.id])
  if (reducedMotion.value === 'reduce') {
    simulation.stop()
    simulation.tick(300)
    onTick()
  } else {
    if (hasSavedPositions)
      simulation.alpha(0.15)
    simulation.on('tick', onTick)
  }

  lastWidth = w
  lastHeight = h
  ready.value = true
}

watch(width, (w) => {
  if (w > 0 && !simulation)
    initSimulation(w, height.value)
}, { immediate: true })

watchDebounced([width, height], ([w, h]) => {
  if (!simulation || w <= 0 || (w === lastWidth && h === lastHeight))
    return
  // Shift the whole layout to the new center — the centering forces are
  // too weak to drag it there before the reheat cools off.
  const dx = (w - lastWidth) / 2
  const dy = (h - lastHeight) / 2
  for (const node of renderNodes.value) {
    node.x += dx
    node.y += dy
  }
  lastWidth = w
  lastHeight = h
  applyForces(w, h)
  simulation.alpha(0.3).restart()
}, { debounce: 200 })

onBeforeUnmount(() => {
  const positions: Record<number, { x: number, y: number }> = {}
  for (const node of renderNodes.value)
    positions[node.id] = { x: node.x - lastWidth / 2, y: node.y - lastHeight / 2 }
  savedPositions.value = positions
  simulation?.stop()
})
</script>

<style lang="postcss" scoped>
.glossary-graph {
  /* Full-bleed breakout of the centered 50ch article column. */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: 64px;
  height: clamp(480px, 70vw, 840px);
  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
}

.edge {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 4 6;
  transition:
    opacity 0.2s,
    stroke 0.2s;

  &.active {
    stroke: var(--text-color);
  }
}

.node {
  cursor: pointer;
  outline: none;
  transition: opacity 0.2s;

  /* The label IS the node: the bg-color halo masks the edges that run
     underneath the word. */
  text {
    font-size: var(--text-small);
    fill: var(--text-color);
    paint-order: stroke;
    stroke: var(--bg-color);
    stroke-width: 10px;
    stroke-linejoin: round;
    transition: fill 0.2s;
  }

  &:hover text,
  &:focus-visible text,
  &.current text {
    fill: var(--text-color);
  }
}

.node.dimmed,
.edge.dimmed {
  opacity: 0.5;
}
</style>
