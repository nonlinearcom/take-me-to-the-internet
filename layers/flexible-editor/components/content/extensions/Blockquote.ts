import { mergeAttributes, Node } from '@tiptap/core'

export interface BlockquoteOptions {
  HTMLAttributes: Record<string, any>
}

export const Blockquote = Node.create<BlockquoteOptions>({
  name: 'blockquote',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  content: 'block+',
  group: 'block',
  defining: true,
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
