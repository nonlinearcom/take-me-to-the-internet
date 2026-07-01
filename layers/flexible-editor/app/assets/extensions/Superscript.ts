import { Mark, mergeAttributes } from '@tiptap/core'

export interface SuperscriptExtensionOptions {
  HTMLAttributes: object
}

export const Superscript = Mark.create<SuperscriptExtensionOptions>({
  name: 'superscript',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
