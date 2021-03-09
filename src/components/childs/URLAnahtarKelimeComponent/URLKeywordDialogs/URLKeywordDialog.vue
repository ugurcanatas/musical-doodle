<template>
  <v-dialog persistent v-model="dialogModel">
    <v-app-bar color="indigo accent-4">
      <v-app-bar-title class="white--text"
        >Karşılaştırma Analizi</v-app-bar-title
      >
      <v-spacer></v-spacer>
      <v-btn class="white--text" fab icon><v-icon>mdi-compare</v-icon></v-btn>
      <v-btn class="white--text" @click="$emit('keywordDialogClosed')" fab icon
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-app-bar>
    <v-card flat>
      <v-row
        :style="
          index % 2 === 0
            ? 'background-color: azure'
            : 'background-color: wheat'
        "
        no-gutters
        v-for="(item, index) in filterMatches"
        :key="item.url"
      >
        <v-col class="col-12">
          <div v-if="index === 0" style="font-size: 32px;">
            <span>🥇</span> ->
            <span style="font-size: 18px !important;">{{ item.url }}</span>
          </div>
          <div v-else-if="index === 1" v-text="`🥈 - ${item.url}`" />
          <div v-else-if="index === 2" v-text="`🥉 - ${item.url}`" />
          <div v-else v-text="item.url" />
        </v-col>
        <v-col class="col-12">
          <p>Eşleşme oranı: %{{ (item.matchedRatio * 100).toFixed(3) }}</p>
        </v-col>
        <v-col class="col-12">
          <p>Eşleşen Kelimeler Listesi:</p>
        </v-col>
        <v-col class="col-12">
          <div
            class="d-inline-block ma-2"
            v-for="(fItem, i) in item.frequencyList"
            :key="i"
          >
            <v-badge
              style="font-size: 16px !important;"
              :content="fItem.size"
              :value="fItem.size"
              color="red"
              overlap
            >
              <v-chip class="white--text" color="green">{{
                fItem.text
              }}</v-chip>
            </v-badge>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "URLKeywordDialog",
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
        frequencyList.forEach(flist => {
          sorted1.forEach(obj => {
            if (flist.text === obj.text) {
              console.log("Words Matched !");
              flist["matched"] = 1;
              flist["original_frequency"] = obj.size;
            }
          });
        });
      });
      return sorted2;
    }
  },
  created() {
    console.log("Get Matched Values", this.getValues);

    this.filterMatches = this.getValues
      .map(v => {
        const { url, frequencyList } = v;
        const justMatched = frequencyList.filter(obj => obj["matched"]);
        return {
          url,
          frequencyList: justMatched.map(m => {
            return { ...m, individualRatio: this.calculateIndividualPoints(m) };
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

    console.log("Filtered Values With Ratio", this.filterMatches);
  },
  methods: {
    /**
     * Calculates individual keyword ratio
     * @param obj: Object that contains  original_frequency,size,text,matched key/value pairs
     * */
    calculateIndividualPoints: function(obj) {
      const { original_frequency, size } = obj;
      const ratio = size / original_frequency;
      console.log("RATIO", ratio);
      if (ratio >= 1) {
        return 1;
      }
      return ratio;
    }
  }
};
</script>

<style scoped></style>
