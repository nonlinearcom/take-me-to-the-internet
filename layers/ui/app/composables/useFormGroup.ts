import type { UseEventBusReturn } from '@vueuse/core'
import type { FormEvent, FormEventType } from '~/components/ui/Form.vue'
import type { InjectedFormGroupValue } from '~/components/ui/FormGroup.vue'
import { useDebounceFn } from '#imports'

interface InputProps {
  id?: string
  name?: string
  eagerValidation?: boolean
  legend?: string | null
}

export function useFormGroup(inputProps?: InputProps) {
  const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
  const formGroup = inject<InjectedFormGroupValue | undefined>('form-group', undefined)
  const formInputs = inject<any>('form-inputs', undefined)

  if (formGroup) {
    if (inputProps?.id)
      formGroup.inputId.value = inputProps?.id
    if (formInputs)
      formInputs.value[formGroup.name.value] = formGroup.inputId.value
  }

  const blurred = ref(false)

  function emitFormEvent(type: FormEventType, path: string) {
    if (formBus)
      formBus.emit({ type, path })
  }

  function emitFormBlur() {
    emitFormEvent('blur', formGroup?.name.value as string)
    blurred.value = true
  }

  function emitFormChange() {
    emitFormEvent('change', formGroup?.name.value as string)
  }

  const emitFormInput = useDebounceFn(() => {
    if (blurred.value || formGroup?.eagerValidation.value)
      emitFormEvent('input', formGroup?.name.value as string)
  }, 300)

  return {
    inputId: computed(() => inputProps?.id ?? formGroup?.inputId.value),
    name: computed(() => inputProps?.name ?? formGroup?.name.value),
    emitFormBlur,
    emitFormInput,
    emitFormChange,
  }
}
