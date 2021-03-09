<template>
  <v-dialog v-model="dialogModel" persistent width="500" min-width="500">
    <v-app-bar color="indigo accent-4">
      <v-app-bar-title class="white--text">Bulunan Kelimeler</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" @click="compare" fab icon
        ><v-icon>mdi-compare</v-icon></v-btn
      >
      <v-btn class="white--text" @click="$emit('anahtarDialogClosed')" fab icon
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-app-bar>
    <v-card min-height="300" style="overflow-y: scroll !important;">
      <v-row>
        <v-col class="col-6">
          <v-card-title>{{ urlName1 }}</v-card-title>
          <v-card-subtitle
            >Toplam Keyword: {{ sortedFrequency1.length }}</v-card-subtitle
          >
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency1.slice(0, 5)"
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
          <v-card-title>{{ urlName2 }}</v-card-title>
          <v-card-subtitle
            >Toplam Keyword: {{ sortedFrequency2.length }}</v-card-subtitle
          >
          <v-card-text style="height: 100%; background-color: white">
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency2.slice(0, 5)"
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
      <v-row no-gutters>
        <v-card-title>Benzerlik Skoru</v-card-title>

        <v-card-subtitle
          >Eşleşen Toplam: {{ matchedKeywords.length }}</v-card-subtitle
        >
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
        </svg>
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

      const totalScore = frequencyScore + similarScore; // this.sortedFrequency2.length;
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
      const minus = Math.abs(p1 - p2);
      if (minus === 0) {
        return 2;
      } else if (1 <= minus <= 2) {
        return 1.5;
      } else if (2 < minus <= 4) {
        return 1;
      } else {
        return 0.5;
      }
    },
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
