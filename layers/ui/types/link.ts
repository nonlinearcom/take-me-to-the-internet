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
