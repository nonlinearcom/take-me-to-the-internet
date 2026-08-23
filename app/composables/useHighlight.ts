import hljs from 'highlight.js'

export function useHighlight() {
  const isDark = useDark()

  useHead({
    link: () => [
      { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/styles/stackoverflow-${isDark.value ? 'dark' : 'light'}.min.css`,
        // Highlighting only happens client-side after mount, so the theme is
        // never needed for first paint: load it without blocking render
        // (fetched as low-priority "print", then enabled once it arrives)
        media: 'print',
        onload: 'this.media=\'all\'',
      },
    ],
  })

  onMounted(async () => {
    await nextTick()
    document.querySelectorAll('pre').forEach((block) => {
      const html = block.textContent
      if (html) {
        block.classList.add('hljs')
        block.setHTMLUnsafe(hljs.highlightAuto(html).value)
      }
    })
  })
}
