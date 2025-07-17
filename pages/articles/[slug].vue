<template>
  <article
    v-if="page"
    class="page"
  >
    <ClientOnly>
      <header>
        <h1 class="title">
          {{ translation?.title }}
        </h1>
        <time
          class="updated-on"
          :datetime="page.date_updated.split('T')[0]"
        >
          Updated on {{ formatDate(page.date_updated, { locale: languageCode }) }}
        </time>
      </header>
      <EditorContent
        v-if="translation?.content"
        class="prose"
        :content="translation?.content"
        :relation-blocks
        :relation-inline-blocks
        :relation-marks
      />
      <EditorFootNotes
        v-if="translation?.content"
        class="prose"
        :data="translation?.content"
      />
    </ClientOnly>
  </article>
</template>

<script lang="ts" setup>
import { EditorCables, EditorCodeLink, EditorFootNotes, EditorGallery, EditorMedia, EditorSideNote } from '#components'
import { footerPages } from '~/assets/footerPages'

const relationBlocks: VueRelationNodeSerializers = [
  { collection: 'cables', component: EditorCables },
  { collection: 'gallery', component: EditorGallery },
  { collection: 'media', component: EditorMedia },

]
const relationInlineBlocks: VueRelationNodeSerializers = [
  { collection: 'code_link', component: EditorCodeLink },
]

const relationMarks: VueRelationNodeSerializers = [
  { collection: 'sidenote', component: EditorSideNote },
]

const route = useRoute()
if (footerPages.includes(route.params.slug as string))
  await navigateTo(`/${route.params.slug as string}`)

const { locale } = useI18n()
const languageCode = computed(() => {
  return locale.value === 'en' ? 'en-US' : 'it-IT'
})

const { $directus, $readItem } = useNuxtApp()
// const page = ref(
//   {
//     slug: 'working-with-api-in-cables',
//     status: 'published',
//     sort: 3,
//     user_created: 'a5a30640-aae3-4761-bdd2-cc69a6fda26c',
//     date_created: '2025-01-15T10:54:25.810Z',
//     user_updated: 'a5a30640-aae3-4761-bdd2-cc69a6fda26c',
//     date_updated: '2025-01-23T10:16:13.002Z',
//     translations: [
//       {
//         id: 13,
//         pages_slug: 'working-with-api-in-cables',
//         languages_code: 'en-US',
//         title: 'Getting data from the Are.na API',
//         content: {
//           type: 'doc',
//           content: [
//             {
//               type: 'paragraph',
//               attrs: {
//                 textAlign: 'left',
//               },
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Cables includes among its various nodes the operator ',
//                 },
//                 {
//                   type: 'relation-inline-block',
//                   attrs: {
//                     id: 'my-note-1',
//                     junction: 'pages_editor_nodes',
//                     collection: 'sidenote',
//                     data: {
//                       id: '1',
//                       noteHtml: ' Request a json file and output an object (ajax, url, json)<img src="" width="100%">',
//                       link: 'https://cables.gl/op/Ops.Json.HttpRequest_v3',
//                       linkText: 'HTTPRequest',
//                       title: 'What is an HTTP Request?',
//                     },
//                   },
//                 },
//                 {
//                   type: 'text',
//                   text: ' which simplifies the use of HTTP requests to communicate with external ',
//                 },
//                 {
//                   type: 'relation-inline-block',
//                   attrs: {
//                     id: 'my-note-2',
//                     junction: 'pages_editor_nodes',
//                     collection: 'sidenote',
//                     data: {
//                       id: '2',
//                       noteHtml: 'An API (short for Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. In other words, it is an interface that allows one application to access functionality or data provided by another application or service.',
//                       href: '/glossary/api',
//                       linkText: 'API',
//                     },
//                   },
//                 },
//                 {
//                   type: 'text',
//                   text: ' and servers.  In this article, we will explore how to use the operator to retrieve images from the',
//                 },
//                 {
//                   type: 'text',
//                   marks: [
//                     {
//                       type: 'link',
//                       attrs: {
//                         href: 'https://dev.are.na/documentation/channels',
//                         target: '_blank',
//                         rel: 'noopener noreferrer nofollow',
//                         class: null,
//                       },
//                     },
//                   ],
//                   text: ' Are.na',
//                 },
//                 {
//                   type: 'text',
//                   text: ' ',
//                 },
//                 {
//                   type: 'text',
//                   marks: [
//                     {
//                       type: 'link',
//                       attrs: {
//                         href: '/glossary/api',
//                         target: null,
//                         rel: 'noopener noreferrer nofollow',
//                         class: null,
//                       },
//                     },
//                   ],
//                   text: 'API',
//                 },
//                 {
//                   type: 'text',
//                   text: '.',
//                 },
//               ],
//             },
//           ],
//         },
//         editor_nodes: [
//           {
//             id: 'my-note-1',
//             pages_translations_id: 13,
//             collection: 'sidenote',
//             item: {
//               id: '1',
//               noteHtml: ' Request a json file and output an object (ajax, url, json)',
//               href: 'https://cables.gl/op/Ops.Json.HttpRequest_v3',
//               linkText: 'HTTPRequest',
//             },
//           },
//           {
//             id: 'my-note-2',
//             pages_translations_id: 13,
//             collection: 'sidenote',
//             item: {
//               id: '2',
//               noteHtml: 'An API (short for Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. In other words, it is an interface that allows one application to access functionality or data provided by another application or service.',
//               href: '/glossary/api',
//               linkText: 'API',
//               linkImage: 'https://www.akamai.com/site/it/images/article/2024/how-a-web-api-works.png',
//             },
//           },

//         ],
//       },
//     ],
//   },
// )

const { data: page } = await useAsyncData('page', () => {
  return $directus.request(
    $readItem('pages', route.params.slug as string, {
      fields: [
        '*',
        {
          translations: [
            '*',
            {
              editor_nodes: [
                '*',
                {
                  item: {
                    cables: ['*'],
                    code_link: ['*'],
                    sidenote: ['*'],
                    gallery: [
                      { content: ['*'] },
                    ],
                    media: [{ file: ['*'] }],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  )
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const translation = computed(() => {
  if (!page.value)
    return null

  // here we could also set a fallback language
  const translation = page.value?.translations?.find(t => t.languages_code === languageCode.value) || null
  if (!translation)
    return null

  injectDataIntoContent(translation.editor_nodes, translation.content)
  return translation
})

useHighlight()
</script>

<style lang="postcss" scoped>
.page {
  position: relative;
  padding: var(--app-margin-small);

  max-width: 65ch;
  margin: 0 auto;

  header {
    margin-bottom: 92px;

    .title {
      font-size: var(--text-large) !important;
      margin-bottom: 0 !important;
    }
    time {
      color: var(--text-secondary);
      font-size: var(--text-small);
    }
  }
}
</style>
