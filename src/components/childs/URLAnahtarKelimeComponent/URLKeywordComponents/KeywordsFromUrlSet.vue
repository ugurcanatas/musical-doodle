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
                :items="getUrlSet"
                v-model="urlFieldModel1"
              />
            </v-col>
            <v-col class="col-6 pl-2">
              <v-combobox
                multiple
                label="Karşılaştırılacak Url Set"
                :rules="getDefaultRule"
                :items="getUrlSet"
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
import { defaultRule, reducerFrequency, createWords, urlSet } from "@/components/utils";

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
    },
    getUrlSet: function () {
      return urlSet
    },
  },
  methods: {
    findWords: function() {
      if (!this.$refs["keyword-url-form"].validate()) {
        return;
      }

      // Bu kısmın tekrar etme aşamaları açıklanacak.
      const splittedWords = createWords(this.urlFieldModel1);
      console.log("First URL Keywords", splittedWords);
      this.sortedFrequency1 = reducerFrequency(splittedWords).filter(
        m => m.text !== "" && isNaN(m.text)
      );
      console.log("FREQ 1", this.sortedFrequency1);

      this.sortedFrequency2 = this.urlFieldModel2
        .map(url => {
          console.log("Traverse url", url);
          return {
            url: url,
            keywords: createWords(url)
          };
        })
        .map(m => {
          return {
            url: m.url,
            frequencyList: reducerFrequency(m.keywords).filter(
              m => m.text !== "" && isNaN(m.text)
            )
          };
        });

      console.log("FREQ 2", this.sortedFrequency2);
      this.showBottom = true;
    }
  }
};
</script>

<style scoped></style>
