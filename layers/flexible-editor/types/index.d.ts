import type { Component } from 'vue'

export { }

declare global {
  type UUID = string

  interface RelationNodeAttrs {
    id: UUID | null
    junction: string | null
    collection: string | null
  }

  type RelationNodeSerializers<T> = {
    collection: string
    component: T
  }[]

  type RelationNodeProps = RelationNodeAttrs & {
    data?: Record<string, any> | null
  }

  type RelationBlockSerializers<T> = RelationNodeSerializers<T>
  type RelationBlockProps = RelationNodeProps

  type VueRelationNodeSerializers = RelationNodeSerializers<Component>

  // TODO: [Stage 2][deprecated] type VueRelationBlockSerializers
  type VueRelationBlockSerializers = VueRelationNodeSerializers
}
