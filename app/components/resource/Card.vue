<template>
  <article class="resource-card">
    <header>
      <h1 class="resource-title">
        {{ resource.title }}
      </h1>
      <h2
        v-if="resource.subtitle"
        class="resource-title"
      >
        {{ resource.subtitle }}
      </h2>
    </header>
    <NuxtImg
      v-if="resource.cover"
      class="cover"
      :src="resource.cover"
      :width="400"
      fit="inside"
      format="auto"
      :alt="resource.title"
    />

    <main>
      <div
        v-if="resource.description"
        class="description"
        v-html="resource.description"
      />

      <dl class="meta">
        <div
          v-if="resource.people?.length"
          class="col col-authors"
        >
          <dt>{{ resource.people.length === 1 ? 'AUTHOR:' : 'AUTHORS:' }}</dt>
          <dd>
            <ResourcePeople :people="resource.people" />
          </dd>
        </div>

        <div
          v-if="taxonomies.length"
          class="col col-taxonomies"
        >
          <dt>TYPE:</dt>
          <dd>
            <UiButton
              v-if="resource.type"
              :label="resource.type"
              class="tag"
              variant="link"
              :padded="false"
              size="sm"
              @click="emit('selectFilter', { kind: 'type', value: resource.type })"
            />
          </dd>
          <dt>YEAR:</dt>
          <dd>{{ resource.year }}</dd>
          <template
            v-for="{ kind, label, items } in taxonomies"
            :key="kind"
          >
            <dt>{{ label }}</dt>
            <dd>
              <UiButton
                v-for="item in items"
                :key="item.id"
                class="tag"
                :label="item.title"
                variant="link"
                :padded="false"
                size="sm"
                @click="emit('selectFilter', { kind, value: item.title })"
              />
            </dd>
          </template>
        </div>
      </dl>

      <UiButton
        v-if="resource.link"
        class="resource-link"
        :label="resource.title"
        icon="external-link"
        variant="secondary"
        :to="resource.link"
        target="_blank"
        size="md"
        block
      />
    </main>
  </article>
</template>

<script lang="ts" setup>
const props = defineProps<{
  resource: Resource
}>()
const emit = defineEmits<{
  (e: 'selectFilter', payload: { kind: 'topics' | 'tags' | 'type', value: string }): void
}>()

// topics and tags render the same way; deleted relations leave nulls behind
const taxonomies = computed(() => [
  { kind: 'topics' as const, label: 'TOPICS:', items: props.resource.topics?.map(({ topics_id }) => topics_id).filter(Boolean) ?? [] },
  { kind: 'tags' as const, label: 'TAGS:', items: props.resource.tags?.map(({ tags_id }) => tags_id).filter(Boolean) ?? [] },
].filter(({ items }) => items.length))
</script>

<style lang="postcss">
.resource-card {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: var(--app-margin-small);
  gap: var(--text);

  header {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 0px;
    font-size: var(--text-large);
    margin-bottom: 64px;
    .resource-title {
      margin-bottom: 0px !important;
      line-height: 1.2;
    }
  }

  .cover {
    width: 200px;
    height: auto;
    border-radius: 4px;
  }

  .description {
    grid-column: 2 / -1;
    max-width: 70ch;
    font-size: var(--text-small);
  }

  .resource-link {
    grid-column: 2 / -1;
  }

  .meta {
    grid-column: 2 / -1;
    margin: 16px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    .col {
      display: grid;
      grid-template-columns: 72px 1fr;
      align-items: baseline;
      gap: 6px;
    }

    dt {
      font-size: var(--text-mini);
      color: var(--text-secondary);
      padding-right: 8px;
      width: auto;
    }
    dd {
      font-size: var(--text-small);
      display: flex;
      flex-wrap: wrap;
      line-height: 1.4;
    }

    .tag:hover span {
      text-decoration: underline;
    }
    /* Make tags adopt the same line-height as the surrounding text */
    .tag.ui-button {
      line-height: 1.4;
    }
    /* Add a comma after every tag except the last (avoids leading commas on wrapped lines) */
    .tag:not(:last-child)::after {
      content: ',';
      display: inline-block;
      margin-left: -4px; /* space from previous tag */
      margin-right: 6px; /* space before next tag */
    }
  }

  @media (max-width: 1280px) {
    width: 100%;
    .meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
