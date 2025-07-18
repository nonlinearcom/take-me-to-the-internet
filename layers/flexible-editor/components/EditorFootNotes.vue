<template>
  <div
    v-if="footnotes.length"
    class="footnotes"
    role="doc-endnotes"
  >
    <ol>
      <li
        v-for="footnote in footnotes"
        :id="`sidenote-${footnote.attrs?.number}`"
        :key="footnote.attrs?.number"
      >
        <div class="footnote_content">
          <span> <a
            :href="`#sidenote-${footnote.attrs?.data?.number}`"
            class="reversefootnote"
            role="doc-backlink"
            @click="highlightNote(footnote.attrs?.data?.number)"
          >{{ footnote?.attrs?.data?.number }}</a></span>
          <div
            class="content"
            v-html="footnote.attrs?.data?.content"
          />
          <!-- <a
            :href="`#sidenote-${footnote.attrs?.data.number}`"
            class="reversefootnote"
            role="doc-backlink"
            @click="highlightNote(footnote.attrs?.data.number)"
          >↩︎</a> -->
        </div>
      </li>
    </ol>
  </div>
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
  margin-top: 15ch;
  font-size: small;
  color: var(--text-secondary);

  ol {
    border-top: 1px solid var(--text-secondary);
  }

  img {
    max-width: 5% !important;
    display: none !important;
  }
  li {
    margin-top: 32px;
  }

  .footnote_content {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    gap: 10px;
  }

  .content_container {
    display: flex;
    gap: 10px;
  }

  .content p {
    display: inline-flex;
    width: fit-content;
    margin: 0 !important;
  }

  a {
    text-decoration: none;
  }

  .note_html {
    display: inline-flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
