<template>
  <DrawerRoot v-bind="forwarded">
    <DrawerTrigger
      v-if="$slots.trigger"
      class="DrawerTrigger"
      as-child
    >
      <slot name="trigger" />
    </DrawerTrigger>

    <DrawerPortal :disabled="disabled">
      <DrawerOverlay class="DrawerOverlay" />
      <DrawerContent
        ref="content"
        class="Drawer"
        :class="[swipeDirection, { snap: !!snapPoints?.length, inset }]"
        :style="snapPoints?.length ? undefined : { height: autoHeight ? 'auto' : '100%' }"
        v-bind="$attrs"
        @interact-outside="onInteractOutside"
      >
        <DrawerHandle
          v-if="!hideHandle"
          class="DrawerKnob"
        />
        <DrawerClose
          v-if="!hideClose"
          as-child
        >
          <UiButton
            class="DrawerClose"
            icon="close"
            variant="ghost"
            aria-label="Close"
          />
        </DrawerClose>
        <div>
          <header
            v-if="showTitle || showDescription || $slots?.title || $slots?.description"
            class="DrawerHeader"
          >
            <DrawerTitle
              v-if="showTitle || $slots?.title"
              class="DrawerTitle"
            >
              <slot name="title">
                {{ title }}
              </slot>
            </DrawerTitle>
            <DrawerDescription
              v-if="showDescription || $slots?.description"
              class="DrawerDescription"
            >
              <slot name="description">
                {{ description }}
              </slot>
            </DrawerDescription>
          </header>
          <VisuallyHidden v-if="!showTitle">
            <DrawerTitle class="DrawerTitle">
              {{ title }}
            </DrawerTitle>
          </VisuallyHidden>
          <VisuallyHidden v-if="!showDescription">
            <DrawerDescription class="DrawerDescription">
              {{ description }}
            </DrawerDescription>
          </VisuallyHidden>

          <slot name="default" />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import type { DrawerRootEmits, DrawerRootProps } from 'reka-ui'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  useForwardPropsEmits,
  VisuallyHidden,
} from 'reka-ui'

defineOptions({ name: 'UiDrawer', inheritAttrs: false })

const props = withDefaults(defineProps<{
  disabled?: boolean
  title?: string
  description?: string
  autoHeight?: boolean
  showTitle?: boolean
  showDescription?: boolean
  hideHandle?: boolean
  hideClose?: boolean
  inset?: boolean
} & DrawerRootProps>(), {
  modal: true,
  swipeDirection: 'down',
  autoHeight: true,
})

const emits = defineEmits<DrawerRootEmits & { closeComplete: [] }>()

// Non-modal drawers stay open while the user interacts with the rest of the page.
function onInteractOutside(event: Event) {
  if (!props.modal)
    event.preventDefault()
}

// reka's own `update:openComplete` never reaches wrappers (v2.10 — its
// animation-end listener loses the race with the exit unmount), so watch the
// element directly and emit `closeComplete` when the exit animation finishes.
const content = useTemplateRef<{ $el: HTMLElement }>('content')

watch(() => props.open, (open) => {
  if (open !== false)
    return

  const el = content.value?.$el
  let done = false
  let timer: number | undefined

  const finish = () => {
    if (done)
      return
    done = true
    window.clearTimeout(timer)
    el?.removeEventListener('animationend', onEnd)
    el?.removeEventListener('transitionend', onEnd)
    emits('closeComplete')
  }
  function onEnd(event: Event) {
    if (event.target === el)
      finish()
  }

  if (!el) {
    finish()
    return
  }
  // Safety net in case no exit animation runs at all
  timer = window.setTimeout(finish, 600)
  el.addEventListener('animationend', onEnd)
  el.addEventListener('transitionend', onEnd)
})

const forwardedPropsEmits = useForwardPropsEmits(
  computed(() => ({
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal,
    swipeDirection: props.swipeDirection,
    snapPoints: props.snapPoints,
    snapPoint: props.snapPoint,
    defaultSnapPoint: props.defaultSnapPoint,
    snapToSequentialPoints: props.snapToSequentialPoints,
  })),
  emits,
)

// `closeComplete` is this wrapper's own emit — keep it away from DrawerRoot.
const forwarded = computed(() => {
  const { onCloseComplete: _ignored, ...rest } = unref(forwardedPropsEmits) as Record<string, unknown>
  return rest
})
</script>

<style lang="postcss">
/* Keyframes animate `translate`, not `transform`, so they compose with the inline `transform` carrying the live drag offset instead of clobbering it. */
@keyframes drawerOverlayIn {
  from {
    opacity: 0;
  }
}
@keyframes drawerOverlayOut {
  to {
    opacity: 0;
  }
}
/* --drawer-inset (set by the .inset variant, 0 otherwise) makes an inset
   drawer travel its edge gap too, so it fully leaves the viewport. */
@keyframes drawerSlideDownIn {
  from {
    translate: 0 calc(100% + var(--drawer-inset, 0px));
  }
}
@keyframes drawerSlideDownOut {
  to {
    translate: 0 calc(100% + var(--drawer-inset, 0px));
  }
}
@keyframes drawerSlideUpIn {
  from {
    translate: 0 calc(-100% - var(--drawer-inset, 0px));
  }
}
@keyframes drawerSlideUpOut {
  to {
    translate: 0 calc(-100% - var(--drawer-inset, 0px));
  }
}
@keyframes drawerSlideLeftIn {
  from {
    translate: calc(-100% - var(--drawer-inset, 0px)) 0;
  }
}
@keyframes drawerSlideLeftOut {
  to {
    translate: calc(-100% - var(--drawer-inset, 0px)) 0;
  }
}
@keyframes drawerSlideRightIn {
  from {
    translate: calc(100% + var(--drawer-inset, 0px)) 0;
  }
}
@keyframes drawerSlideRightOut {
  to {
    translate: calc(100% + var(--drawer-inset, 0px)) 0;
  }
}
@keyframes drawerSnapSlideIn {
  from {
    translate: 0 var(--unit-100vh, 100dvh);
  }
}
@keyframes drawerSnapSlideOut {
  to {
    translate: 0 var(--unit-100vh, 100dvh);
  }
}

.DrawerOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--black-a6);
  backdrop-filter: blur(8px);
  cursor: pointer;

  &[data-state='open'] {
    animation: drawerOverlayIn 200ms ease-out;
  }
  &[data-state='closed'] {
    animation: drawerOverlayOut 200ms ease-out;
  }
}

.Drawer {
  position: fixed;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  color: var(--text-color);
  background-color: var(--bg-color);
  outline: none !important;
  overscroll-behavior: contain;
  transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;

  /* Silence the transition during drag so the sheet tracks the pointer. Don't touch `animation` — toggling it restarts the enter keyframe on release. */
  &[data-swiping] {
    transition-duration: 0ms;
    user-select: none;
  }

  & > div {
    width: 100%;
    height: 100%;
  }

  &.up,
  &.down {
    left: 0;
    right: 0;
    align-items: center;
    transform: translateY(var(--drawer-swipe-movement-y, 0px));

    .DrawerKnob {
      width: 48px;
      height: 4px;
      margin: 12px auto;
    }
  }

  &.left,
  &.right {
    top: 0;
    bottom: 0;
    width: 50%;
    min-width: 300px;
    max-width: 480px;
    transform: translateX(var(--drawer-swipe-movement-x, 0px));
    @media (max-width: 768px) {
      width: 100%;
      min-width: auto;
      max-width: auto;
    }
    .DrawerKnob {
      display: none;
    }

    & > div {
      max-height: 100%;
      margin: auto;
      overflow-y: auto;
    }
  }

  &.up {
    top: 0;
    flex-direction: column-reverse;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    box-shadow: 0px 4px 6px var(--black-a2);

    &[data-state='open'] {
      animation: drawerSlideUpIn 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    &[data-state='closed'] {
      animation: drawerSlideUpOut 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    .DrawerClose {
      bottom: 4px;
      right: 4px;
    }
  }

  &.left {
    left: 0;
    flex-direction: row-reverse;
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    box-shadow: 4px 0px 6px var(--black-a2);

    &[data-state='open'] {
      animation: drawerSlideLeftIn 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    &[data-state='closed'] {
      animation: drawerSlideLeftOut 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    .DrawerClose {
      top: 4px;
      right: 4px;
    }
  }

  &.right {
    right: 0;
    border-bottom-left-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    box-shadow: -4px 0px 6px var(--black-a2);

    &[data-state='open'] {
      animation: drawerSlideRightIn 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    &[data-state='closed'] {
      animation: drawerSlideRightOut 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    .DrawerClose {
      top: 4px;
      right: 4px;
    }
  }

  &.down {
    bottom: 0;
    flex-direction: column;
    align-items: center;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    box-shadow: 0px -4px 6px var(--black-a2);

    &[data-state='open'] {
      animation: drawerSlideDownIn 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    &[data-state='closed'] {
      animation: drawerSlideDownOut 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    .DrawerClose {
      top: 4px;
      right: 4px;
    }
    /* allow scrolling */
    & > div {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  /* Inset variant: 32px gap from viewport edges, dialog-like framing.
     Side drawers anchor to the bottom and hug their content (autoHeight). */
  &.inset {
    --drawer-inset: 32px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);

    &.left,
    &.right {
      inset-block: auto 32px;
      max-height: calc(var(--unit-100vh) - 64px);
      overflow-y: auto;
    }

    &.right {
      right: 32px;
    }

    &.left {
      left: 32px;
    }

    &.up {
      top: 32px;
      right: 32px;
      left: 32px;
    }

    &.down {
      right: 32px;
      bottom: 32px;
      left: 32px;
    }
  }

  /* Fill the viewport so reka measures full height, then the snap-point offset slides the sheet down to the active snap point */
  &.snap {
    height: var(--unit-100vh, 100dvh);
    max-height: var(--unit-100vh, 100dvh);
    overflow: visible;
    transform: translateY(max(0px, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px))));

    &[data-state='open'] {
      animation: drawerSnapSlideIn 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    &[data-state='closed'] {
      animation: drawerSnapSlideOut 450ms cubic-bezier(0.32, 0.72, 0, 1);
    }
  }

  &:focus-visible {
    outline: none;
  }

  .DrawerHeader {
    min-height: 62px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px;
    .DrawerTitle {
      font-weight: var(--bold);
    }
  }
}

.DrawerKnob {
  position: absolute;
  flex-shrink: 0;
  width: 36px;
  height: 4px;
  margin: 8px auto;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-round);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.DrawerClose {
  position: absolute;
}
</style>
