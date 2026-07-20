declare interface Resource {
  id: number
  title: string
  subtitle?: string
  slug: string
  year: number
  type: 'Article' | 'Book' | 'Podcast' | 'Talk' | 'Website' | 'Documentary' | 'Exhibition' | 'Tutorial' | 'Interview' | 'Newsletter' | string
  link: string
  open: boolean
  description?: string
  cover?: string
  people: { people_id: Person }[] // Nested relationship
  tags?: { tags_id: Tag }[] // Nested relationship
  topics?: { topics_id: Topic }[] // Nested relationship
}

declare type ResourceSortKey = keyof Resource | 'author'

declare interface Person {
  id: number
  status: 'published' | 'draft'
  name: string
  description?: string
  picture?: string // UUID of the image
  link?: string
  resources: { resources_id: Resource }[]
};

declare interface Tag {
  id: number
  status: 'published' | 'draft'
  title: string
  slug: string
  resources: { resources_id: Resource }[]
};

declare interface Topic {
  id: number
  status: 'published' | 'draft'
  sort?: number
  title: string
  slug: string
  description?: string
  parent_topic?: number
  resources: { resources_id: Resource }[]
};

declare interface GlossaryItem {
  id: number
  slug: string
  date_created: string
  date_updated: string
  translations: GlossaryTranslation[]
  related_terms?: GlossaryRelatedTerm[]
};

declare interface GlossaryRelatedTerm {
  related_glossary_id: number
}

declare interface GlossaryTranslation {
  id: number
  languages_code: string
  term: string
  description: any
}

declare interface Page {
  id: number
  slug: string
  date_updated: string
  translations: PageTranslation[]
}

declare interface PageTranslation {
  languages_code: string
  title: string
  content: any // Or a more specific type for tiptap content
  editor_nodes: any[]
}
