<template>
  <div
    ref="container"
    class="glossary-graph"
    :style="{ height: `${height}px` }"
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
          active: hoverId !== null && (edge.source.id === hoverId || edge.target.id === hoverId),
          dimmed: hoverId !== null && edge.source.id !== hoverId && edge.target.id !== hoverId,
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
        <circle
          v-if="node.slug === currentSlug"
          class="ring"
          :cx="node.x"
          :cy="node.y"
          r="11"
        />
        <circle
          :cx="node.x"
          :cy="node.y"
          r="6"
        />
        <text
          :x="node.x"
          :y="node.y + 20"
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

// Structural subset of GlossaryItem: defineProps can't resolve the global
// declarations from app/types, so the shape is repeated here.
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
}

const props = defineProps<{
  items: GraphSourceItem[]
  currentSlug?: string
}>()

const { t, locale } = useI18n()

// Layout survives the per-slug page remount, so prev/next navigation
// re-settles gently instead of re-scrambling the whole graph.
const savedPositions = useState<Record<number, { x: number, y: number }>>('glossary-graph-positions', () => ({}))

const container = useTemplateRef('container')
const { width } = useElementSize(container)
const height = computed(() => width.value > 0 ? Math.min(440, Math.max(300, width.value * 0.7)) : 360)

const reducedMotion = usePreferredReducedMotion()

const ready = ref(false)
const frame = ref(0)
const hoverId = ref<number | null>(null)

let simulation: ReturnType<typeof forceSimulation<SimNode, SimLink>> | null = null
let simNodes: SimNode[] = []
let simLinks: SimLink[] = []
let centerX: ReturnType<typeof forceX<SimNode>> | null = null
let centerY: ReturnType<typeof forceY<SimNode>> | null = null
let lastWidth = 0

const labels = computed(() => {
  const map = new Map<number, string>()
  for (const item of props.items) {
    const translation = item.translations?.find(tr => tr.languages_code.startsWith(locale.value))
    map.set(item.id, translation?.term ?? item.slug)
  }
  return map
})

const adjacency = computed(() => {
  const map = new Map<number, Set<number>>()
  for (const link of simLinks) {
    if (!map.has(link.source.id))
      map.set(link.source.id, new Set())
    if (!map.has(link.target.id))
      map.set(link.target.id, new Set())
    map.get(link.source.id)!.add(link.target.id)
    map.get(link.target.id)!.add(link.source.id)
  }
  return map
})

const renderNodes = computed(() => {
  void frame.value
  return simNodes
})

const renderEdges = computed(() => {
  void frame.value
  return simLinks
})

function isDimmed(node: SimNode) {
  if (hoverId.value === null || node.id === hoverId.value)
    return false
  return !adjacency.value.get(hoverId.value)?.has(node.id)
}

function edgePath({ source, target }: SimLink) {
  const midX = (source.x + target.x) / 2
  const midY = (source.y + target.y) / 2
  const curve = 0.15
  const controlX = midX - (target.y - source.y) * curve
  const controlY = midY + (target.x - source.x) * curve
  return `M${source.x},${source.y} Q${controlX},${controlY} ${target.x},${target.y}`
}

function initSimulation(w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const saved = savedPositions.value

  simNodes = props.items.map((item, i) => {
    // Deterministic golden-angle seed near the center: the settle blooms
    // outward instead of exploding in from d3's origin-based defaults.
    const angle = i * 2.399
    const radius = 30 + (i % 5) * 8
    return {
      id: item.id,
      slug: item.slug,
      x: saved[item.id]?.x ?? cx + Math.cos(angle) * radius,
      y: saved[item.id]?.y ?? cy + Math.sin(angle) * radius,
    }
  })

  const nodeById = new Map(simNodes.map(node => [node.id, node]))
  const seen = new Set<string>()
  simLinks = []
  for (const item of props.items) {
    for (const rel of item.related_terms ?? []) {
      const targetId = rel.related_glossary_id
      if (targetId === item.id || !nodeById.has(targetId))
        continue
      const key = item.id < targetId ? `${item.id}-${targetId}` : `${targetId}-${item.id}`
      if (seen.has(key))
        continue
      seen.add(key)
      simLinks.push({ source: nodeById.get(item.id)!, target: nodeById.get(targetId)!, key })
    }
  }

  centerX = forceX<SimNode>(cx).strength(0.05)
  centerY = forceY<SimNode>(cy).strength(0.08)

  simulation = forceSimulation<SimNode, SimLink>(simNodes)
    .force('link', forceLink<SimNode, SimLink>(simLinks).distance(80).strength(0.4))
    .force('charge', forceManyBody<SimNode>().strength(-180))
    .force('collide', forceCollide<SimNode>().radius((node) => {
      const label = labels.value.get(node.id) ?? node.slug
      return Math.min(70, 16 + label.length * 3)
    }))
    .force('x', centerX)
    .force('y', centerY)
    .alphaDecay(0.04)

  const hasSavedPositions = simNodes.some(node => saved[node.id])
  if (reducedMotion.value === 'reduce') {
    simulation.stop()
    simulation.tick(300)
    frame.value++
  } else {
    if (hasSavedPositions)
      simulation.alpha(0.15)
    simulation.on('tick', () => {
      frame.value++
    })
  }

  lastWidth = w
  ready.value = true
}

watch(width, (w) => {
  if (w > 0 && !simulation)
    initSimulation(w, height.value)
}, { immediate: true })

watchDebounced(width, (w) => {
  if (!simulation || w <= 0 || w === lastWidth)
    return
  lastWidth = w
  centerX?.x(w / 2)
  centerY?.y(height.value / 2)
  simulation.alpha(0.3).restart()
}, { debounce: 200 })

onBeforeUnmount(() => {
  const positions: Record<number, { x: number, y: number }> = {}
  for (const node of simNodes)
    positions[node.id] = { x: node.x, y: node.y }
  savedPositions.value = positions
  simulation?.stop()
})
</script>

<style lang="postcss" scoped>
.glossary-graph {
  width: 100%;
  margin-top: 64px;

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
  stroke-width: 1.5px;
  transition:
    opacity 0.2s,
    stroke 0.2s;

  &.active {
    stroke: #000;
  }
}

.node {
  cursor: pointer;
  outline: none;
  transition: opacity 0.2s;

  circle {
    fill: var(--text-secondary);
    transition: fill 0.2s;
  }

  .ring {
    fill: none;
    stroke: #000;
    stroke-width: 1.5px;
  }

  text {
    font-size: var(--text-mini);
    fill: var(--text-color);
    paint-order: stroke;
    stroke: var(--bg-color);
    stroke-width: 3px;
    stroke-linejoin: round;
  }

  &:hover circle:not(.ring),
  &:focus-visible circle:not(.ring) {
    fill: #000;
  }

  &.current circle:not(.ring) {
    fill: #000;
  }
}

.node.dimmed,
.edge.dimmed {
  opacity: 0.15;
}
</style>
