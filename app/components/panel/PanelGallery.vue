<template>
  <section>
    <template
      v-for="item in gallery"
      :key="item.media"
    >
      <PanelGalleryVideo
        v-if="item.type === 'video'"
        :item="item"
      />
      <PanelGalleryImage
        v-else
        :item="item"
      />
    </template>
  </section>
</template>

<script>
export default {
  props: {
    gallery: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
