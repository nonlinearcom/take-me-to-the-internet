<template>
  <UiLink
    class="ui-button"
    :class="[size, block ? 'block' : 'inline', { invert: invertIcon, padded, rounded, square: isSquare }, variant]"
    :aria-label
    :type
    :disabled="disabled || loading"
    :underline="variant === 'link'"
    v-bind="{ ...linkProps, ...$attrs }"
  >
    <slot>
      <span
        v-if="label"
        :class="{ truncate }"
      > {{ label }} </span>
    </slot>

    <slot
      name="icon"
      :disabled
      :loading
    >
      <UiIcon
        v-if="icon || loading"
        :name="loading ? 'loading' : (icon || '')"
      />
    </slot>
  </UiLink>
</template>

<script setup lang="ts">
import type { Button } from '../types/ui'

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Button>(), {
  type: 'button',
  block: false,
  label: null,
  loading: false,
  disabled: false,
  rounded: false,
  padded: true,
  size: 'md',
  variant: 'primary',
  icon: null,
  invertIcon: false,
  truncate: false,
  ariaLabel: undefined,
})

const $attrs = useAttrs()
const slots = useSlots()
const isSquare = computed(() => !slots.default && !props.label)

const linkProps = computed(() => getNuxtLinkProps(props))
</script>

<style lang="postcss">
.ui-button {
  flex-shrink: 0;
  font-weight: var(--regular);
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

  @media (hover) {
    &:hover {
      color: var(--color-hover, var(--color));
      background-color: var(--background-color-hover, var(--background-color));
    }
  }

  &:focus {
    outline: none;

    &-visible {
      box-shadow: 0 0 0 1px var(--border-color);
    }
  }

  &:is(:disabled, [disabled='true']) {
    color: var(--color) !important;
    background-color: var(--background-color) !important;
    cursor: not-allowed;
    opacity: 0.75;
  }

  &.rounded {
    border-radius: 9999px;
  }

  &.block {
    width: 100%;
    display: flex;
  }

  &.inline {
    display: inline-flex;
  }

  &.invert {
    flex-direction: row-reverse;
  }

  /* -------- */
  /* Sizes */
  /* -------- */

  &.xs {
    font-size: var(--text-mini);
    column-gap: 4px;

    &.padded {
      height: 24px;
      padding: 4px 8px;

      &.square {
        padding: 4px;
      }
    }

    & > .ui-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.sm {
    font-size: var(--text-small);
    column-gap: 6px;

    &.padded {
      height: 28px;
      padding: 6px 10px;

      &.square {
        padding: 6px;
      }
    }

    & > .ui-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.md {
    font-size: var(--text-small);
    column-gap: 6px;

    &.padded {
      height: 32px;
      padding: 6px 10px;

      &.square {
        padding: 6px;
      }
    }

    & > .ui-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.lg {
    font-size: var(--text);
    column-gap: 6px;

    &.padded {
      height: 36px;
      padding: 8px 12px;

      &.square {
        padding: 8px;
      }
    }

    & > .ui-icon {
      width: 20px;
      height: 20px;
    }
  }

  &.xl {
    font-size: var(--text-large);
    column-gap: 8px;

    &.padded {
      height: 40px;
      padding: 8px 12px;

      &.square {
        padding: 8px;
      }
    }

    & > .ui-icon {
      width: 24px;
      height: 24px;
    }
  }

  /* -------- */
  /* Variants */
  /* -------- */

  &.primary {
    --color: var(--text-hover);
    --background-color: var(--bg-secondary);
    --background-color-hover: var(--border-color);
  }

  &.secondary {
    --color: var(--bg-color);
    --background-color: var(--text-color);
    --background-color-hover: var(--text-hover);
  }

  &.accent {
    --color: var(--bg-color);
    --background-color: var(--accent);
    --background-color-hover: var(--accent-hover);
  }

  &.outline {
    --color: var(--text-hover);
    --background-color: transparent;
    --background-color-hover: var(--bg-hover);
    border-color: var(--border-color);
  }

  &.soft {
    --color: var(--text-hover);
    --background-color: var(--black-a1);
    --background-color-hover: var(--bg-hover);
  }

  &.ghost {
    --color: var(--text-hover);
    --background-color: transparent;
    --background-color-hover: var(--bg-hover);
  }

  &.link {
    --color: var(--text-hover);
    --text-color-hover: var(--text-color);
  }

  & > .truncate {
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break: break-all;
    overflow: hidden;
  }

  & > .ui-icon {
    flex-shrink: 0;
  }
}
</style>
