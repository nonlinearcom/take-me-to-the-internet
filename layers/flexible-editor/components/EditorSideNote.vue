<template>
  <span class="sidenote">
    <label
      :tabindex="0"
      :title="data?.title"
      :aria-describedby="`sidenote-${data?.id}`"
      :for="`sidenote__checkbox--${data?.id}`"
      class="sidenote__label"
    >
      <a
        v-if="data?.href"
        :href="data?.href"
        :target="data?.target"
        :rel="data?.rel"
        :class="{ active: activeNoteId === data.id }"
      >{{ data?.linkText }}</a>
    </label>

    <input
      :id="`sidenote__checkbox--${data?.id}`"
      aria-label="Show sidenote"
      type="checkbox"
      class="sidenote__checkbox"
      :data-sidenote-number="data?.id"
    >

    <small
      :id="`sidenote-${data?.id}`"
      class="sidenote__content "
    >
      <span class="sidenote_number">{{ data?.id }}</span>
      <div
        class="note_html"
        v-html="data?.noteHtml"
      />
      <img
        v-if="data?.linkImage"
        :src="data?.linkImage"
        :alt="data?.title"
      >
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

console.log('noteHtml', props)

// Example: Add any additional logic if needed
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
  display: inline-block;
  flex-wrap: wrap;
  /* margin: 0.8rem 0;
  padding: 0.8rem 1.6rem; */
}

.sidenote_number {
  margin-left: -25px;
  margin-right: 15px;
  display: inline;
}
.sidenote__content {
  padding: 15px 90px 15px 40px;
  min-width: 100%;
}

.note_html {
  display: inline-flex;
  flex-direction: column;
  gap: 20px;
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

small img {
  width: 100%;
  margin-top: 10px;
}

/*input styling*/

@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  input[type='checkbox'] {
    --active: #fcfcfc;
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, 0.3);
    --border: #bbc1e1;
    --border-hover: #275efe;
    --background: rgba();
    --disabled: #f6f8ff;
    --disabled-inner: #e1e6f9;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin: 0;
    margin-left: 2px;
    cursor: pointer;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--b, var(--background));
    transition:
      background 0.3s,
      border-color 0.3s,
      box-shadow 0.2s,
      border-radius 0.2s;
  }
  input[type='checkbox']:checked {
    --b: var(--active);
    --bc: var(--active);
  }
  input[type='checkbox']::after {
    content: attr(data-sidenote-number);
    display: block;
    position: absolute;
    left: 2.5px;
    top: -0.68px;
    color: white;
    font-size: 9px;
  }
  input[type='checkbox']:hover {
    --b: var(--active);
  }
  input[type='checkbox']:checked::after {
    color: #222222;
  }

  input[type='checkbox']:hover::after {
    color: #222222;
  }
}
</style>
