<template>
  <span class="sidenote">
    <label
      :tabindex="0"
      :aria-describedby="`sidenote-${data?.number}`"
      :for="`sidenote__checkbox--${data?.number}`"
      class="sidenote__label"
      :class="{ active: activeNoteId === data?.number }"
    >
      {{ data.text }}
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
      <div
        class="note_html"
        v-html="data?.content"
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
  display: inline;
  margin-left: -25px;
  margin-right: 15px;
  vertical-align: top;
  font-size: small;
}
.sidenote__content {
  padding: 16px 90px 0px 40px;
  margin-top: 16px;
  min-width: 100%;
  color: var(--text-secondary);
}

.note_html {
  display: inline-flex;
  flex-direction: column;
  /* gap: 20px; */
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
    --active: var(--bg-secondary);
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, 0.3);
    --border: var(--bg-secondary);
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
    color: var(--text-secondary);
    font-size: 9px;
  }
  input[type='checkbox']:hover {
    --b: var(--active);
  }
  input[type='checkbox']:checked::after {
    color: var(--text-secondary);
  }

  input[type='checkbox']:hover::after {
    color: var(--text-secondary);
  }
}
</style>
