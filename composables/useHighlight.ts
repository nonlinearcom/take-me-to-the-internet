import hljs from 'highlight.js'

export default function () {
  const isDark = useDark()

  useHead({
    link: () => isDark.value
      ? [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-dark.min.css' }]
      : [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-light.min.css' }],
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
