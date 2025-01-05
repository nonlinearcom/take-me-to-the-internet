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
            <span>

              <UiDialog
                side="right"
                :aria-label="`Resource ${item.title}`"
              >
                <template #trigger>
                  <UiButton
                    variant="ghost"
                    :label="item.title"
                  />
                </template>
                <ResourceCard :resource="item" />
              </UiDialog>

              <UiButton
                icon="external-link"
                variant="ghost"
                size="sm"
                :to="item.link"
                target="_blank"
              />
            </span>
          </td>
          <td>{{ item.type }}</td>
          <td>{{ item.year }}</td>
          <td>
            <UiDialog
              v-for="author in item.people"
              :key="author.people_id.name"
              :title="author.people_id.name"
              :description="author.people_id.description"
            >
              <template #trigger>
                <UiButton
                  variant="ghost"
                  :label="author.people_id.name"
                />
              </template>
              <PeopleCard :author=" author.people_id" />
            </UiDialog>
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
const { $directus, $readItems } = useNuxtApp()

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
        'people.people_id.*',
        'tags.tags_id.title',
        'tags.tags_id.slug',
        'topics.topics_id.title',
        'topics.topics_id.slug',
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
