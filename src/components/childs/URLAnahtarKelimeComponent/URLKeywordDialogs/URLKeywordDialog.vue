<template>
  <v-card flat elevation="0">
    <v-row style="background-color: #ffffff" class="align-center" no-gutters>
      <v-card-title class="py-2 black--text"
        >Karşılaştırma Analizi (URL)</v-card-title
      >
    </v-row>
    <v-row no-gutters>
      <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
        <v-card class="pb-4" elevation="6">
          <v-row
            style="background-color: #2b7a45"
            class="align-center"
            no-gutters
          >
            <v-card-title class="py-2 white--text">Default URL</v-card-title>
          </v-row>
          <div class="mx-4 pb-0 pt-4">
            <pre
              class="my-0"
            ><label class="font-weight-bold">URL:</label><code>{{ defaultUrl }}</code></pre>
          </div>
          <v-divider class="mx-4"></v-divider>
          <v-row class="pa-4" no-gutters>
            <pre><label>Anahtar Kelimeler:</label>
            <v-row no-gutters>
              <div
                  v-for="(freq, i) in sortedFrequency1"
                  :key="i"
                  class="mr-4"
              >
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
          </v-row>
        </v-card>
      </v-col>
      <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
        <v-card class="pb-4" elevation="6">
          <v-row
            style="background-color: #2b7a45"
            class="align-center"
            no-gutters
          >
            <v-card-title class="py-2 white--text">URL Set</v-card-title>
          </v-row>
          <v-row class="mt-0"
            :key="item.url"
            v-for="(item, i) in getMatchedFiltered"
            no-gutters
          >
            <v-col class="col-12">
              <div class="mx-4 pb-0 pt-4 text-center">
                <span style="font-size: 52px;">{{ getPrize(i) }}</span>
                <pre class="my-0"><label>URL:</label><code>{{ item.url }}</code>
                <span>
                  <label>Eşleşme Puanı:
                  </label><code
                    class="code-matched-ratio">{{
                    item.matchedRatio
                  }}</code>
                  </span>
              </pre>
              </div>

              <div class="mx-4 pb-0 pt-4">
                <pre><label>Anahtar Kelimeler:</label>
                <v-row no-gutters>
                  <div
                  v-for="(freq, i) in item.frequencyList"
                  :key="i"
                  class="mr-4"
              >
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
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "URLKeywordDialog",
  props: {
    defaultUrl: {
      type: String,
      required: false
    },
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
  data() {
    return {
      filterMatches: []
    };
  },
  computed: {
    /*
     * Print this to screen
     * */
    getValues: function() {
      const sorted2 = this.sortedFrequency2;
      const sorted1 = this.sortedFrequency1;

      sorted2.forEach(m => {
        const { frequencyList } = m;
        m["show"] = false;
        frequencyList.forEach(flist => {
          sorted1.forEach(obj => {
            if (flist.text === obj.text) {
              console.log("Words Matched !");
              flist["matched"] = true;
              flist["original_frequency"] = obj.size;
            } else {
              flist["matched"] = false;
            }
          });
        });
      });
      return sorted2;
    },
    getMatchedFiltered: function() {
      return this.getValues
        .map(v => {
          const { url, frequencyList, show } = v;
          const justMatched = frequencyList.filter(obj => obj["matched"]);
          return {
            url,
            show,
            frequencyList: frequencyList.map(m => {
              return {
                ...m,
                individualRatio: this.calculateIndividualPoints(m)
              };
            }),
            matchedRatio: justMatched.length / this.sortedFrequency1.length
          };
        })
        .map(v => {
          const { frequencyList, matchedRatio } = v;
          let individualR = 0;
          frequencyList.forEach(m => {
            const { individualRatio } = m;
            individualR += individualRatio;
          });
          let total = matchedRatio + (individualR / 100) * frequencyList.length;
          console.log("Total is => ", total);
          return {
            ...v,
            matchedRatio: total > 1 ? 1 : total
          };
        })
        .sort((a, b) => {
          return b.matchedRatio - a.matchedRatio;
        });
    }
  },
  created() {
    console.log("Get Matched Values", this.getValues);
  },
  methods: {
    /**
     * Calculates individual keyword ratio
     * @param obj: Object that contains  original_frequency,size,text,matched key/value pairs
     * */
    calculateIndividualPoints: function(obj) {
      if (!obj["matched"]) {
        return 0;
      }
      const { original_frequency, size } = obj;
      const ratio = size / original_frequency;
      console.log("RATIO", ratio);
      if (ratio >= 1) {
        return 1;
      }
      return ratio;
    },
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
