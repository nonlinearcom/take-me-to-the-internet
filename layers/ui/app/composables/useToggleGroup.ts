import type { ComputedRef, InjectionKey } from 'vue'

type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export const toggleGroupInjectionKey: InjectionKey<ComputedRef<{
  // variant?: ButtonVariant
  size?: ButtonSize
  // orientation: ButtonGroupProps['orientation']
  // rounded?: boolean
}>> = Symbol('nuxt-u.toggle-group')

interface Props<T> {
  // rounded?: boolean // GetObjectField<T, 'rounded'>
  size?: ButtonSize
  // variant?: ButtonVariant
}

export function useToggleGroup<T>(props: Props<T>) {
  const toggleGroup = inject(toggleGroupInjectionKey, undefined)
  return {
    // rounded: computed(() => props?.rounded ?? toggleGroup?.value.rounded),
    size: computed(() => props?.size ?? toggleGroup?.value.size),
    // variant: computed(() => props?.variant ?? toggleGroup?.value.variant),
  }
}
