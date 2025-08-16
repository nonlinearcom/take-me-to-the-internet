<template>
  <article class="resource-card">
    <span>
      <div class="chips">
        <UiChip
          v-if="resource.type"
          :label="resource.type"
          variant="outline"
          size="xs"
          as="button"
          @click="emit('selectFilter', { kind: 'type', value: resource.type })"
        />
        <UiChip
          v-if="resource.year"
          :label="String(resource.year)"
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
      :src="`${resource.cover}?fit=inside&width=400&format=auto&withoutEnlargement=true`"
      :alt="resource.title"
    />

    <main
      v-if="resource.description"
      class="description"
      v-html="resource.description"
    />

    <ResourcePeople :people="resource.people" />

    <dl class="meta">
      <template v-if="resource.topics && resource.topics.length">
        <dt>TOPICS</dt>
        <dd>
          <UiButton
            v-for="({ topics_id }) in resource.topics.filter(({ topics_id }) => topics_id)"
            :key="topics_id.id"
            class="tag"
            :label="topics_id.title"
            variant="link"
            :padded="false"
            size="xs"
            @click="emit('selectFilter', { kind: 'topics', value: topics_id.title })"
          />
        </dd>
      </template>
      <template v-if="resource.tags && resource.tags.length">
        <dt>TAGS</dt>
        <dd>
          <UiButton
            v-for="({ tags_id }) in resource.tags.filter(({ tags_id }) => tags_id)"
            :key="tags_id.id"
            class="tag"
            :label="tags_id.title"
            variant="link"
            :padded="false"
            size="xs"
            @click="emit('selectFilter', { kind: 'tags', value: tags_id.title })"
          />
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
  </article>
</template>

<script lang="ts" setup>
const props = defineProps<{
  resource: Resource
}>()
const emit = defineEmits<{
  (e: 'selectFilter', payload: { kind: 'topics' | 'tags' | 'type', value: string }): void
}>()
</script>

<style lang="postcss">
.resource-card {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 50vw;
  padding: var(--app-margin-small);
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
    width: 200px;
    height: auto;
    border-radius: 4px;
  }

  .description {
    max-width: 70ch;
    font-size: var(--text-small);
  }

  .meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    font-size: var(--text-mini);
    color: var(--text-secondary);
    dt {
      color: var(--text-color);
    }
    dd {
      display: flex;
      flex-wrap: wrap;
    }

    .tag:hover {
      text-decoration: underline;
    }
    .tag ~ .tag::before {
      content: ', ';
    }
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
}
</style>
