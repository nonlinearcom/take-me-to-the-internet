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
        <template v-if="resource.people && resource.people.length">
          <div class="col col-authors">
            <dt>{{ resource.people.length === 1 ? 'AUTHOR:' : 'AUTHORS:' }}</dt>
            <dd>
              <ResourcePeople :people="resource.people" />
            </dd>
          </div>
        </template>

        <template v-if="(resource.topics && resource.topics.length) || (resource.tags && resource.tags.length)">
          <div class="col col-taxonomies">
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
            <template v-if="resource.topics && resource.topics.length">
              <dt>TOPICS:</dt>
              <dd>
                <UiButton
                  v-for="({ topics_id }) in resource.topics.filter(({ topics_id }) => topics_id)"
                  :key="topics_id.id"
                  class="tag"
                  :label="topics_id.title"
                  variant="link"
                  :padded="false"
                  size="sm"
                  @click="emit('selectFilter', { kind: 'topics', value: topics_id.title })"
                />
              </dd>
            </template>
            <template v-if="resource.tags && resource.tags.length">
              <dt>TAGS:</dt>
              <dd>
                <UiButton
                  v-for="({ tags_id }) in resource.tags.filter(({ tags_id }) => tags_id)"
                  :key="tags_id.id"
                  class="tag"
                  :label="tags_id.title"
                  variant="link"
                  :padded="false"
                  size="sm"
                  @click="emit('selectFilter', { kind: 'tags', value: tags_id.title })"
                />
              </dd>
            </template>
          </div>
        </template>
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
</script>

<style lang="postcss">
.resource-card {
  display: grid;
  grid-template-columns: 1fr 2fr;
  /* height: 100vh; */
  /* width: 50vw; */
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
    /* margin-top: 64px; */
    /* margin-bottom: 16px; */
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
