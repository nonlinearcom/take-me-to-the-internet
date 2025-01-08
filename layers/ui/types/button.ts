import type { Link } from './link'

export const buttonSize = ['xs', 'sm', 'lg', 'xl'] as const

declare global {
  type ButtonSize = typeof buttonSize[number]
  type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'soft' | 'ghost' | 'link'
}

export interface Button extends Link {
  type?: string
  block?: boolean
  label?: string
  disabled?: boolean
  padded?: boolean
  rounded?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  icon?: string
  invertIcon?: boolean
  to?: string | object
  target?: string
  square?: boolean
  truncate?: boolean
}
