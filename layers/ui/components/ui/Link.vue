<template>
  <component
    :is="as"
    v-if="!to"
    :type
    :disabled
    :class="active ? activeClass : undefined"
  >
    <slot v-bind="{ isActive: active }" />
  </component>
  <NuxtLink
    v-else
    v-slot="{ route, href, target, rel, navigate, isActive, isExactActive, isExternal }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="!disabled ? href : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :role="disabled ? 'link' : undefined"
      :rel
      :target="isExternal ? '_blank' : target"
      :class="[active ? activeClass : resolveLinkClass(route, $route, { isActive, isExactActive }), { underline, external: isExternal }]"
      @click="(e) => (!isExternal && !disabled) && navigate(e)"
    >
      <slot v-bind="{ isActive: active !== undefined ? active : (exact ? isExactActive : isActive) }" />
    </a>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { RouteLocation, RouteLocationNormalizedLoaded } from 'vue-router'
import type { Link } from '../../types/link'
import { isEqual } from 'ohash'

defineOptions({ name: 'UiLink' })
const props = defineProps({
  ...nuxtLinkProps,
  as: { type: String, default: 'button' },
  type: { type: String, default: 'button' },
  underline: { type: Boolean, default: true },
  disabled: { type: Boolean, default: null },
  active: { type: Boolean, default: undefined },
  exact: { type: Boolean, default: true },
  exactQuery: { type: Boolean, default: false },
  exactHash: { type: Boolean, default: false },
}) as Link

function resolveLinkClass(route: RouteLocation, $route: RouteLocationNormalizedLoaded, { isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
  if (props.exactQuery && !isEqual(route.query, $route.query))
    return null
  if (props.exactHash && route.hash !== $route.hash)
    return null
  if (props.exact && isExactActive)
    return `${props.activeClass} ${props.exactActiveClass}`
  if (!props.exact) {
    if (isActive)
      return `${props.activeClass} ${props.exactActiveClass}`
    if ($route.path.includes(route.path))
      return props.activeClass
  }
  return null
}
</script>

<style lang="postcss" scoped>
a {
  text-underline-offset: 4px;

  @media (hover) {
    &.underline:hover {
      text-decoration: underline;
    }
  }

  &.external {
    cursor: alias;
  }
}
</style>
