<template>
  <article class="home">
    <iframe
      class="home__iframe"
      allow="autoplay; camera; microphone"
      src="./patches/cover2/index.html"
    />
  </article>
</template>

<script lang="ts" setup>

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
