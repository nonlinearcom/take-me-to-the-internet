<template>
  <div class="ui-input">
    <input
      :id="inputId"
      ref="input"
      :name
      :value="modelValue"
      :type
      :required
      :placeholder
      :class="[variant, { padded, leading: isLeading, trailing: isTrailing }]"
      v-bind="$attrs"
      :disabled
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    >
    <slot name="default" />

    <span
      v-if="icon || slots.leading"
      class="leading__wrapper"
    >
      <slot
        name="leading"
        :disabled
      >
        <UiIcon
          v-if="icon"
          :name="icon"
        />
      </slot>
    </span>

    <span
      v-if="slots.trailing"
      class="trailing__wrapper"
    >
      <slot
        name="trailing"
        :disabled
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { defu } from 'defu'

defineOptions({ name: 'UiInput', inheritAttrs: false })
const props = withDefaults(defineProps<Input>(), {
  type: 'text',
  required: false,
  disabled: false,
  autofocus: false,
  autofocusDelay: 100,
  padded: true,
  color: 'gray',
  variant: 'outline',
})
const emit = defineEmits(['update:modelValue', 'blur'])
const slots = useSlots()

const { emitFormBlur, emitFormInput, inputId, name } = useFormGroup(props)

const isLeading = computed(() => props.icon || slots.leading)
const isTrailing = computed(() => slots.trailing)

const input = ref<HTMLInputElement | null>(null)
function autoFocus() {
  if (props.autofocus)
    input.value?.focus()
}

const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false, lazy: false, number: false }))
function updateInput(value: string) {
  if (modelModifiers.value.trim)
    value = value.trim()
  if (modelModifiers.value.number || props.type === 'number')
    value = looseToNumber(value)

  emit('update:modelValue', value)
  emitFormInput()
}

function onInput(event: Event) {
  if (!modelModifiers.value.lazy)
    updateInput((event.target as HTMLInputElement).value)
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.value.lazy)
    updateInput(value)
  if (modelModifiers.value.trim)
    (event.target as HTMLInputElement).value = value.trim()
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emit('blur', event)
}

function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})
</script>

<script lang="ts">
export const inputType = ['text', 'number', 'file'] as const

export type InputType = typeof inputType[number]
export type InputVariant = 'outline' | 'clear'
export interface Input {
  modelValue?: string | number
  type?: InputType | string
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  icon?: string
  padded?: boolean
  variant?: InputVariant
  modelModifiers?: { trim?: boolean, lazy?: boolean, number?: boolean }
}
</script>

<style lang="postcss">
.ui-input {
  position: relative;
  font-size: var(--text-small);

  input {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    color: var(--text-secondary);
    line-height: 1;
    appearance: none;

    &::placeholder {
      color: var(--border-color);
    }

    &:is(:disabled, [disabled]) {
      cursor: not-allowed;
      opacity: 0.75;
    }

    &:focus {
      outline: 1px solid var(--border-color);
    }

    &.padded {
      min-height: 38px;
      padding: 8px 12px;
    }

    &[type='file']::file-selector-button {
      margin-right: 12px;
      color: var(--border-color);
      font-weight: 500;
      background-color: transparent;
      border: 0;
      padding: 0;
      outline: none;
    }

    &.leading {
      padding-inline-start: 40px;
    }

    &.trailing {
      padding-inline-end: 40px;
    }

    &.outline {
      background-color: transparent;
      border-color: var(--border-color);
    }

    &.clear {
      background-color: var(--bg-color);
    }
  }

  & > span {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: 4px;
    padding-right: 4px;

    .ui-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
    }
  }

  .leading__wrapper {
    left: 0;
  }

  .trailing__wrapper {
    right: 0;
  }
}
</style>
