import type { NuxtLinkProps } from 'nuxt/app'

export interface Link extends NuxtLinkProps {
  as?: string
  type?: string
  underline?: boolean
  disabled?: boolean
  active?: boolean
  exact?: boolean
  exactQuery?: boolean
  exactHash?: boolean
}

// Single size definition - reused across components
export const buttonSize = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export const buttonVariant = ['primary', 'secondary', 'accent', 'outline', 'soft', 'ghost', 'link'] as const

declare global {
  type ButtonSize = typeof buttonSize[number]
  type ButtonVariant = typeof buttonVariant[number]
}

export interface Button extends Link {
  type?: string
  block?: boolean
  label?: string | null
  disabled?: boolean
  padded?: boolean
  rounded?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  icon?: string | null
  to?: string | object
  target?: string
  square?: boolean
  truncate?: boolean
  invertIcon?: boolean
  loading?: boolean
  ariaLabel?: string
}

export interface Avatar {
  as?: string
  src?: string
  alt?: string
  icon?: string | null
  size?: ButtonSize
  fallback?: string
  seed?: string
  gradient?: boolean
}

export interface Toast {
  id: string | number
  title?: string
  description?: string
  open?: boolean
  type?: 'foreground' | 'background'
  duration?: number
}
