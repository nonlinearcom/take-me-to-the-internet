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

    <span class="mode-settings">
      <ClientOnly>
        <UiButton
          class="mode-toggle"
          :icon="isDark ? 'moon' : 'sun'"
          aria-label="Toggle dark mode"
          variant="outline"
          rounded
          @click="toggleDark()"
        />
      </ClientOnly>
      <!-- TODO: check why this does not work -->
      <!-- <UiButton
        class="lang-toggle"
        :label="locale.code"
        aria-label="Toggle language"
        variant="outline"
        rounded
        @click.prevent.stop="setLocale(locale.code)"
      /> -->

      <NuxtLink
        v-for="loc in availableLocales"
        :key="loc.code"
        class="lang-toggle"
        href="#"
        @click.prevent.stop="setLocale(loc.code)"
      >
        {{ loc.code }}
      </NuxtLink>
    </span>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
})
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<style lang="postcss">
.app-header {
  display: grid;
  grid-template-columns: 50% 1fr 1fr 40px;
  align-items: start;
  gap: 32px;
  padding: var(--app-margin-small);
  pointer-events: none;
  .main-menu {
    grid-column: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 4px;
    pointer-events: all;
  }

  .mode-settings {
    grid-column: 4;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 4px;
    pointer-events: all;
  }
  /* temp lang switcher button */
  .lang-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--text-mini);
    text-transform: uppercase;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    width: 38px;
    height: 38px;
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

    .mode-settings {
      justify-self: flex-end;
      grid-column: 1;
      grid-row: 2;
    }
  }
}
</style>
