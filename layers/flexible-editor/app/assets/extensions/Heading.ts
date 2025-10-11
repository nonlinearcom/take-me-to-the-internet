import { mergeAttributes, Node } from '@tiptap/core'

export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingOptions {
  levels: Level[]
  HTMLAttributes: Record<string, any>
}

export const Heading = Node.create<HeadingOptions>({
  name: 'heading',
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
    }
  },
  content: 'inline*',
  group: 'block',
  defining: true,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level as Level)
    const level = hasLevel ? node.attrs.level as Level : this.options.levels[0]

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
