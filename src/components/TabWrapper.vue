<template>
  <v-row no-gutters>
    <v-col class="col-6 pa-2" v-for="(item,i) in layout" :key="i">
      <component :is="item.component" :label="item.label" />
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
}
</script>

<style scoped>

</style>
