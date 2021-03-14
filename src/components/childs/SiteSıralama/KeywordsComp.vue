<template>
  <div class="mx-4 pb-0 pt-4" style="overflow:scroll;">
    <pre>
      <label>İçerik & Frekanslar:</label>
      <v-row no-gutters>
        <div
            v-for="(freq, i) in frequencyList"
            :key="i"
            class="mr-4">
          <v-badge offset-x="15"
                   :content="freq.size"
                   :value="freq.size"
                   color="#f74f60"
                   overlap>
            <code class="code-semantics" :class="(i===0||i === 1 || i === 2) ? 'black--text': 'white--text'"
                  :style="`background-color:${getColors(i)} !important;`">{{freq.text}}</code>
          </v-badge>
        </div>
      </v-row>
    </pre>
  </div>
</template>

<script>
export default {
  name: "KeywordsComp",
  props: {
    frequencyList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    getColors: function(i) {
      switch (i) {
        case 0:
          return "#FFD700";
        case 1:
          return "#C0C0C0";
        case 2:
          return "#cd7f32";
        default:
          return "#7a8add";
      }
    }
  }
};
</script>

<style scoped></style>
