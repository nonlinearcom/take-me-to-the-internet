import { mergeAttributes, Node } from '@tiptap/core'

export interface ListItemOptions {
  HTMLAttributes: Record<string, any>
  bulletListTypeName: string
  orderedListTypeName: string
}

export const ListItem = Node.create<ListItemOptions>({
  name: 'listItem',
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: 'bulletList',
      orderedListTypeName: 'orderedList',
    }
  },
  content: 'paragraph block*',
  defining: true,
  renderHTML({ HTMLAttributes }) {
    return ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
