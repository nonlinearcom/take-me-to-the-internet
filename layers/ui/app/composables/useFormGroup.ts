interface InputProps {
  id?: string
  name?: string
  eagerValidation?: boolean
  legend?: string | null
}

// No Form/FormGroup provider exists anywhere in the app, so the form-event bus
// is inert. This keeps the inputId/name derivation and the no-op blur/input
// hooks that Input.vue calls, without the broken cross-component type imports
// and unreachable injection branch.
export function useFormGroup(inputProps?: InputProps) {
  function emitFormBlur() {}
  function emitFormInput() {}

  return {
    inputId: computed(() => inputProps?.id),
    name: computed(() => inputProps?.name),
    emitFormBlur,
    emitFormInput,
  }
}
