<template>
  <Primitive
    :as="as"
    class="ui-button ui-chip"
    :class="[size, variant, { rounded, padded, uppercase, bold }]"
  >
    <slot>{{ label }}</slot>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

defineOptions({
  name: 'UiChip',
})

const props = withDefaults(defineProps<ChipProps>(), {
  label: 'I am a chip!',
  size: 'lg',
  rounded: true,
  padded: true,
  uppercase: true,
  bold: false,
  variant: 'soft',
  as: 'span',
})

interface ChipProps {
  label?: string | number
  rounded?: boolean
  padded?: boolean
  uppercase?: boolean
  bold?: boolean
  size?: ButtonSize
  variant?: Exclude<ButtonVariant, 'ghost' | 'link'> // all variants except ghost and link
  as?: any
}
</script>

<style lang="postcss">
.ui-chip {
  &.bold {
    font-weight: var(--bold);
  }
}
</style>
