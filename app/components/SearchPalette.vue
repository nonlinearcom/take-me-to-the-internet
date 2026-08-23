<template>
  <DialogRoot v-model:open="isSearchOpen">
    <DialogPortal>
      <DialogOverlay class="SearchOverlay" />
      <!-- The always-open Combobox swallows Escape before the Dialog's
           dismiss layer sees it, so close explicitly (capture phase). -->
      <DialogContent
        class="SearchPalette"
        :aria-describedby="undefined"
        @keydown.capture.esc="isSearchOpen = false"
      >
        <VisuallyHidden>
          <DialogTitle>{{ $t('search.title') }}</DialogTitle>
        </VisuallyHidden>

        <ComboboxRoot
          class="search-combobox"
          :open="true"
          ignore-filter
        >
          <label class="search-input-row">
            <UiIcon
              name="search"
              class="search-icon"
            />
            <ComboboxInput
              v-model="query"
              class="search-input"
              auto-focus
              :placeholder="$t('search.placeholder')"
            />
          </label>

          <ComboboxContent
            v-if="hasQuery"
            class="search-results"
          >
            <div
              v-if="indexStatus === 'pending'"
              class="search-status"
            >
              {{ $t('search.loading') }}
            </div>
            <div
              v-else-if="groupedResults.length === 0"
              class="search-status"
            >
              {{ $t('search.noResults') }}
            </div>

            <ComboboxGroup
              v-for="group in groupedResults"
              :key="group.group"
              class="search-group"
            >
              <ComboboxLabel class="search-group-label">
                {{ $t(`search.${group.group}`) }}
              </ComboboxLabel>
              <ComboboxItem
                v-for="result in group.results"
                :key="result.entry.url"
                class="search-result"
                :value="result.entry.url"
                @select="openResult(result.entry)"
              >
                <span class="result-title">
                  {{ result.entry.title }}
                  <span
                    v-if="result.entry.subtitle"
                    class="result-subtitle"
                  >{{ result.entry.subtitle }}</span>
                </span>
                <span
                  v-if="result.snippet"
                  class="result-snippet"
                >{{ result.snippet.before }}<mark>{{ result.snippet.match }}</mark>{{ result.snippet.after }}</span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxContent>
        </ComboboxRoot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'

const {
  isSearchOpen,
  query,
  queryDebounced,
  indexStatus,
  ensureIndex,
  refreshIndex,
  groupedResults,
} = useSearch()

const route = useRoute()
const languageCode = useLanguageCode()

const hasQuery = computed(() => queryDebounced.value.trim().length >= 2)

watch(isSearchOpen, (open) => {
  if (open)
    ensureIndex()
})

// The index holds one locale's content: rebuild it when the language changes.
watch(languageCode, () => refreshIndex())

// Belt and braces: any navigation closes the palette.
watch(() => route.fullPath, () => {
  isSearchOpen.value = false
})

function openResult(entry: SearchEntry) {
  isSearchOpen.value = false
  navigateTo(entry.url)
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
    if (isSearchOpen.value)
      ensureIndex()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style lang="postcss">
.SearchOverlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background-color: var(--black-a5);
  backdrop-filter: blur(8px);
  animation: fadeIn 200ms ease-out;
}

.SearchPalette {
  position: fixed;
  z-index: 31;
  inset-block-start: 15vh;
  inset-inline-start: 50%;
  translate: -50% 0;
  inline-size: min(640px, calc(100vw - 32px));
  max-block-size: 60vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;

  &:focus {
    outline: none;
  }

  .search-combobox {
    display: flex;
    flex-direction: column;
    min-block-size: 0;
  }

  .search-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;

    .search-icon {
      flex-shrink: 0;
      color: var(--text-secondary);
    }
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: var(--text-small);
    font-family: inherit;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  .search-results {
    overflow-y: auto;
    padding-block: 8px;
    border-block-start: 1px solid var(--border-color);
  }

  .search-status {
    padding: 16px;
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .search-group-label {
    padding: 12px 16px 4px;
    font-size: var(--text-mini);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
  }

  .search-result {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 16px;
    cursor: pointer;

    &[data-highlighted] {
      background-color: var(--bg-secondary);
    }

    .result-title {
      font-size: var(--text-small);
    }

    .result-subtitle {
      color: var(--text-secondary);
    }

    .result-snippet {
      font-size: var(--text-mini);
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      mark {
        background-color: transparent;
        color: var(--text-color);
        font-weight: var(--bold);
      }
    }
  }
}
</style>
