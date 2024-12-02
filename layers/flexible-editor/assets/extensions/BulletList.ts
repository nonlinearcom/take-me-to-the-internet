import { mergeAttributes, Node } from '@tiptap/core'

export interface BulletListOptions {
  itemTypeName: string
  HTMLAttributes: Record<string, any>
  keepMarks: boolean
  keepAttributes: boolean
}

export const BulletList = Node.create<BulletListOptions>({
  name: 'bulletList',
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
  renderHTML({ HTMLAttributes }) {
    return ['ul', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
