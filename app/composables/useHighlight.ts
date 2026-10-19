import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import glsl from 'highlight.js/lib/languages/glsl'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import scss from 'highlight.js/lib/languages/scss'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

// Only the grammars the content uses (js, html, json, css) plus a few likely
// ones for untagged blocks: the full highlight.js build is ~300 KB gzipped
// and would double the script weight of every article page.
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('glsl', glsl)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('python', python)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)

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
      const code = block.textContent
      if (!code)
        return
      // the editor tags blocks as language-xx on the inner <code>; untagged
      // ones are detected among the registered grammars
      const language = block.querySelector('code')?.className.match(/language-([\w-]+)/)?.[1]
      const { value } = language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language })
        : hljs.highlightAuto(code)
      block.classList.add('hljs')
      block.setHTMLUnsafe(value)
    })
  })
}
