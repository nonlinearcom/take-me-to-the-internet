<template>
  <div
    v-if="footnotes.length"
    class="footnotes"
    role="doc-endnotes"
  >
    <hr>
    <ol>
      <li
        v-for="footnote in footnotes"
        :id="`sidenote-${footnote.attrs?.id}`"
        :key="footnote.attrs?.id"
      >
        <div class="footnote_content">
          <span>{{ footnote?.attrs?.data?.id }}</span>
          <div v-html="footnote.attrs?.data?.noteHtml" />
        </div>
        <a
          :href="`#sidenote-${footnote.attrs?.data.id}`"
          class="reversefootnote"
          role="doc-backlink"
          @click="highlightNote(footnote.attrs?.data.id)"
        >↩︎</a>
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
      if (obj.type === 'relation-inline-block' && obj.attrs?.collection === 'sidenote') {
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

<style lang="postcss" scoped>
.footnote_content {
  display: inline-flex;
  gap: 10px;
}

a {
  text-decoration: none;
}

.note_html {
  display: inline-flex;
  flex-direction: column;
  gap: 20px;
}

.footnotes {
  margin-top: 15ch;
}

.footnotes {
  ol {
    padding: 0;
  }
  li {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 30px;

    p {
      margin: 0;
      max-width: 500px;
    }
    span {
      font-size: 13px;
    }
  }
}
</style>
