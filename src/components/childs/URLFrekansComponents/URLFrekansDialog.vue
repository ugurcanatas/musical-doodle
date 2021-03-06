<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    width="500"
    min-width="500"
    :scrollable="false"
  >
    <v-app-bar color="indigo accent-4">
      <v-app-bar-title class="white--text">Bulunan Kelimeler</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" @click="$emit('frekansDialogClosed')" fab icon
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-app-bar>
    <v-card max-height="500" style="overflow-y: scroll !important;">
      <v-row no-gutters>
        <v-col class="col-12">
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency"
              :key="i"
            >
              <v-badge style="font-size: 16px !important;"
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
  name: "URLFrekansDialog",
  data() {
    return {
      dialog: true
    };
  },
  props: {
    dialogModel: {
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
          return "deep-purple lighten-4";
      }
    }
  }
};
</script>

<style scoped></style>
