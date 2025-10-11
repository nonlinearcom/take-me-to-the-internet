import type { JSONContent } from 'tiptap-render-view/vue'
import { generateText } from '@tiptap/core'
import serializers from '../assets/extensions'

export default (document: JSONContent) => {
  if (!document?.content)
    return

  let { content } = document
  // TODO: Get text from relation blocks, inline-blocks and marks too
  // content = content?.filter(({ type }) => type !== 'relation-block' && type !== 'relation-inline-block' && type !== 'relation-mark')

  // Relation marks are nested within other nodes, so we need to filter them out recursively
  function filterRelationTypes(nodes: JSONContent[]): JSONContent[] {
    return nodes
      .filter(({ type }) => type !== 'relation-block' && type !== 'relation-inline-block')
      .map((node) => {
        if (node.content) {
          node = { ...node, content: filterRelationTypes(node.content) }
        }
        if (node.marks) {
          node = { ...node, marks: node.marks.filter(mark => mark.type !== 'relation-mark') }
        }
        return node
      })
  }

  content = filterRelationTypes(content)

  return generateText({
    type: 'doc',
    content,
  }, serializers)
}
