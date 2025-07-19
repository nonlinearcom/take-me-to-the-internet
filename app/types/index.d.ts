declare interface Resource {
  id: number
  title: string
  slug: string
  year: number
  type: 'Article' | 'Book' | 'Podcast' | 'Talk' | 'Website' | string
  link: string
  open: boolean
  description?: string
  cover?: string
  people: { people_id: Person }[] // Nested relationship
  tags?: { tags_id: Tag }[] // Nested relationship
  topics?: { topics_id: Topic }[] // Nested relationship
}

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
  translations: { translation_id: any }[]
};

// declare interface GlossaryTranslation {
//   id: number
//   language_code: string
//   term: string
//   description: string
// }
