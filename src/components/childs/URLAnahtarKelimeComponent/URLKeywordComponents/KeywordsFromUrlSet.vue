<template>
  <div>
    <u-r-l-keyword-dialog
      v-if="showDialog"
      :dialog-model="showDialog"
      :sorted-frequency1="sortedFrequency1"
      :sorted-frequency2="sortedFrequency2"
      @keywordDialogClosed="showDialog = false"
    />
    <v-card class="mt-6">
      <v-app-bar :color="componentItem.barColor" dense>
        <v-app-bar-title class="white--text">{{
          componentItem.label
        }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!showBottom"
          @click="showDialog = true"
          color="white"
          medium
          fab
          icon
        >
          <v-icon>mdi-file-compare</v-icon>
        </v-btn>
        <v-btn
          @click="$refs['keyword-url-form'].reset()"
          color="white"
          medium
          fab
          icon
          ><v-icon>mdi-delete</v-icon></v-btn
        >
        <v-btn
          @click="findWords"
          color="white"
          medium
          fab
          icon
          :loading="buttonLoading"
          :disabled="buttonLoading"
          ><v-icon>mdi-download</v-icon></v-btn
        >
      </v-app-bar>

      <v-card-text>
        <v-form ref="keyword-url-form" v-model="valid">
          <v-row no-gutters>
            <v-col class="col-6 pr-2">
              <v-combobox
                label="Temel Url"
                :rules="getDefaultRule"
                :items="defaultComboItems"
                v-model="urlFieldModel1"
              />
            </v-col>
            <v-col class="col-6 pl-2">
              <v-combobox
                multiple
                label="Karşılaştırılacak Url Set"
                :rules="getDefaultRule"
                :items="defaultComboItems"
                v-model="urlFieldModel2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-text v-if="showBottom">
        <v-row no-gutters>
          <v-col class="col-6">
            <v-card-title class="pl-0"
              >Temel URL Anahtar Kelimeleri:</v-card-title
            >
            <div
              class="d-inline-block ma-2"
              v-for="(item, i) in sortedFrequency1"
              :key="i"
            >
              <v-badge
                style="font-size: 16px !important;"
                :content="item.size"
                :value="item.size"
                color="red"
                overlap
              >
                <v-chip class="white--text" color="green">{{
                  item.text
                }}</v-chip>
              </v-badge>
            </div>
          </v-col>
          <v-col class="col-6">
            <v-card-title class="pl-0">Karşılaştırılacak URL'ler:</v-card-title>
            <v-row
              no-gutters
              class="mb-2"
              v-for="(item, i) in this.sortedFrequency2"
              :key="i"
            >
              <p style="font-weight: bold">Url: {{ item.url }}</p>
              <div class="ma-2" v-for="(f, y) in item.frequencyList" :key="y">
                <v-badge
                  style="font-size: 16px !important;"
                  :content="f.size"
                  :value="f.size"
                  color="red"
                  overlap
                >
                  <v-chip class="white--text" color="green">{{
                    f.text
                  }}</v-chip>
                </v-badge>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import URLKeywordDialog from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordDialogs/URLKeywordDialog";
import { defaultRule, reducerFrequency } from "@/components/utils";

export default {
  name: "KeywordsFromUrlSet",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  components: {
    URLKeywordDialog
  },
  data() {
    return {
      valid: false,
      defaultComboItems: [
        "https://www.wsj.com/articles/cdc-says-fully-vaccinated-people-can-gather-in-small-groups-without-masks-11615219222?mod=politics_lead_pos4",
        "https://www.wsj.com/articles/supreme-court-wont-review-banks-bid-to-arbitrate-stale-debts-11615242719",
        "https://www.wsj.com/articles/plastics-recycler-carbonlite-files-for-bankruptcy-11615226888",
        "https://www.wsj.com/articles/medley-unit-files-for-bankruptcy-aiming-for-debt-swap-with-bondholders-11615247245",
        "https://www.wsj.com/articles/law-firm-kirkland-ellis-resigns-from-travelport-over-disputed-1-billion-debt-deal-11591762991",
        "https://www.wsj.com/articles/citi-has-options-but-faces-hurdles-to-retrieving-500-million-revlon-goof-11614213945",
        "https://www.wsj.com/articles/global-stock-markets-dow-update-03-09-2021-11615279243?mod=hp_lead_pos1",
        "https://www.wsj.com/articles/widows-run-for-congress-after-husbands-covid-19-deaths-11614263703",
        "https://www.wsj.com/articles/dominion-sues-mypillow-ceo-mike-lindell-over-election-claims-11613996104",
        "https://www.wsj.com/articles/trump-faces-uncertain-future-as-he-leaves-white-house-11611157651",
        "https://www.wsj.com/articles/trumps-final-day-in-office-where-will-he-go-and-what-comes-next-11611078173",
        "https://www.wsj.com/articles/black-women-ready-to-virtually-cheer-on-kamala-harriss-inauguration-11610895600",
        "https://www.wsj.com/articles/u-s-and-china-engage-tentatively-on-climate-change-11615301108"
      ],
      buttonDisabled: true,
      buttonLoading: false,
      showDialog: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["meta", "title"],
      chipModel: [0],
      sortedFrequency1: [],
      sortedFrequency2: [],
      showBottom: false
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  methods: {
    createWords: function(url) {
      const tempAnchor = document.createElement("a");
      tempAnchor.setAttribute("href", url);
      const path = tempAnchor.pathname;
      const pathReplaced = path.replace(/[\W_-]/g, "-");
      return pathReplaced.split("-");
    },
    findWords: function() {
      if (!this.$refs["keyword-url-form"].validate()) {
        return;
      }

      // Bu kısmın tekrar etme aşamaları açıklanacak.
      const splittedWords = this.createWords(this.urlFieldModel1);
      console.log("First URL Keywords", splittedWords);
      this.sortedFrequency1 = reducerFrequency(splittedWords).filter(
        m => m.text !== "" && isNaN(m.text)
      );
      console.log("FREQ 1", this.sortedFrequency1);

      const urlSetOfWords = this.urlFieldModel2.map(url => {
        console.log("Traverse url", url);
        return {
          url: url,
          keywords: this.createWords(url)
        };
      });

      this.sortedFrequency2 = urlSetOfWords.map(m => {
        return {
          url: m.url,
          frequencyList: reducerFrequency(m.keywords).filter(
            m => m.text !== "" && isNaN(m.text)
          )
        };
      });

      console.log("FREQ 2", this.sortedFrequency2);
      this.showBottom = true;
    },
    startComparing: function() {
      console.log("Compare this", JSON.stringify(this.sortedFrequency2));
      console.log("To this", JSON.stringify(this.sortedFrequency1));

      /*
       * add matched key:value pair if words matched.
       * */
      this.sortedFrequency2.forEach(m => {
        const { frequencyList } = m;
        frequencyList.forEach(flist => {
          this.sortedFrequency1.forEach(obj => {
            if (flist.text === obj.text) {
              console.log("Words Matched !");
              flist["matched"] = 1;
            }
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
