import type { JSONContent } from 'tiptap-render-view/vue'

// Derive a plain-text meta description from tiptap JSON content.
export function contentToDescription(content?: JSONContent | null): string | undefined {
  if (!content)
    return undefined
  return truncate(generateText(content), 160) ?? undefined
}

// Derive a plain-text meta description from an HTML string (e.g. Directus wysiwyg fields).
export function htmlToDescription(html?: string | null): string | undefined {
  if (!html)
    return undefined
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return truncate(text, 160) ?? undefined
}
