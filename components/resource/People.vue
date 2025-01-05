<template>
  <ul class="people-list">
    <li
      v-for="person in people"
      :key="person.people_id.id"
    >
      <NuxtImg
        v-if="person.people_id.picture"
        class="cover"
        :src="`${person.people_id.picture}?fit=cover&width=200&height=200&format=auto&withoutEnlargement=true`"
        :alt="person.people_id.name"
      />
      {{ person.people_id.name }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{
  people: Person[]
}>()
</script>

<style lang="postcss">
.people-list {
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--text-small);
    img {
      border-radius: 50%;
      width: 36px;
    }
  }
}
</style>
