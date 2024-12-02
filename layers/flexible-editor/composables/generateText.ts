import type { JSONContent } from 'tiptap-render-view/vue'
import { generateHTML } from '@tiptap/html'
import serializers from '../assets/extensions'

export default (doc: JSONContent) => {
  doc.content = doc?.content?.filter(({ type }) => type !== 'relation-block')

  return stripHTMLTags(generateHTML(doc, serializers))
}
