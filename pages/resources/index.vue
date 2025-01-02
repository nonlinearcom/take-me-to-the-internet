<template>
  <article class="resources-page">
    <table class="resources-table">
      <thead v-if="headers">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in resourcesData"
          :key="index"
        >
          <td>
            <NuxtLink
              :to="item.link"
              target="_blank"
            >
              {{ item.title }}
            </NuxtLink>
          </td>
          <td>{{ item.type }}</td>
          <td>{{ item.year }}</td>
          <td>
            <UiDialog
              v-for="author in item.people"
              :key="author.people_id.name"
              title="Dialog title"
            >
              <template #trigger>
                <UiButton
                  variant="ghost"
                  :label="author.people_id.name"
                />
              </template>
              Dialog test
            </UiDialog>
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()

interface Resource {
  id: number
  title: string
  slug: string
  year: number
  type: string
  link: string
  description?: string
  cover?: string
  people: { people_id: { name: string } }[]
  tags?: { tags_id: { title: string } }[]
  topics?: { topics_id: { title: string } }[]
}

const { data: resourcesData } = await useAsyncData('resources', () => {
  return $directus.request<Resource[]>(
    $readItems('resources', {
      filter: {
        status: {
          _neq: 'draft',
        },
      },
      fields: [
        '*',
        'people.people_id.name',
        'tags.tags_id.title',
        'topics.topics_id.title',
      ],
    }),
  )
})

const headers = false // ['link', 'title', 'type', 'year']
</script>

<style lang="postcss" scoped>
.resources-page {
  display: flex;
  flex-direction: column;
}

table.resources-table {
  button {
    font-size: inherit !important;
  }
  td {
    vertical-align: middle;
  }
}
</style>
