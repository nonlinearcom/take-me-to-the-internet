import type { JSONContent } from 'tiptap-render-view/vue'
import { generateHTML } from '@tiptap/html'
import serializers from '../components/content/extensions'

export default (doc: JSONContent) => {
  doc.content = doc?.content?.filter(({ type }) => type !== 'relation-block')

  return stripHTMLTags(generateHTML(doc, serializers))
}
