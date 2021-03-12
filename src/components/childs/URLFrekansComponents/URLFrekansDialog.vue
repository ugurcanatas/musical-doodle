<template>
  <v-lazy
    v-model="isActive"
    :options="{
      threshold: 0.5
    }"
    min-height="300"
    transition="fade-transition"
  >
    <v-card elevation="6" style="overflow-y: scroll !important;">
      <v-overlay absolute :value="overlayValue">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-row class="pa-4" no-gutters>
        <pre>
            <label class="font-weight-medium black--text" style="font-size: 18px;">Sayfadaki kelime frekansları:</label>
          <v-row no-gutters>
            <div class="mr-4" v-for="(obj, z) in sortedFrequency"
                 :key="z">
              <v-badge
                  offset-x="15"
                  :content="obj.size"
                  :value="obj.size"
                  color="#f74f60"
                  overlap
              >
              <code class="code-semantics" :class="(z===0||z === 1 || z === 2) ? 'black--text': 'white--text'"
                    :style="`background-color:${getColors(z)} !important;`">{{obj
                  .text}}</code>
                </v-badge>
            </div>
          </v-row>
            </pre>
      </v-row>
    </v-card>
  </v-lazy>
</template>

<script>
export default {
  name: "URLFrekansDialog",
  data() {
    return {
      isActive: false
    };
  },
  props: {
    overlayValue: {
      type: Boolean,
      required: false,
      default: false
    },
    sortedFrequency: {
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

<style scoped>
.code-semantics {
  font-size: 16px !important;
  font-weight: 500 !important;
  font-family: "Menlo", sans-serif !important;
  border-bottom: 3px solid rgba(0, 0, 0, 0.3);
}
pre {
  background: #f5f5f5;
  border: 1px solid #c8c8c8;
  border-left: 3px solid #339236;
  color: #666;
  page-break-inside: avoid;
  font-family: "Menlo", sans-serif !important;
  font-size: 15px;
  line-height: 1.6;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
  white-space: pre-line;
}
</style>
