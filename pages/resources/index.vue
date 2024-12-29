<template>
  <main class="resources-page">
    <h1>Resources</h1>

    <h3>filters...</h3>

    <table>
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
            <template v-for="author in item.people">
              {{ author.people_id.name }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
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
  min-height: 100vh;
}

table {
  border-collapse: collapse;
  width: 100%;
}

thead {
}

th,
td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
}
</style>
