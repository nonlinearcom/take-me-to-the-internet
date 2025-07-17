import type { JSONContent } from '@tiptap/core'

type EditorNodes = Record<string, any>

export default (
  data: EditorNodes[],
  content: JSONContent,
  primaryKeyField = 'id',
  itemField = 'item',
) => {
  let sidenoteCounter = 0

  return toContentWithInjectedData(content)

  function toContentWithInjectedData(content: JSONContent) {
    if (!content)
      return null

    const relationBlockNodes = ['relation-block', 'relation-inline-block']

    if (content.type && relationBlockNodes.includes(content.type) && content.attrs?.id) {
      const relatedNode = data.find(node => node[primaryKeyField] === content.attrs!.id)

      content.attrs.data = relatedNode?.[itemField]
    }

    if (content.type === 'text' && content.marks?.length) {
      content.marks.map((mark) => {
        if (mark.type !== 'relation-mark' || !mark.attrs?.id)
          return mark

        const relatedNode = data.find(node => node[primaryKeyField] === mark.attrs!.id)

        mark.attrs.data = relatedNode?.[itemField]

        if (mark.attrs.collection === 'sidenote') {
          sidenoteCounter++
          mark.attrs.data.number = sidenoteCounter
          mark.attrs.data.text = content.text
          return mark
        }

        return mark
      })
    }

    content.content?.map(toContentWithInjectedData)

    return content
  }
}
