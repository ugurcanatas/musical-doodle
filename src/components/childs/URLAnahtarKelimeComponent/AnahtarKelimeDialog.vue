<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    width="500"
    min-width="500"
  >
    <v-app-bar color="indigo accent-4">
      <v-app-bar-title class="white--text">Bulunan Kelimeler</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" @click="$emit('anahtarDialogClosed')" fab icon
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-app-bar>
    <v-card min-height="300" style="overflow-y: scroll !important;">
      <v-row>
        <v-col class="col-6">
          <v-card-title>URL 1 Top 5</v-card-title>
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency1"
              :key="i"
            >
              <v-badge
                style="font-size: 16px !important;"
                :content="item.size"
                :value="item.size"
                color="green"
                overlap
              >
                <v-chip :color="getColors(i)">{{ item.text }}</v-chip>
              </v-badge>
            </div>
          </v-card-text>
        </v-col>
        <v-col class="col-6">
          <v-card-title>URL 2 Top 5</v-card-title>
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency2"
              :key="i"
            >
              <v-badge
                style="font-size: 16px !important;"
                :content="item.size"
                :value="item.size"
                color="green"
                overlap
              >
                <v-chip :color="getColors(i)">{{ item.text }}</v-chip>
              </v-badge>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AnahtarKelimeDialog",
  props: {
    dialogModel: {
      type: Boolean,
      required: false,
      default: false
    },
    sortedFrequency1: {
      type: Array,
      required: false,
      default: () => []
    },
    sortedFrequency2: {
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
          return "deep-purple lighten-4";
      }
    }
  }
};
</script>

<style scoped></style>
