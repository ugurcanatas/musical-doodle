<template>
  <div>
    <v-row class="align-center pt-4 px-4" no-gutters>
      <v-card-title class="pa-0">Anahtar Kelimeler</v-card-title>
      <v-spacer></v-spacer>
      <v-btn @click="isExpanded = !isExpanded" color="red" small fab icon
        ><v-icon>{{isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon></v-btn
      >
    </v-row>
    <v-lazy
      v-model="active"
      :options="{
        threshold: 0.5
      }"
      transition="fade-transition"
      min-height="0"
    >
      <div v-show="isExpanded">
        <v-card-text v-for="(freq, i) in frequencyList" :key="i" class="pb-0">
          <div>
            <pre><label>Kelime:</label>
                  <v-row no-gutters>
              <code class="code-single-text">{{ freq.text }}</code>
                  <code class="code-single-text ml-4">{{ freq.size }}</code>
                    </v-row>
                <v-divider class="mt-4"></v-divider>
              <label>Alakalı kelimeler:</label>
                <v-row no-gutters>
                <div class="mr-4" v-for="(obj, z) in freq.request"
                     :key="z">
                <code class="code-semantics" :style="`background-color:${getColors(obj)} !important;`">{{obj.term}}</code>
                  </div>
                  </v-row>
              </pre>
          </div>
        </v-card-text>
      </div>
    </v-lazy>
  </div>
</template>

<script>
export default {
  name: "SemanticKeywords",
  props: {
    frequencyList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      isExpanded: false,
      active: true
    };
  },
  methods: {
    getColors: function(obj) {
      const { similarity } = obj;
      switch (similarity) {
        case "100":
          return "#f83838";
        case "50":
          return "#f37b42";
        default:
          return "#de9d7f";
      }
    }
  }
};
</script>

<style scoped></style>
