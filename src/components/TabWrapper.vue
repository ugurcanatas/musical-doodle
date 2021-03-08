<template>
  <v-row no-gutters>
    <v-col
      :class="$vuetify.breakpoint.name !== 'lg' ? 'col-12' : 'col-6'"
      class="pa-2"
      v-for="(item, i) in layout"
      :key="i"
    >
      <component :is="item.component" :component-item="item" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TabWrapper",
  props: {
    layout: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped></style>
