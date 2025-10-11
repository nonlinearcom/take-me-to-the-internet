<template>
  <RenderNodes
    v-if="content"
    :content
    :serializers
    :component-serializers
  />
</template>

<script setup lang="ts">
import type { JSONContent } from '@tiptap/core'
import type { Extensions, VueComponentSerializers } from 'tiptap-render-view/vue'
import { Mark, Node } from '@tiptap/core'
import RenderNodes from 'tiptap-render-view/vue'
import extensions from '../assets/extensions'

const props = defineProps<{
  content: JSONContent
  serializers?: Extensions
  componentSerializers?: VueComponentSerializers
  relationBlocks?: VueRelationNodeSerializers
  relationInlineBlocks?: VueRelationNodeSerializers
  relationMarks?: VueRelationNodeSerializers
}>()

const serializers = props.serializers ?? extensions.slice(0) ?? [] // `.slice(0)` to clone the extensions array
const relationBlockSerializer = Node.create({
  name: 'relation-block',
  renderHTML({ node, HTMLAttributes }) {
    if (props.relationBlocks) {
      for (const { collection, component } of props.relationBlocks) {
        if (HTMLAttributes.collection === collection)
          return [component, { ...HTMLAttributes }, 0] as any
      }
    }

    return [node.type, HTMLAttributes, 0] as any
  },
})
const relationInlineBlockSerializer = Node.create({
  name: 'relation-inline-block',
  renderHTML({ node, HTMLAttributes }) {
    if (props.relationInlineBlocks) {
      for (const { collection, component } of props.relationInlineBlocks) {
        if (HTMLAttributes.collection === collection)
          return [component, { ...HTMLAttributes }, 0] as any
      }
    }

    return [node.type, HTMLAttributes, 0] as any
  },
})
const relationMarkSerializer = Mark.create({
  name: 'relation-mark',
  renderHTML({ HTMLAttributes }) {
    if (props.relationMarks) {
      for (const { collection, component } of props.relationMarks) {
        if (HTMLAttributes.collection === collection)
          return [component, { ...HTMLAttributes }, 0] as any
      }
    }

    return ['span', HTMLAttributes, 0] as any
  },
})

console.log('mark', relationMarkSerializer)

// const sidenoteSerializer = Node.create({
//   name: 'sidenote',
//   renderHTML({ HTMLAttributes }) {
//     return ['aside', HTMLAttributes, 0] as any
//   },
// })

// serializers.push(sidenoteSerializer)
serializers.push(relationBlockSerializer)
serializers.push(relationInlineBlockSerializer)
serializers.push(relationMarkSerializer)
</script>
