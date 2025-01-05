<template>
  <header class="app-header">
    <HeaderLogo />
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
defineOptions({
  name: 'AppHeader',
})
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="postcss">
.app-header {
  display: grid;
  grid-template-columns: 50% 1fr 1fr 40px;
  gap: 32px;
  padding: var(--app-margin-small);
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
    align-self: flex-start;
  }
}

@media (max-width: 1024px) {
  .app-header {
    grid-template-columns: 50% 1fr;
    gap: 20px;
    .tmtti-logo {
      font-size: var(--text);
    }
  }
}

@media (max-width: 768px) {
  .app-header {
    grid-template-columns: 1fr;

    padding: var(--app-margin-mini);

    .tmtti-logo {
      grid-column: 1;
    }

    .main-menu {
      grid-column: 1;
      grid-row: 2;
    }

    .mode-toggle {
      justify-self: flex-end;
      grid-column: 1;
      grid-row: 2;
    }
  }
}
</style>
