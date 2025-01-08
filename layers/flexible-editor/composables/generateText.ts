import type { JSONContent } from 'tiptap-render-view/vue'
import { generateText } from '@tiptap/core'
import serializers from '../assets/extensions'

export default (document: JSONContent) => {
  if (!document?.content)
    return

  let { content } = document
  // TODO: Get text from relation blocks, inline-blocks and marks too
  content = content?.filter(({ type }) => type !== 'relation-block' && type !== 'relation-inline-block' && type !== 'relation-mark')

  return generateText({
    type: 'doc',
    content,
  }, serializers)
}
