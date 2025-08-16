<template>
  <ul class="people-list">
    <li
      v-for="person in people"
      :key="person.people_id.id"
    >
      <NuxtLink
        v-if="person.people_id.link"
        class="person-link"
        :to="person.people_id.link"
        target="_blank"
      >
        {{ person.people_id.name }}
        <UiIcon
          name="external-link"
          size="sm"
        />
      </NuxtLink>
      <span v-else>
        {{ person.people_id.name }}
      </span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{
  people: { people_id: Person }[]
}>()
</script>

<style lang="postcss">
.people-list {
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--text-small);
    .person-link {
      display: flex;
      align-items: center;
      gap: 4px;
      &:hover {
        text-decoration: underline;
      }
    }
    img {
      border-radius: 50%;
      width: 36px;
    }
  }
}
</style>
