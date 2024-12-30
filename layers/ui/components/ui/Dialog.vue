<template>
  <DialogRoot v-bind="forwarded">
    <DialogTrigger
      as-child
      :aria-label="title"
    >
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent
        class="DialogContent"
        :class="side"
        v-bind="$attrs"
        trap-focus
        :style="{ maxWidth: side !== 'top' && side !== 'bottom' ? `${maxWidth}px` : 'none' }"
        :aria-describedby="!description && !$slots?.description ? undefined : description!"
      >
        <VisuallyHidden v-if="hideTitle">
          <DialogTitle> {{ title }} </DialogTitle>
        </VisuallyHidden>
        <header v-else-if="!hideTitle || description || $slots?.description">
          <DialogTitle class="DialogTitle">
            {{ title }}
          </DialogTitle>
          <DialogDescription
            v-if="description || $slots?.description"
            class="DialogDescription"
          >
            <slot name="description">
              {{ description }}
            </slot>
          </DialogDescription>
        </header>
        <slot />

        <DialogClose
          v-if="!hideClose"
          as-child
        >
          <UiButton
            class="DialogClose"
            color="black"
            variant="link"
            icon="close"
            aria-label="Close"
          />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { reactivePick } from '@vueuse/core'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
  DialogTitle,
  DialogTrigger,
  useForwardPropsEmits,
  VisuallyHidden,
} from 'radix-vue'

defineOptions({
  name: 'UiDialog',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  title: string
  description?: string
  hideTitle?: boolean
  hideClose?: boolean
  maxWidth?: number
  side?: 'top' | 'left' | 'right' | 'bottom'
} & DialogRootProps>(), {
  modal: true,
  description: '',
  maxWidth: 480,
})
const emits = defineEmits<DialogRootEmits>()
const forwarded = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'modal', 'open'), emits)
</script>

<style lang="postcss">
.DialogOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--black-a1);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background-color 200ms ease-out;
  animation: fadeIn 200ms ease-out;
}

.DialogContent {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90vw;
  max-height: 85vh;
  padding: 4px;
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transform: translate(-50%, -50%);

  &[data-state='open'] {
    animation: dialogAnimateIn 200ms ease-out;
  }

  &[data-state='closed'] {
    animation: dialogAnimateOut 100ms ease-out;
  }

  &.top,
  &.right,
  &.left,
  &.bottom {
    transform: translate(0, 0);
  }

  &.top,
  &.right,
  &.left {
    top: 0;
  }

  &.top,
  &.left,
  &.bottom {
    left: 0;
  }

  &.top,
  &.bottom {
    width: 100vw;
  }

  &.right,
  &.left {
    height: 100vh;
    max-height: none;
  }

  &.top {
    &[data-state='open'] {
      animation: fullSlideDownAndFadeIn 400ms ease-out;
    }
    &[data-state='closed'] {
      animation: fullSlideUpAndFadeOut 200ms ease-out;
    }
  }

  &.left {
    &[data-state='open'] {
      animation: fullSlideRightAndFadeIn 400ms ease-out;
    }
    &[data-state='closed'] {
      animation: fullSlideLeftAndFadeOut 200ms ease-out;
    }
  }

  &.right {
    left: auto;
    right: 0;

    &[data-state='open'] {
      animation: fullSlideLeftAndFadeIn 400ms ease-out;
    }

    &[data-state='closed'] {
      animation: fullSlideRightAndFadeOut 200ms ease-out;
    }
  }

  &.bottom {
    top: auto;
    bottom: 0;

    &[data-state='open'] {
      animation: fullSlideUpAndFadeIn 400ms ease-out;
    }

    &[data-state='closed'] {
      animation: fullSlideDownAndFadeOut 200ms ease-out;
    }
  }

  &:focus {
    outline: none;
  }

  header {
    margin-bottom: 8px;
    padding: 8px;

    .DialogTitle {
      padding-right: 24px;
      font-size: var(--text-large);
      font-weight: 500;
    }

    .DialogDescription {
      margin-top: 2px;
      padding-right: 24px;
      font-size: var(--text-small);
    }
  }

  .DialogClose {
    position: absolute;
    top: 4px;
    right: 4px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

@keyframes dialogAnimateIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dialogAnimateOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
}
</style>
