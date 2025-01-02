<template>
  <header class="app-header">
    <h1 class="header__title">
      <span>TAKE</span><span>ME</span><span>TO</span><span>THE</span><span>INTERNET</span>
    </h1>

    <nav class="main-menu">
      <NuxtLink
        to="/articles"
        class="line"
      >
        Articles
      </NuxtLink>
      <NuxtLink
        to="/resources"
        class="line"
      >
        Resources
      </NuxtLink>
      <NuxtLink
        to="/glossary"
        class="line"
      >
        Glossary
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="line"
      >
        About
      </NuxtLink>
      <NuxtLink
        to="/log"
        class="line"
      >
        Log
      </NuxtLink>
    </nav>

    <UiButton
      class="mode-toggle"
      :icon="isDark ? 'moon' : 'sun'"
      aria-label="Toggle dark mode"
      variant="outline"
      rounded
      @click="toggleDark()"
    />
  </header>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="postcss">
.app-header {
  display: grid;
  grid-template-columns: 50% 1fr 1fr 40px;
  gap: 32px;
  align-items: flex-start;
  padding: var(--app-margin-small);

  .header__title {
    margin-bottom: 0;

    /* dynamic logo */
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-right: 50px;
    font-size: var(--title);
    span {
      padding: 0 8px;
      transition: background-color 0.3s;
      background-color: var(--bg-color);
      z-index: 2;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
    &:after {
      content: '';
      z-index: 1;
      position: absolute;
      display: block;
      height: 2px;
      top: 50%;
      right: 2px;
      left: 2px;
      background-color: var(--text-color);
    }
  }

  .main-menu {
    grid-column: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 4px;
  }

  .mode-toggle {
    grid-column: 4;
  }
}

@media (max-width: 1024px) {
  .app-header {
    grid-template-columns: 50% 1fr auto 40px;
    gap: 20px;
    .header__title {
      font-size: var(--text);
    }
  }
}

@media (max-width: 768px) {
  .app-header {
    grid-template-columns: 3fr auto 40px;
    padding: var(--app-margin-mini);

    .header__title {
      grid-column: 1 / span 3;
      grid-row: 1;
      margin-right: 0;
      margin-bottom: 25px;
    }

    .mode-toggle {
      grid-column: 3;
      grid-row: 2;
      transform: translate(8px, -6px);
    }
  }
}
</style>
