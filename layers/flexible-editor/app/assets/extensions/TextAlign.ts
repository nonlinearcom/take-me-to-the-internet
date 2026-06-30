import { Extension } from '@tiptap/core'

export interface TextAlignOptions {
  types: string[]
  alignments: string[]
  defaultAlignment: string
}
export const TextAlign = Extension.create<TextAlignOptions>({
  name: 'textAlign',
  addOptions() {
    return {
      types: [],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            renderHTML: (attributes) => {
              if (attributes.textAlign === this.options.defaultAlignment)
                return {}

              return { style: `text-align: ${attributes.textAlign}` }
            },
          },
        },
      },
    ]
  },
})
