// Vue types will be auto-imported by Nuxt

declare type UUID = string

declare interface RelationNodeAttrs {
  id: UUID | null
  junction: string | null
  collection: string | null
}

declare type RelationNodeSerializers<T> = {
  collection: string
  component: T
}[]

declare type RelationNodeProps = RelationNodeAttrs & {
  data?: Record<string, any> | null
}

declare type RelationBlockSerializers<T> = RelationNodeSerializers<T>
declare type RelationBlockProps = RelationNodeProps

declare type VueRelationNodeSerializers = RelationNodeSerializers<any>

// TODO: [Stage 2][deprecated] type VueRelationBlockSerializers
declare type VueRelationBlockSerializers = VueRelationNodeSerializers
