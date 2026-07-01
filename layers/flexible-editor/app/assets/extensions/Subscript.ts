import { Mark, mergeAttributes } from '@tiptap/core'

export interface SubscriptExtensionOptions {
  HTMLAttributes: object
}

export const Subscript = Mark.create<SubscriptExtensionOptions>({
  name: 'subscript',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['sub', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
