<template>
  <div>
    <v-card :loading="buttonLoading" elevation="6" class="pb-4">
      <template slot="progress">
        <v-progress-linear
            color="pink lighten-2"
            height="10"
            indeterminate
        ></v-progress-linear>
      </template>
      <v-row
        :style="`background-color: ${componentItem.barColor}`"
        class="align-center"
        no-gutters
      >
        <v-card-title class="py-2 white--text">Webpage Keywords </v-card-title>
        <v-row no-gutters class="align-center justify-end">
          <label class="pr-4 white--text">Mod Seçimi:</label>
          <v-switch
            v-model="compareMode"
            true-value="page"
            false-value="url"
            color="white"
            inset
            flat
          />
          <v-chip
            style="width: 64px;"
            text-color="white"
            color="pink lighten-3"
            class="ml-0 mr-4 justify-center"
            >{{ compareMode === "url" ? "URL" : "Sayfa" }}</v-chip
          >
        </v-row>
      </v-row>
      <div class="subtitle-1 mx-4 pb-0 pt-4">
        Web sayfası meta etiketlerini inceleyerek anahtar kelimelerin bulunması
        işlemi
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-form ref="tag-form" v-model="valid">
          <v-row no-gutters>
            <v-col class="col-6 pr-2">
              <v-combobox
                label="Url 1"
                :rules="getDefaultRule"
                :items="getUrlSet"
                v-model="urlFieldModel1"
              />
            </v-col>
            <v-col class="col-6 pl-2">
              <v-combobox
                label="Url 2"
                :rules="getDefaultRule"
                :items="getUrlSet"
                v-model="urlFieldModel2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-title class="pb-2">Filtreler</v-card-title>
      <v-card-text class="pb-0">
        <div>
          Anahtar kelimeleri, <code>meta</code> etiketi içerisindeki
          <code>description</code>, <code>keywords</code>,
          <code>application-name</code>, <code>author</code> gibi özelliklere
          bakarak bulabiliriz.<b>(sadece sayfa modunda geçerlidir)</b>
        </div>
      </v-card-text>
      <v-card-text>
        <v-combobox
          multiple
          :items="chips"
          v-model="chipModel"
          label="Filtre grubu"
          chips
          deletable-chips
        />
      </v-card-text>

      <v-divider class="mx-4"></v-divider>
      <v-card-actions class="ma-2">
        <v-btn
          @click="request"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          class="white--text"
          color="green darken-1"
        >
          <v-icon class="ml-0" left dark>mdi-magnify</v-icon>
          Anahtar Kelime Ara
        </v-btn>
        <v-btn
          @click="showDialog = true"
          :disabled="buttonDisabled"
          class="white--text"
          color="blue accent-2"
        >
          <v-icon class="ml-0" left dark>mdi-eye</v-icon>
          Göster
        </v-btn>
      </v-card-actions>
    </v-card>
    <anahtar-kelime-dialog
      :sorted-frequency1="sortedFrequency1"
      :sorted-frequency2="sortedFrequency2"
      v-if="showDialog"
      :url-name1="urlFieldModel1"
      :url-name2="urlFieldModel2"
    />
  </div>
</template>

<script>
/*eslint-disable*/
import AnahtarKelimeDialog from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordDialogs/AnahtarKelimeDialog";
import axios from "axios";
import {
  defaultRule,
  reducerFrequency,
  keywordRegex,
  whichURL,
  urlSet
} from "@/components/utils";

export default {
  name: "KeywordsFromWebpage",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  components: {
    AnahtarKelimeDialog
  },
  data() {
    return {
      valid: false,
      buttonDisabled: true,
      buttonLoading: false,
      showDialog: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["description", "keywords", "application-name", "author"],
      chipModel: ["description", "keywords", "application-name", "author"],
      sortedFrequency1: [],
      sortedFrequency2: [],
      compareMode: "page"
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    },
    getUrlSet: function() {
      return urlSet;
    }
  },
  methods: {
    request: function() {
      if (!this.$refs["tag-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      const requestFirst = axios.post(whichURL, {
        url: this.urlFieldModel1
      });
      const requestSecond = axios.post(whichURL, {
        url: this.urlFieldModel2
      });
      axios
        .all([requestFirst, requestSecond])
        .then(
          axios.spread((...responses) => {
            const [responseFirst, responseSecond] = responses;
            this.parser(responseFirst.data, responseSecond.data);
            this.buttonLoading = false;
          })
        )
        .catch(e => {
          console.log("Error Received", e);
          this.buttonLoading = false;
        });
    },
    parser: function(v1, v2) {
      const html1 = new DOMParser().parseFromString(v1, "text/html");
      const firstElements = [...html1.querySelectorAll("meta")];
      const html2 = new DOMParser().parseFromString(v2, "text/html");
      const secondElements = [...html2.querySelectorAll("meta")];

      /*
       * Filter meta tags first.
       * Step 1. Clear tags that has empty name attribute
       * Step 2. Return matched ones using selectors filter.
       * */
      const tagsFirst = this.filterMetaTags(firstElements, this.chipModel);
      const tagsSecond = this.filterMetaTags(secondElements, this.chipModel);

      /*
       * Create array of strings containing each word for both urls
       * */
      const eachWordFirst = this.createWordArray(tagsFirst);
      const eachWordSecond = this.createWordArray(tagsSecond);

      console.log("EachWord First", eachWordFirst);
      console.log("EachWord Second", eachWordSecond);

      /*
       * Call custom reducer function at the end
       * */
      this.sortedFrequency1 = reducerFrequency(eachWordFirst);
      this.sortedFrequency2 = reducerFrequency(eachWordSecond);

      this.buttonDisabled = false;
      console.log("Frequency 1", this.sortedFrequency1);
      console.log("Frequency 2", this.sortedFrequency2);
    },
    createWordArray: function(data) {
      return data
        .join("")
        .replace(keywordRegex, " ")
        .split(" ")
        .filter(m => m.length !== 0);
    },
    filterMetaTags: function(data, selectors) {
      return data
        .filter(meta => meta.getAttribute("name") !== null)
        .filter(meta => {
          const name = meta.getAttribute("name").toUpperCase();
          return (
            selectors.some(el => {
              return name.match(new RegExp(el.toUpperCase(), "i"));
            }) && meta
          );
        })
        .map(m => m.getAttribute("content"));
    }
  }
};
</script>

<style scoped>
code {
  color: #000000 !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #e0e0e0 !important;
}
pre {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-left: 3px solid #f36d33;
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
}
</style>
