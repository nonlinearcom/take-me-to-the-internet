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
            <span class="resource">
              <UiButton
                icon="external-link"
                variant="ghost"
                padded
                size="sm"
                :to="item.link"
                target="_blank"
              />
              <UiDialog
                side="right"
                :aria-label="`Resource ${item.title}`"
              >
                <template #trigger>
                  <UiButton
                    variant="ghost"
                    size="sm"
                    padded
                    :label="item.title"
                  />
                </template>
                <ResourceCard :resource="item" />
              </UiDialog>

            </span>
          </td>
          <td>{{ item.type }}</td>
          <td>{{ item.year }}</td>
          <td>
            <UiDialog
              v-for="author in item.people"
              :key="author.people_id.name"
            >
              <template #trigger>
                <UiButton
                  class="author"
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
        'people.people_id.*.resources_id.title',
        'people.people_id.*.resources_id.link',
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
  .resource {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .author {
    z-index: 20;
  }
}
</style>
