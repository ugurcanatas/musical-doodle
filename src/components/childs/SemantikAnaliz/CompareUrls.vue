<template>
  <v-card class="mt-4">
    <v-card-title>URL Karşılaştırması</v-card-title>
    <v-row no-gutters>
      <v-col class="col-6 pa-4">
        <p>
          URL: <b>{{ getFirstUrl.url }}</b>
        </p>

        <v-row
          no-gutters
          v-for="(item, i) in getFirstUrl.frequencyList"
          :key="i"
        >
          <p>
            Anahtar Kelime: <b>{{ item.text }}</b>
          </p>
          <v-col class="col-12">
            <p>Alakalı Kelimeler:</p>
            <v-chip-group column>
              <v-chip
                :color="getColors(obj)"
                v-for="(obj, z) in item.request"
                :key="z"
              >
                <span class="white--text font-weight-bold">{{ obj.term }}</span>
              </v-chip>
            </v-chip-group>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="col-6 pa-4">
        <v-row no-gutters>
          <v-col class="col-12" v-for="(item, i) in getSortedURLSet" :key="i">
            <p>
              <v-icon>mdi-web</v-icon> URL: <b>{{ item.url }}</b>
            </p>
            <p>Eşleşme Puanı: {{ Math.ceil(item.matchedRatio) }}</p>
            <v-row
              v-for="(frequency, j) in item.frequencyList"
              :key="j"
              no-gutters
            >
              <p>
                Anahtar Kelime: <b>{{ frequency.text }}</b>
              </p>
              <v-col class="col-12">
                <p>Alakalı Kelimeler:</p>
                <v-chip-group column>
                  <v-chip
                    :color="getColors(obj)"
                    v-for="(obj, z) in frequency.request"
                    :key="z"
                  >
                    <span class="white--text font-weight-bold">{{
                      obj.term
                    }}</span>
                  </v-chip>
                </v-chip-group>
                <v-divider></v-divider>
              </v-col>
            </v-row>
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
      sortedUrlSet: []
    };
  },
  computed: {
    getFirstUrl: function() {
      return this.dataFirstUrl.map(m => {
        const { frequencyList } = m;
        return {
          ...m,
          frequencyList: frequencyList.map(m => {
            const { request } = m;
            let newRequestArr = [];
            request.forEach(v => {
              v.syn.forEach(w => {
                newRequestArr.push(w);
              });
            });
            return {
              ...m,
              request: newRequestArr
            };
          })
        };
      })[0];
    },
    /*
     * This function changes the object structure inside the
     * dataUrlSet[index].frequencyList. If there is a match
     * between two words, we are going to set property of matched
     * to true otherwise false.
     * */
    getValues: function() {
      const sorted2 = this.dataUrlSet;
      const sorted1 = this.dataFirstUrl[0].frequencyList;

      sorted2.forEach(m => {
        const { frequencyList } = m;
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
    getSortedURLSet: function() {
      const sortedUrlSet = this.getValues
        .map(v => {
          const { url, frequencyList } = v;
          const justMatched = frequencyList.filter(obj => obj["matched"]);
          return {
            url,
            frequencyList: frequencyList.map(m => {
              const { request } = m;
              let newRequestArr = [];
              request.forEach(v => {
                v.syn.forEach(w => {
                  newRequestArr.push(w);
                });
              });
              console.log("NEW REQ ARRAY", newRequestArr);
              return {
                ...m,
                request: newRequestArr,
                individualRatio: this.calculateIndividualPoints(m)
              };
            }),
            matchedRatio:
              justMatched.length / this.dataFirstUrl[0].frequencyList.length
          };
        })
        .map(v => {
          const { frequencyList, matchedRatio } = v;
          let individualR = 0;
          frequencyList.forEach(m => {
            const { individualRatio, matched } = m;
            if (matched) {
              individualR += individualRatio;
            }
          });
          let total = matchedRatio + (individualR / 100) * frequencyList.length;
          console.log("Total is => ", total);
          return {
            ...v,
            matchedRatio: total > 100 ? 1 : total * 100
          };
        })
        .sort((a, b) => b.matchedRatio - a.matchedRatio);
      console.log("UPDATED VALUES", sortedUrlSet);
      return sortedUrlSet;
    }
  },
  /*created() {
    this.sortedUrlSet = this.getValues
      .map(v => {
        const { url, frequencyList } = v;
        const justMatched = frequencyList.filter(obj => obj["matched"]);
        return {
          url,
          frequencyList: frequencyList.map(m => {
            const { request } = m;
            let newRequestArr = [];
            request.forEach(v => {
              v.syn.forEach(w => {
                newRequestArr.push(w);
              });
            });
            console.log("NEW REQ ARRAY", newRequestArr);
            return {
              ...m,
              request: newRequestArr,
              individualRatio: this.calculateIndividualPoints(m)
            };
          }),
          matchedRatio:
            justMatched.length / this.dataFirstUrl[0].frequencyList.length
        };
      })
      .map(v => {
        const { frequencyList, matchedRatio } = v;
        let individualR = 0;
        frequencyList.forEach(m => {
          const { individualRatio, matched } = m;
          if (matched) {
            individualR += individualRatio;
          }
        });
        let total = matchedRatio + (individualR / 100) * frequencyList.length;
        console.log("Total is => ", total);
        return {
          ...v,
          matchedRatio: total > 100 ? 1 : total * 100
        };
      })
      .sort((a, b) => b.matchedRatio - a.matchedRatio);
    console.log("UPDATED VALUES", this.sortedUrlSet);
  },*/
  methods: {
    calculateIndividualPoints: function(obj) {
      if (!obj["matched"]) {
        return 0;
      }
      const { original_frequency, size, request } = obj;
      const similarities = request
        .map(v =>
          v.syn
            .map(a => a.similarity)
            .reduce((a, b) => {
              return Number(a) + Number(b);
            }, 0)
        )
        .map(m => m / 100);
      const data = similarities.reduce((a, b) => {
        return (a + b) / similarities.length;
      });
      console.log("SİMİLARİTİES", data);
      const ratio = size / original_frequency + data;
      console.log("RATIO", ratio);
      return ratio;
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
