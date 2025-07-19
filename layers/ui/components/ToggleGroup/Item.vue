<template>
  <ToggleGroupItem
    class="ToggleGroupItem"
    :class="size"
    v-bind="{ asChild, value }"
    :aria-label="value"
  >
    <slot>
      <UiIcon
        v-if="icon"
        :name="icon"
      />
      <span v-else-if="label">
        {{ label }}
      </span>
    </slot>
  </ToggleGroupItem>
</template>

<script setup lang="ts">
import type { ToggleGroupItemProps } from 'reka-ui'
import { ToggleGroupItem } from 'reka-ui'

defineOptions({ name: 'UiToggleGroupItem' })
const props = defineProps<{
  icon?: string
  label?: string
  // rounded?: boolean
  size?: ButtonSize
  // variant?: ButtonVariant
} & ToggleGroupItemProps>()

const { size: toggleGroupSize } = useToggleGroup(props)
const size = computed(() => toggleGroupSize.value ?? 'lg')
</script>

<style lang="postcss">
.ToggleGroupItem {
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 38px;
  width: 38px; */
  margin-left: -1px;
  line-height: 1;
  color: var(--text-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  padding: 4px;

  &:first-child {
    margin-left: 0;
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  &:last-child {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  &:focus {
    position: relative;
    outline: none;

    &-visible {
      box-shadow: 0 0 0 1px var(--border-color);
    }
  }

  @media (hover) {
    &:hover {
      color: var(--text-hover);
      background-color: var(--bg-hover);
    }
  }

  &[data-disabled] {
    opacity: 0.75;
  }

  &[data-state='on'] {
    background-color: var(--bg-secondary);
  }

  /* -------- */
  /* Sizes */
  /* -------- */

  &.xs {
    min-width: 20px;
    height: 20px;
    font-size: var(--text-mini);

    & > .ui-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.sm {
    min-width: 30px;
    height: 30px;
    font-size: var(--text-small);

    & > .ui-icon {
      width: 18px;
      height: 18px;
    }
  }

  &.lg {
    min-width: 38px;
    height: 38px;
    font-size: var(--text);

    & > .ui-icon {
      width: 20px;
      height: 20px;
    }
  }

  &.xl {
    min-width: 52px;
    height: 52px;
    font-size: var(--text-large);

    & > .ui-icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
