<template>
  <span class="sidenote">
    <label
      :tabindex="0"
      :aria-describedby="`sidenote-${data?.number}`"
      :for="`sidenote__checkbox--${data?.number}`"
      class="sidenote__label"
      :class="{ active: activeNoteId === data?.number }"
    >
      <!-- slot carries nested marks (e.g. italic) that the renderer wraps around the text;
           data.text is the plain-text fallback -->
      <slot>{{ data.text }}</slot>
    </label>

    <input
      :id="`sidenote__checkbox--${data?.number}`"
      aria-label="Show sidenote"
      type="checkbox"
      class="sidenote__checkbox"
      :data-sidenote-number="data?.number"
    >

    <small
      :id="`sidenote-${data?.number}`"
      class="sidenote__content "
    >
      <span class="sidenote_number">{{ data?.number }}</span>
      <span
        class="note_html"
        v-html="noteHtml"
      />
    </small>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: RelationNodeProps['id']
  junction: RelationNodeProps['junction']
  collection: RelationNodeProps['collection']
  data?: any
}>()

const { activeNoteId } = useFootNotes()

/* The note renders inside the article's <p> (the mark is inline), but the
   raw note HTML contains <p>/<div>, which the HTML parser is not allowed to
   nest in a paragraph — it closes the outer <p> early, re-parenting the SSR
   markup and breaking hydration (following blocks could even get swallowed
   into the note). Rewrite them to spans, keeping attributes; the flex column
   blockifies them again so the layout is unchanged. Everything else in the
   note content (code, em, a, img, br, video) is phrasing content. */
const noteHtml = computed(() =>
  (props.data?.content ?? '').replace(
    /<(\/?)(p|div)(?=[\s>])/g,
    (_match, close, tag) => close ? '</span' : `<span data-${tag}`,
  ),
)
</script>

<style lang="postcss" scoped>
.sidenote__content-parenthesis {
  position: absolute;
  left: -99999px;
  top: auto;
}
.sidenote__checkbox ~ .sidenote__content {
  /* Hidden, but accessible to browsers that don't do CSS (e.g. screenreaders, Pocket) */
  position: absolute;
  left: -99999px;
  top: auto;
}
.sidenote__checkbox:checked ~ .sidenote__content {
  position: relative; /* override screen-reader-only */
  left: auto; /* override screen-reader-only */
  /* float (not inline-block): takes the note out of the inline flow, so text
     following the marker (e.g. a closing ".") stays on the marker's line
     instead of being pushed below the note; min-width: 100% drops the note
     onto its own row. Same technique as the desktop margin notes. */
  display: block;
  float: inline-start;
  clear: inline-start;
}

/* hangs in the note's left padding; the note_html box is too wide
   to share a line with an inline number, so inline flow wraps it below */
.sidenote_number {
  position: absolute;
  left: 15px;
  top: 16px;
  font-size: small;
}
.sidenote__content {
  padding: 16px 40px;
  margin-block: 16px;
  min-width: 100%;
  color: var(--text-secondary);
}

.note_html {
  display: inline-flex;
  flex-direction: column;
  /* gap: 20px; */
}

/* note paragraphs are spans rewritten by noteHtml (see script); as items of
   the flex column they are blockified, so only spacing needs styling */
.note_html :deep([data-p]) {
  margin: 0 0 8px;
}
.note_html :deep([data-p]:last-child) {
  margin-bottom: 0;
}
/* the content pipeline emits empty leading paragraphs that would otherwise set the flex baseline and misalign the note number */
.note_html :deep([data-p]:empty) {
  display: none;
}

span a {
  border-radius: var(--border-radius);
  transition: background-color 0.4s ease-in-out;
}
.active {
  background-color: var(--bg-secondary) !important;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease-in-out;
}

/* the note body is v-html content, so scoped selectors need :deep to reach it */
.note_html :deep(:is(img, video)) {
  display: block;
  inline-size: 100%;
  margin-block: 10px 0;
  border-radius: var(--border-radius);
}

/* Marker bubble, two states: normal = light chip with stroke,
   hover/checked = inverted (text color as background, page background as number).
   The semantic theme vars flip both automatically in dark mode. */
.sidenote__checkbox {
  appearance: none;
  position: relative;
  vertical-align: top;
  inline-size: 16px;
  block-size: 16px;
  margin: 0;
  margin-inline-start: 2px;
  cursor: pointer;
  border: 1px solid var(--text-secondary);
  border-radius: 50%;
  background-color: var(--bg-secondary);
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.sidenote__checkbox::after {
  content: attr(data-sidenote-number);
  display: block;
  color: var(--text-color);
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  transition: color 0.3s;
}

.sidenote__checkbox:hover,
.sidenote__checkbox:checked {
  background-color: var(--text-hover);
  border-color: var(--text-hover);
}

.sidenote__checkbox:hover::after,
.sidenote__checkbox:checked::after {
  color: var(--bg-color);
}

.sidenote__checkbox:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Desktop margin notes: pages opt in with a .margin-notes ancestor class.
   Breakpoint must match the container rules in articles/[slug].vue and glossary/[slug].vue.
   float+clear (not grid/anchor-pos): the note is nested inline in the paragraph,
   and clear is what stacks consecutive notes without overlap, JS-free. */
@media (min-width: 1280px) {
  /* Cover both toggle states so the checkbox becomes layout-inert; including
     :checked also wins the specificity race against the toggle rule above. */
  .margin-notes .sidenote__checkbox ~ .sidenote__content,
  .margin-notes .sidenote__checkbox:checked ~ .sidenote__content {
    position: relative; /* keeps .sidenote_number's absolute positioning local */
    inset-inline-start: auto; /* overrides left: -99999px */
    display: block;
    float: inline-end;
    clear: inline-end;
    inline-size: var(--sidenote-width);
    min-inline-size: 0; /* overrides min-width: 100% */
    margin-block: 4px 16px;
    /* negative end margin pushes the note into the container's reserved padding zone */
    margin-inline: 0 calc(-1 * (var(--sidenote-width) + var(--sidenote-gap)));
    padding: 0;
    padding-inline-start: 20px; /* hanging-number gutter */
    font-size: var(--text-small);
    line-height: 1.35;
    overflow-wrap: break-word;
  }

  .margin-notes .sidenote_number {
    inset-inline-start: 0;
    top: 2px;
  }

  /* clicking the marker highlights the margin note instead of toggling visibility;
     the spread-only shadow acts as padding without shifting the text */
  .margin-notes .sidenote__checkbox:checked ~ .sidenote__content {
    background-color: var(--bg-secondary);
    box-shadow: 0 0 0 8px var(--bg-secondary);
    border-radius: var(--border-radius);
  }
}
</style>
