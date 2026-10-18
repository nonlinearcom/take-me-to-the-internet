<template>
  <article class="home">
    <CablesCanvas
      class="home__iframe"
      patch-dir="/patches/cover3/patch"
      js-path="js/"
      patch-id="z3OwyT"
      :variables
    />
  </article>
</template>

<script lang="ts" setup>
const isDark = useDark()

// the cover patch exposes clearColor; keep it on the page background
const variables = computed(() => ({
  clearColor: isDark.value ? '#222222' : '#fcfcfc',
}))
</script>

  <style lang="postcss">
  .home {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  height: 100vh;
  pointer-events: none;

  .home__iframe {
    z-index: -1;
    width: 100%;
    height: 100%;
    border: 0px;
    pointer-events: all;
  }
}
</style>
