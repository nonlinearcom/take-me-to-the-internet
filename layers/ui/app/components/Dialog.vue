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
        :class="[side, { inset, 'inset-auto-height': insetAutoHeight }]"
        :style="{ '--ui-dialog-max-width': maxWidth }"
        v-bind="$attrs"
        trap-focus
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
            ref="closeRef"
            class="DialogClose"
            color="black"
            variant="link"
            icon="close"
            :aria-label="$t('close')"
          />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  useForwardPropsEmits,
  VisuallyHidden,
} from 'reka-ui'

defineOptions({ name: 'UiDialog', inheritAttrs: false })
const props = withDefaults(defineProps<{
  title: string
  description?: string
  hideTitle?: boolean
  hideClose?: boolean
  maxWidth?: string
  inset?: boolean
  insetAutoHeight?: boolean
  side?: 'top' | 'left' | 'right' | 'bottom'
} & DialogRootProps>(), {
  modal: true,
  description: '',
  maxWidth: '50vw',
  inset: false,
  insetAutoHeight: false,
})
const emits = defineEmits<DialogRootEmits>()
const forwarded = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'modal', 'open'), emits)

// Prevent auto-focus on other elements in the dialog
const closeRef = ref()
const { focused } = useFocus(closeRef, { initialValue: true })
</script>

<style lang="postcss">
.DialogOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--black-a6);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background-color 200ms ease-out;
  animation: fadeIn 200ms ease-out;
}

.DialogContent {
  position: fixed;
  top: 50%;
  left: 50%;
  width: calc(100vw - var(--app-padding));
  max-height: 85vh;
  max-width: var(--ui-dialog-max-width, 50vw);

  /* padding: 4px; */
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transform: translate(-50%, -50%);
  animation: dialogAnimateIn 200ms ease-out;
  overflow-y: auto;
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
    height: var(--unit-100vh);
    max-height: none;
    @media (max-width: 1024px) {
      max-width: 100vw;
    }
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
      animation: fullSlideRightAndFadeOut 200ms ease-in;
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

  > header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .DialogTitle {
      font-size: var(--text);
      font-weight: var(--bold);
    }

    .DialogDescription {
      margin-top: 8px;
      font-size: var(--text-small);
    }
  }

  .DialogClose {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  /* Inset variant: add a 32px gap from viewport edges */
  &.inset {
    /* Centered dialog: keep it away from edges */
    /* width: calc(100vw - 64px); */
    max-height: calc(100vh - 64px);

    &.top,
    &.bottom {
      left: 32px;
      right: 32px;
      width: auto;
    }

    &.top {
      top: 32px;
    }

    &.bottom {
      bottom: 32px;
    }

    &.left,
    &.right {
      top: auto;
      bottom: 32px;
      height: calc(var(--unit-100vh) - 64px);
      max-height: none;
    }

    &.left {
      left: 32px;
    }

    &.right {
      right: 32px;
      left: auto;
    }

    /* Allow auto height with a capped max-height for side dialogs */
    &.inset-auto-height {
      &.left,
      &.right {
        height: auto;
        max-height: calc(var(--unit-100vh) - 64px);
      }
    }

    @media (max-width: 1024px) {
      &.left,
      &.right {
        max-width: calc(100vw - 64px);
      }
    }
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
</style>
