import { mergeAttributes, Node } from '@tiptap/core'

export interface CodeBlockOptions {
  languageClassPrefix: string
  exitOnTripleEnter: boolean
  exitOnArrowDown: boolean
  HTMLAttributes: Record<string, any>
}

export const CodeBlock = Node.create<CodeBlockOptions>({
  name: 'codeBlock',
  addOptions() {
    return {
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      HTMLAttributes: {},
    }
  },
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element) => {
          const { languageClassPrefix } = this.options
          const classNames = [...(element.firstElementChild?.classList || [])]
          const languages = classNames
            .filter(className => className.startsWith(languageClassPrefix))
            .map(className => className.replace(languageClassPrefix, ''))
          const language = languages[0]

          if (!language) {
            return null
          }

          return language
        },
        rendered: false,
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'code',
        {
          class: node.attrs.language != null
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        0,
      ],
    ]
  },
})
