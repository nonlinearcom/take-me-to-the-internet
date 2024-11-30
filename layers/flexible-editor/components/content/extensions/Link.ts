import { Mark, mergeAttributes } from '@tiptap/core'

export interface LinkProtocolOptions {
  scheme: string
  optionalSlashes?: boolean
}

export interface LinkOptions {
  autolink: boolean
  protocols: Array<LinkProtocolOptions | string>
  openOnClick: boolean | 'whenNotEditable'
  linkOnPaste: boolean
  HTMLAttributes: Record<string, any>
  validate?: (url: string) => boolean
}

export const Link = Mark.create<LinkOptions>({
  name: 'link',
  priority: 1000,
  keepOnSplit: false,
  addOptions() {
    return {
      openOnClick: true,
      linkOnPaste: true,
      autolink: true,
      protocols: [],
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: null,
      },
      validate: undefined,
    }
  },
  addAttributes(): {
    href: { default?: string | null }
    target: { default?: string | null }
    rel: { default?: string | null }
    class: { default?: string | null }
  } {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target as string,
      },
      rel: {
        default: this.options.HTMLAttributes.rel as string,
      },
      class: {
        default: this.options.HTMLAttributes.class as string,
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.href?.startsWith('javascript:') === true) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: '' }), 0]
    }
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
