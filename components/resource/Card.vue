<template>
  <Article class="resource-card">
    <span>
      <div class="chips">
        <UiChip
          v-if="resource.type"
          :label="resource.type"
          variant="outline"
          size="xs"
        />
        <UiChip
          v-if="resource.year"
          :label="resource.year"
          variant="outline"
          size="xs"
        />
      </div>
      <h1 class="title">
        {{ resource.title }}
      </h1>
    </span>

    <NuxtImg
      v-if="resource.cover"
      class="cover"
      :src="`${resource.cover}?fit=inside&width=800&height=800&format=auto&withoutEnlargement=true`"
      :alt="resource.title"
    />

    <p
      v-if="resource.description"
      class="description"
    >
      {{ resource.description }}
    </p>

    <ResourcePeople :people="resource.people" />

    <dl class="meta">
      <template v-if="resource.topics && resource.topics.length">
        <dt>TOPICS</dt>
        <dd>
          <NuxtLink
            v-for="topic in resource.topics"
            :key="topic.topics_id.id"
            class="tag"
            :to="`/topics/${topic.topics_id.slug}`"
          >
            {{ topic.topics_id.title }}
          </NuxtLink>
        </dd>
      </template>
      <template v-if="resource.tags && resource.tags.length">
        <dt>TAGS</dt>
        <dd>
          <NuxtLink
            v-for="tag in resource.tags"
            :key="tag.tags_id.id"
            class="tag"
            :to="`/tags/${tag.tags_id.slug}`"
          >
            {{ tag.tags_id.title }}
          </NuxtLink>
        </dd>
      </template>
    </dl>

    <UiButton
      v-if="resource.link"
      :label="resource.title"
      icon="external-link"
      variant="accent"
      :to="resource.link"
      target="_blank"
    />
  </Article>
</template>

<script lang="ts" setup>
const props = defineProps<{
  resource: Resource
}>()
</script>

<style lang="postcss">
.resource-card {
  display: flex;
  flex-direction: column;
  padding: 0 var(--app-margin-small);
  gap: var(--text);

  .title {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  }
  .chips {
    display: flex;
    gap: 2px;
  }
  .cover {
    max-width: 50%;
    height: auto;
  }

  .description {
    font-size: var(--text-small);
  }

  .meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    font-size: var(--text-mini);
    color: var(--text-secondary);
    dt {
      margin-bottom: 6px;
      color: var(--text-color);
    }
    .tag:hover {
      text-decoration: underline;
    }
    .tag ~ .tag::before {
      content: ', ';
    }
  }
}
</style>
