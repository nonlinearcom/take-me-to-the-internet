import type { JSONContent } from 'tiptap-render-view/vue'

// Derive a plain-text meta description from tiptap JSON content.
export function contentToDescription(content?: JSONContent | null): string | undefined {
  if (!content)
    return undefined
  return truncate(generateText(content), 160) ?? undefined
}
