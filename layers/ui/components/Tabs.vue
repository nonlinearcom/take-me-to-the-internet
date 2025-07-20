<template>
  <TabsRoot
    v-slot="{ modelValue }"
    class="TabsRoot"
    v-bind="forwarded"
    :default-value
  >
    <TabsList class="TabsList">
      <TabsIndicator class="TabsIndicator">
        <div style="width: 100%; height: 100%" />
      </TabsIndicator>
      <TabsTrigger
        v-for="(tab, key) in tabs"
        :key
        class="TabsTrigger"
        :value="typeof tab === 'string' ? tab : tab?.value"
      >
        <template v-if="typeof tab === 'string'">
          {{ tab }}
        </template>
        <template v-else>
          <UiIcon
            v-if="tab?.icon"
            :name="tab.icon"
          />
          {{ tab?.label }}
        </template>
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(tab, key) in tabs"
      :key
      :value="typeof tab === 'string' ? tab : tab?.value"
      class="TabsContent"
      :hidden="modelValue !== (typeof tab === 'string' ? tab : tab?.value)"
    >
      <slot :name="typeof tab === 'string' ? tab : tab?.value" />
    </TabsContent>
  </TabsRoot>
</template>

<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  useForwardPropsEmits,
} from 'reka-ui'

defineOptions({ name: 'UiTabs' })
const props = withDefaults(defineProps<{
  tabs: string[] | { value: string, label?: string, icon?: string }[]
} & TabsRootProps>(), {
  orientation: 'horizontal',
  activationMode: 'automatic',
})

const emit = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<style lang="postcss">
.TabsRoot {
  --padding: 4px;

  display: flex;
  flex-direction: column;

  .TabsList {
    position: relative;
    flex-shrink: 0;
    display: flex;
    border-radius: var(--border-radius);
    background-color: var(--bg-color);

    .TabsIndicator {
      position: absolute;
      left: var(--padding);
      bottom: var(--padding);
      height: calc(100% - var(--padding) * 2);
      width: calc(var(--reka-tabs-indicator-size) - var(--padding) * 2);
      transform: translateX(var(--reka-tabs-indicator-position));
      background-color: var(--black-a1);

      border-radius: var(--border-radius);
      transition-property: width, transform;
      transition-duration: 300ms;
    }
  }

  .TabsTrigger {
    position: relative;
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 2px 8px;
    gap: 6px;
    color: var(--text-color);
    font-family: inherit;
    font-size: var(--text-small);
    line-height: 1;
    user-select: none;
    cursor: pointer;
    white-space: nowrap;

    &:nth-child(2) {
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    &:focus {
      outline: none;

      &-visible {
        box-shadow: 0 0 0 1px var(--border-color);
      }
    }

    .ui-icon {
      height: 17px;
    }
  }

  .TabsContent {
    flex-grow: 0;
    margin-top: 6px;
    padding: 4px;
    outline: none;
  }
}
</style>
