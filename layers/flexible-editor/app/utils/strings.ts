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

  // If no words were added (first word is longer than `length`), hard-cut the
  // input so a single long token can't recurse forever.
  if (outputWords.length === 0)
    return `${input.slice(0, Math.max(0, length - 1))}…`

  let output = outputWords.join(' ')

  if (currentLength <= input.length)
    output += '…'

  return output
}
