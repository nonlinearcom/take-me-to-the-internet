export const stripHTMLTags = (string?: string) => string?.replace(/<[^>]+>/g, '')

export function truncate(input: string | null | undefined, length: number): string | null {
  if (!input)
    return input ?? null

  const words = input.split(/\s+/)
  const outputWords: string[] = []
  let currentLength = 0

  for (const word of words) {
    // +1 accounts for space.
    if (currentLength + word.length + 1 <= length) {
      outputWords.push(word)
      currentLength += word.length + 1
    } else {
      break
    }
  }

  // If no words were added (first word is too long), fall back to truncate.
  if (outputWords.length === 0)
    return truncate(input, length)

  let output = outputWords.join(' ')

  if (currentLength <= input.length)
    output += '…'

  return output
}
