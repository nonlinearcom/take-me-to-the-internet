import type { JSONContent } from 'tiptap-render-view/vue'

// Presentation helpers: dates, plain text and document titles. Helpers for
// the Directus data shapes live in directus.ts.

export function formatDate(d: Date | string | undefined, options: { locale?: string } = {}) {
  if (!d)
    return undefined

  return new Date(d).toLocaleDateString(options.locale ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Plain text from an HTML string (Directus wysiwyg fields): tags become
// spaces so adjacent blocks don't run together, then whitespace collapses
export function stripHtml(html?: string | null) {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

// "Title – Subtitle" for the document title, dropping empty parts
export function joinTitle(...parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(' – ')
}

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
  return truncate(stripHtml(html), 160) ?? undefined
}
