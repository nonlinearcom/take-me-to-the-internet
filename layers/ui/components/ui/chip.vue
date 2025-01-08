<template>
  <span
    class="ui-chip"
    :class="[size, variant, { rounded, padded, uppercase, bold }]"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiChip' })
defineProps({
  label: { type: String, default: null },
  rounded: { type: Boolean, default: true },
  padded: { type: Boolean, default: true },
  uppercase: { type: Boolean, default: true },
  bold: { type: Boolean, default: false },
  size: { type: String as PropType<ButtonSize>, default: 'lg' },
  variant: { type: String as PropType<Omit<ButtonVariant, 'link' | 'ghost'>>, default: 'primary' },
})
</script>

<style lang="postcss">
.ui-chip {
  display: inline-flex;
  flex-shrink: 0;
  /* TODO: Think about this */
  font-weight: 500;
  justify-content: center;
  align-items: center;
  line-height: 1;
  color: var(--color);
  background-color: var(--background-color);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  transition-duration: 200ms;
  transition-property: color, background-color, border-color, opacity, transform;
  box-sizing: border-box;
  white-space: nowrap;

  &.rounded {
    border-radius: 9999px;
  }
  &.uppercase {
    text-transform: uppercase;
  }
  &.bold {
    font-weight: var(--bold);
  }

  /* -------- */
  /* Sizes */
  /* -------- */

  &.xs {
    font-size: var(--text-mini);
    column-gap: 3px;

    &.padded {
      min-height: 18px;
      padding: 2px 8px;
    }
  }

  &.sm {
    font-size: var(--text-small);
    column-gap: 5px;

    &.padded {
      min-height: 30px;
      padding: 2px 12px;
    }
  }

  &.lg {
    font-size: var(--text);
    column-gap: 8px;

    &.padded {
      min-height: 36px;
      padding: 8px 16px;
    }
  }

  &.xl {
    font-size: var(--text-large);
    column-gap: 12px;

    &.padded {
      min-height: 48px;
      padding: 12px 22px;
    }
  }

  /* -------- */
  /* Variants */
  /* -------- */

  &.primary {
    --color: var(--text-hover);
    --background-color: var(--bg-secondary);
  }

  &.secondary {
    --color: var(--bg-color);
    --background-color: var(--text-color);
  }

  &.accent {
    --color: var(--bg-color);
    --background-color: var(--accent);
  }

  &.outline {
    --color: var(--text-hover);
    --background-color: transparent;
    border-color: var(--border-color);
  }

  &.soft {
    --color: var(--text-hover);
    --background-color: var(--black-a1);
  }
}
</style>
