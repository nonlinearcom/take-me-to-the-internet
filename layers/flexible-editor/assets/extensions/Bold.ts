import { Mark, mergeAttributes } from '@tiptap/core'

export interface BoldOptions {
  HTMLAttributes: Record<string, any>
}

export const Bold = Mark.create<BoldOptions>({
  name: 'bold',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
