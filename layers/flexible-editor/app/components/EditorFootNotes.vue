<template>
  <footer
    v-if="footnotes.length"
    class="footnotes"
    role="doc-endnotes"
  >
    <ol>
      <li
        v-for="footnote in footnotes"
        :id="`sidenote-${footnote.attrs?.number}`"
        :key="footnote.attrs?.number"
        class="footnote"
      >
        <UiButton
          class="reversefootnote"
          role="doc-backlink"
          icon="external-link"
          :label="String(footnote?.attrs?.data?.number ?? '')"
          :to="`#sidenote-${footnote.attrs?.data?.number}`"
          variant="ghost"
          size="xs"
          @click="highlightNote(footnote.attrs?.data?.number)"
        />
        <div
          class="content"
          v-html="footnote.attrs?.data?.content"
        />
      </li>
    </ol>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: any
}>()

function extractFootNotes(data: any): any[] {
  const footnotes: any[] = []

  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item))
    } else if (obj && typeof obj === 'object') {
      // Check if this object is a relation-inline-block with sidenote collection
      if (obj.type === 'relation-mark' && obj.attrs?.collection === 'sidenote') {
        footnotes.push(obj)
      }
      // Recursively traverse all object properties
      Object.values(obj).forEach(value => traverse(value))
    }
  }

  traverse(data)
  return footnotes
}

const footnotes = extractFootNotes(props.data)
// console.log('Found footnotes :', footnotes)
// console.log('Number of footnotes:', footnotes.length)

const { setActiveNote } = useFootNotes()

function highlightNote(id: string) {
  setActiveNote(id)
}
</script>

<style lang="postcss">
.footnotes {
  margin: 72px 0;
  font-size: var(--text-small);
  color: var(--text-secondary);

  ol {
    border-top: 1px solid var(--text-secondary);
    li {
      margin-top: 16px;
    }
  }

  .footnote {
    width: 100%;
    display: grid;
    grid-template-columns: 48px 1fr;
    justify-content: space-between;
    gap: 10px;

    .reversefootnote {
      text-decoration: none;
      color: var(--text-secondary);

      &:hover {
        color: var(--text-color);
      }
    }
    /* inline code inherits white-space: pre from .prose; in the narrow
       endnote cell it must wrap instead of overflowing */
    code {
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
    p {
      margin: 0 0 8px !important;
    }
    p:last-child {
      margin-bottom: 0 !important;
    }
    p:empty {
      display: none;
    }
  }
}

/* Endnotes duplicate the always-visible margin notes on desktop */
@media (min-width: 1280px) {
  .margin-notes .footnotes {
    display: none;
  }
}
</style>
