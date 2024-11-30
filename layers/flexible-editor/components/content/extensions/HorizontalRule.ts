import { mergeAttributes, Node } from '@tiptap/core'

export interface HorizontalRuleOptions {
  HTMLAttributes: Record<string, any>
}

export const HorizontalRule = Node.create<HorizontalRuleOptions>({
  name: 'horizontalRule',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  group: 'block',
  renderHTML({ HTMLAttributes }) {
    return ['hr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
})
