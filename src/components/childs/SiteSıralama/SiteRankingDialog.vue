<template>
  <v-row no-gutters>
    <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
      <v-card class="pb-4">
        <v-row
          style="background-color: deeppink"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text">Ana Url </v-card-title>
        </v-row>
        <div class="mx-4 pb-0 pt-4">
          <pre class="my-0"><label>URL:</label><code>{{ urlName }}</code></pre>
        </div>
        <v-divider class="mx-4"></v-divider>
        <div class="mx-4 pb-0 pt-4">
          <pre><label>İçerik & Frekanslar:</label>
            <v-row no-gutters>
              <div v-for="(freq, i) in mainList" :key="i" class="mr-4">
                <v-badge
                        offset-x="15"
                        :content="freq.size"
                        :value="freq.size"
                        color="#f74f60"
                        overlap
                >
                  <code class="code-semantics" :class="(i===0||i === 1 || i === 2) ? 'black--text': 'white--text'"
                        :style="`background-color:${getColors(i)} !important;`">{{freq
                      .text}}</code>
                </v-badge>
              </div>
            </v-row>
          </pre>
        </div>
      </v-card>
    </v-col>
    <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
      <v-card class="pb-4">
        <v-row
          style="background-color: deeppink"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text">URL Set </v-card-title>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SiteRankingDialog",
  props: {
    dialogModel: {
      type: Boolean,
      required: false,
      default: false
    },
    urlName: {
      type: String,
      required: false
    },
    mainList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      selectionModel: []
    };
  },
  computed: {},
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
    },
    getPrize: function(i) {
      switch (i) {
        case 0:
          return "🥇";
        case 1:
          return "🥈";
        case 2:
          return "🥉";
        default:
          return "🏆";
      }
    }
  }
};
</script>

<style scoped></style>
