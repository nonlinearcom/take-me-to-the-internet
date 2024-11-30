import { mergeAttributes, Node } from '@tiptap/core'

export interface OrderedListOptions {
  itemTypeName: string
  HTMLAttributes: Record<string, any>
  keepMarks: boolean
  keepAttributes: boolean
}

export const OrderedList = Node.create<OrderedListOptions>({
  name: 'orderedList',
  addOptions() {
    return {
      itemTypeName: 'listItem',
      HTMLAttributes: {},
      keepMarks: false,
      keepAttributes: false,
    }
  },
  group: 'block list',
  content() {
    return `${this.options.itemTypeName}+`
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (element) => {
          return element.hasAttribute('start')
            ? Number.parseInt(element.getAttribute('start') ?? '', 10)
            : 1
        },
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { start, ...attributesWithoutStart } = HTMLAttributes

    return start === 1
      ? ['ol', mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0]
      : ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
