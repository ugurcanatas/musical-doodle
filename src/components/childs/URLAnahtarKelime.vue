<template>
  <v-card>
    <v-card-title v-text="label" />
    <v-combobox label="Url giriniz" :rules="getDefaultRule"  :items="defaultComboItems" item-text="Text" item-value="Url"/>
  </v-card>
</template>

<script>
import {defaultRule} from "@/components/default_rules";

export default {
  name: "URLAnahtarKelime",
  props: {
    label: {
      required: false,
      type: String
    }
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule
    }
  },
  data () {
    return {
      defaultComboItems: [
        {Text: 'Google', Url: 'https://google.com'},
        {Text: 'Tesla', Url: 'https://tesla.com'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
