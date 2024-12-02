import { Mark, mergeAttributes } from '@tiptap/core'

export interface StrikeOptions {
  HTMLAttributes: Record<string, any>
}

export const Strike = Mark.create<StrikeOptions>({
  name: 'strike',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['s', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
