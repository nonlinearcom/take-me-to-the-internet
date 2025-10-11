import { mergeAttributes, Node } from '@tiptap/core'

export interface HardBreakOptions {
  keepMarks: boolean
  HTMLAttributes: Record<string, any>
}

export const HardBreak = Node.create<HardBreakOptions>({
  name: 'hardBreak',
  addOptions() {
    return {
      keepMarks: true,
      HTMLAttributes: {},
    }
  },
  inline: true,
  group: 'inline',
  selectable: false,
  renderHTML({ HTMLAttributes }) {
    return ['br', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  renderText() {
    return '\n'
  },
})
