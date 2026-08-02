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
    /* The Directus Flexible Editor has no highlight tool, so the otherwise
       unused strike mark is repurposed: editors toggle "strikethrough" in the
       CMS, the site renders it as a highlight. The stored mark type stays
       'strike'. */
    return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
