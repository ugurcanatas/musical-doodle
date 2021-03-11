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
      <v-card-title class="py-2"
        ><v-icon class="mr-2">mdi-chart-line</v-icon>Sayfadaki kelime
        frekansları</v-card-title
      >
      <v-row no-gutters>
        <v-col class="col-12">
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency"
              :key="i"
            >
              <v-badge
                offset-x="10"
                :content="item.size"
                :value="item.size"
                color="deep-purple"
                overlap
              >
                <v-chip text-color="black" :color="getColors(i)">{{
                  item.text
                }}</v-chip>
              </v-badge>
            </div>
          </v-card-text>
        </v-col>
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
          return "yellow accent-4";
        case 1:
          return "blue-grey lighten-2";
        case 2:
          return "brown lighten-2";
        default:
          return "grey lighten-2";
      }
    }
  }
};
</script>

<style scoped></style>
