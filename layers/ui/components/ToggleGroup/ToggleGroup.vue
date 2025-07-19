<template>
  <ToggleGroupRoot
    v-slot="{ modelValue }"
    v-bind="forwarded"
    class="ToggleGroup"
  >
    <slot :model-value="modelValue" />
  </ToggleGroupRoot>
</template>

<script setup lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui'
import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui'

defineOptions({ name: 'UiToggleGroup' })
const props = defineProps<{
  // rounded?: boolean
  size?: ButtonSize
  // variant?: ButtonVariant
} & ToggleGroupRootProps>()
const emit = defineEmits<ToggleGroupRootEmits>()
const forwarded = useForwardPropsEmits(props, emit)

provide(toggleGroupInjectionKey, computed(() => ({
  // rounded: props.rounded,
  size: props.size,
  // variant: props.variant,
})))
</script>

<style lang="postcss" scoped>
.ToggleGroup {
  position: relative;
  display: inline-flex;
  border-radius: var(--border-radius);
}
</style>
