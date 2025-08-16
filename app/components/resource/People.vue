<template>
  <ul class="people-list">
    <li
      v-for="person in people"
      :key="person.people_id.id"
    >
      {{ person.people_id.name }}
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
    img {
      border-radius: 50%;
      width: 36px;
    }
  }
}
</style>
