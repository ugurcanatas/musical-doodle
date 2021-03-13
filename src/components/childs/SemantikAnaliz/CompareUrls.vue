<template>
  <v-card flat class="mt-4">
    <v-card-title>URL Karşılaştırması</v-card-title>
    <v-row no-gutters>
      <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
        <v-card elevation="6" class="pb-4">
          <v-row
            style="background-color: deeppink"
            class="align-center"
            no-gutters
          >
            <v-card-title class="py-2 white--text"
              >Karşılaştırılan URL
            </v-card-title>
          </v-row>
          <div class="mx-4 pb-0 pt-4">
            <pre
              class="my-0"
            ><label>URL:</label><code>{{ getFirstUrl.url }}</code></pre>
          </div>
          <v-divider class="mx-4"></v-divider>

          <v-card-title class="pb-2">Anahtar Kelimeler</v-card-title>
          <v-card-text
            v-for="(item, i) in getFirstUrl.frequencyList"
            :key="i"
            class="pb-0"
          >
            <div>
              <pre>
                <label>Kelime:</label>
                <v-row no-gutters>
                <code class="code-single-text">{{ item.text }}</code>
                  <code class="code-single-text ml-4">{{ item.size }}</code>
                    </v-row>
                <v-divider class="mt-4"></v-divider>
              <label>Alakalı kelimeler:</label>
                <v-row no-gutters>
                <div class="mr-4" v-for="(obj, z) in item.request"
                     :key="z">
                <code class="code-semantics" :style="`background-color:${getColors(obj)} !important;`">{{obj.term}}</code>
                  </div>
                  </v-row>
              </pre>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
        <v-card elevation="6" class="pb-4">
          <v-row
            style="background-color: deeppink"
            class="align-center"
            no-gutters
          >
            <v-card-title class="py-2 white--text"
              >URL Set Sonuçlar</v-card-title
            >
          </v-row>
          <v-card-text
            class="pb-0 pt-4"
            v-for="(item, i) in getSortedURLSet"
            :key="i"
          >
            <div class="mx-4 pb-0">
              <pre class="my-0"><label>URL:</label><code>{{ item.url }}</code>
                <span>
              <label>Eşleşme Puanı: </label><code class="code-matched-ratio">{{ item.matchedRatio }}</code>
                  </span>
              </pre>
            </div>
            <v-card-title class="pb-2">Anahtar Kelimeler</v-card-title>
            <v-card-text
              v-for="(freq, i) in item.frequencyList"
              :key="i"
              class="pb-0"
            >
              <div>
                <pre><label>Kelime:</label>
                  <v-row no-gutters>
              <code class="code-single-text">{{ freq.text }}</code>
                  <code class="code-single-text ml-4">{{ freq.size }}</code>
                    </v-row>
                <v-divider class="mt-4"></v-divider>
              <label>Alakalı kelimeler:</label>
                <v-row no-gutters>
                <div class="mr-4" v-for="(obj, z) in freq.request"
                     :key="z">
                <code class="code-semantics" :style="`background-color:${getColors(obj)} !important;`">{{obj.term}}</code>
                  </div>
                  </v-row>
              </pre>
              </div>
            </v-card-text>
          </v-card-text>
        </v-card>
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
              v.forEach(w => {
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
                v.forEach(w => {
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
  methods: {
    calculateIndividualPoints: function(obj) {
      if (!obj["matched"]) {
        return 0;
      }
      const { original_frequency, size, request } = obj;
      const similarities = request
        .map(v =>
          v
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
