<template>
  <v-card flat class="pb-4 mt-4">
    <v-row style="background-color: #ffffff" class="align-center" no-gutters>
      <v-card-title class="py-2 black--text"
        >Karşılaştırma Analizi</v-card-title
      >
    </v-row>
    <v-row no-gutters>
      <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
        <v-card elevation="6" class="pb-4">
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
            ><label class="font-weight-bold">URL:</label><code>{{ urlName1 }}</code></pre>
            <pre
              class="mt-4"
            ><label class="font-weight-bold">Toplam Kelime Sayısı: </label><code
                class="code-single-text">{{getWordTotal1
              }}</code></pre>
          </div>
          <v-divider class="mx-4"></v-divider>

          <v-row class="pa-4" no-gutters>
            <pre><label>Anahtar Kelimeler: (Top 5)</label>
            <v-row no-gutters>
              <div
            v-for="(freq, i) in sortedFrequency1.slice(0,5)"
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
        <v-card elevation="6" class="pb-4">
          <v-row
            style="background-color: #2b7a45"
            class="align-center"
            no-gutters
          >
            <v-card-title class="py-2 white--text"
              >Karşılaştırılan URL</v-card-title
            >
            <v-spacer></v-spacer>
            <v-btn color="white" @click="compare" text>Karşılaştır</v-btn>
          </v-row>
          <v-row no-gutters class="text-center pt-0 mx-4">
            <v-col class="col-12">
              <pre><label class="font-weight-bold">Benzerlik Puanı: </label>
            <svg width="500" height="60">
              <rect width="400" height="50" x="50" fill="#e0e0e0" rx="4" />
              <rect
                  id="svgBenzerlik"
                  width="0"
                  height="50"
                  x="50"
                  fill="#fcba03"
                  rx="4"
              />
              <text
                  id="svgBenzerlikText"
                  text-anchor="middle"
                  x="245"
                  y="30"
                  fill="black"
              >
                0
              </text>
            </svg></pre>
            </v-col>
          </v-row>
          <div class="mx-4 pb-0 pt-4">
            <pre
              class="my-0"
            ><label class="font-weight-bold">URL:</label><code>{{ urlName2 }}</code></pre>
            <pre
              class="mt-4"
            ><label class="font-weight-bold">Toplam Kelime Sayısı: </label><code
                class="code-single-text">{{getWordTotal2
              }}</code></pre>
          </div>
          <v-divider class="mx-4"></v-divider>

          <v-row class="pa-4" no-gutters>
            <pre><label>Anahtar Kelimeler: (Top 5)</label>
            <v-row no-gutters>
              <div
                  v-for="(freq, i) in sortedFrequency2.slice(0,5)"
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
    </v-row>
  </v-card>
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
    urlName1: {
      type: String,
      required: false
    },
    urlName2: {
      type: String,
      required: false
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
      matchedKeywords: []
    };
  },
  computed: {
    getWordTotal1: function() {
      return this.sortedFrequency1.reduce((a, b) => {
        return a + Number(b.size);
      }, 0);
    },
    getWordTotal2: function() {
      return this.sortedFrequency2.reduce((a, b) => {
        return a + Number(b.size);
      }, 0);
    }
  },
  methods: {
    compare: function() {
      const similars = [];
      this.sortedFrequency1.forEach(m1 => {
        this.sortedFrequency2.forEach(m2 => {
          if (m1.text === m2.text) {
            similars.push({
              text: m2.text,
              count1: m1.size,
              count2: m2.size
            });
          }
        });
      });
      this.matchedKeywords = similars;
      console.log("SİMİLAR WORDS", similars);
      this.similarityScore(similars);
    },
    similarityScore: function(similars) {
      //similarity mapping here
      const similarScore = similars
        .map(m => {
          const { count1, count2 } = m;
          console.log("Map Points", this.mapPoints(count1, count2));
          return this.mapPoints(count1, count2);
        })
        .reduce((a, b) => a + b, 0);
      console.log("Similar Score", similarScore);
      const frequencyScore = similars.reduce((a, b) => {
        return a + b.count2;
      }, 0);

      console.log("Frequency Score", frequencyScore);
      console.log("Similarity Score", similarScore);

      const totalScore = (similarScore / similars.length) * 100; // this.sortedFrequency2.length;
      const svgText = document.querySelector("#svgBenzerlikText");
      svgText.innerHTML = `${(totalScore > 100 ? 100 : totalScore).toFixed(0)}`;
      const svgRectangle = document.querySelector("#svgBenzerlik");

      const svgWidth = (totalScore * 400) / 100;
      svgRectangle.setAttribute(
        "style",
        `width:${
          svgWidth > 400 ? 400 : svgWidth
        }px; transition: 1.3s cubic-bezier(.15,.89,.41,.95);`
      );

      console.log("Similar Total", totalScore);
    },
    mapPoints: function(p1, p2) {
      const ratio = p2/p1;
      if (ratio > 1) {
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
    }
  }
};
</script>

<style scoped></style>
