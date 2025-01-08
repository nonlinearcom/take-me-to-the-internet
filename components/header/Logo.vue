<template>
  <NuxtLink to="/">
    <h1 class="tmtti-logo">
      TAKE<span class="dash" />ME<span class="dash" />TO<span class="dash" />THE<span class="dash" />INTERNET
    </h1>
  </NuxtLink>
</template>

<script lang="ts" setup>

</script>

<style lang="postcss">
  /* Dynamic logo */
.tmtti-logo {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: var(--text-large);
  transition: background-color 0.3s;

  .dash {
    height: 2px;
    min-width: 12px;
    top: 50%;
    background-color: var(--text-color);
    flex: 1 0 auto;
    align-self: center;
    border-radius: 1px;
  }
}
</style>
