<template>
    <article class="home">
      <CablesCanvas class="home__iframe"/>
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
      z-index: -2;
      width: 100%;
      height: 100%;
      border: 0px;
      pointer-events: all;
    }
  }
  </style>
  