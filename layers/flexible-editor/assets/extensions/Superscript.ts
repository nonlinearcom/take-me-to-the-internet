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
  /* parseHTML() {
    return [
      { tag: 'sup' },
      {
        style: 'vertical-align',
        getAttrs(value) {
          // Don’t match this rule if the vertical align isn’t super.
          if (value !== 'super')
            return false

          // If it falls through we’ll match, and this mark will be applied.
          return null
        },
      } as StyleParseRule,
    ]
  }, */
  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
  /* addCommands() {
    return {
      setSuperscript: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleSuperscript: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetSuperscript: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  }, */
  /* addKeyboardShortcuts() {
    return {
      'Mod-.': () => this.editor.commands.toggleSuperscript(),
    }
  }, */
})
