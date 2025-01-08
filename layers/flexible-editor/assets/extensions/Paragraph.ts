import { mergeAttributes, Node } from '@tiptap/core'

export interface ParagraphOptions {
  HTMLAttributes: Record<string, any>
}

export const Paragraph = Node.create<ParagraphOptions>({
  name: 'paragraph',
  priority: 1000,
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  group: 'block',
  content: 'inline*',
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
