<template>
  <v-card class="mt-4">
    <v-card-title>URL Karşılaştırması</v-card-title>
    <v-row no-gutters>
      <v-col class="col-6">
        <v-card-text
          >URL: <b>{{ dataFirstUrl[0].url }}</b></v-card-text
        >
        <v-card-text>
          <v-row
            no-gutters
            v-for="(item, i) in dataFirstUrl[0].frequencyList"
            :key="i"
          >
            <p>
              Kelime: <b>{{ item.text }}</b>
            </p>
            <div>
              <p>Alakalı Kelimeler:</p>
              <v-row
                no-gutters
                color="indigo"
                v-for="(syn, y) in item.request"
                :key="y"
              >
                <v-chip-group column>
                  <v-chip
                    :color="getColors(obj)"
                    v-for="(obj, z) in syn.syn"
                    :key="z"
                  >
                    <span class="white--text font-weight-bold">{{
                      obj.term
                    }}</span>
                  </v-chip>
                </v-chip-group>
              </v-row>
            </div>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col class="col-6">
        <v-row no-gutters>
          <v-col :key="item.url" v-for="item in dataUrlSet" class="col-12">
            <v-card-text
              >URL: <b>{{ item.url }}</b></v-card-text
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "CompareUrls",
  props: {
    dataFirstUrl: {
      type: Array,
      required: false
    },
    dataUrlSet: {
      type: Array,
      required: false
    }
  },
  data() {
    return {

    };
  },
  computed: {
    getValues: function() {
      const sorted2 = this.dataUrlSet;
      const sorted1 = this.dataFirstUrl[0].frequencyList;

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

    const updated = this.getValues;
    console.log("UPDATED VALUES", updated);
/*    const updatedSet = this.dataUrlSet
      .map(set => {
        const { frequencyList } = set;
        const justMatched = frequencyList.filter(obj => obj["matched"]);
        return {
          ...set,
          frequencyList: frequencyList.map(item => {
            const { text, size } = item;
            return {
              ...item,
              matched: this.getMatched(text, size)
            };
          }),
          matchedRatio: justMatched.length / this.dataFirstUrl[0].frequencyList.length
          /!*          .map(item => {
            const { matched, size, individualRatio } = item;
          })*!/
        };
      })
      .map(set => {
        const { frequencyList } = set;
        let individualR = 0;
        frequencyList.map(item => {
          const { matched, size, individualRatio, request } = item;
          if (matched === true) {
            individualR += individualRatio;
            const similarity = request.filter(v =>
                v.syn.filter(m => m.similarity)
            );
            let total = matchedRatio + (individualR / 100) * frequencyList.length;
          }
        });
      });

    console.log("URL SET UPDATED", updatedSet);*/
  },
  methods: {
    calculatePoint: function(size, original_size) {
      return size / original_size;
    },
    getMatched: function(text, size) {
      const firstFrequencyList = this.dataFirstUrl[0].frequencyList;
      let obj = {};
      firstFrequencyList.forEach(v => {
        if (v.text === text) {
          obj = {
            matched: true,
            original_size: v.size,
            individualRatio: this.calculatePoint(size, v.size)
          };
        } else {
          obj = { matched: false };
        }
      });
      return obj;
    },
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
