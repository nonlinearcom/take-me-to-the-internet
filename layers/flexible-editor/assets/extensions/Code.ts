import { Mark, mergeAttributes } from '@tiptap/core'

export interface CodeOptions {
  HTMLAttributes: Record<string, any>
}

export const Code = Mark.create<CodeOptions>({
  name: 'code',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  excludes: '_',
  code: true,
  exitable: true,
  renderHTML({ HTMLAttributes }) {
    return ['code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
