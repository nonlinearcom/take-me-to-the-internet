import { Mark, mergeAttributes } from '@tiptap/core'

export interface ItalicOptions {
  HTMLAttributes: Record<string, any>
}

export const Italic = Mark.create<ItalicOptions>({
  name: 'italic',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['em', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
