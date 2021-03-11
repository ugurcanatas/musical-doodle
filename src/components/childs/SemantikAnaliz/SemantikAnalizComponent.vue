<template>
  <div>
    <v-card>
      <v-app-bar :color="componentItem.barColor">
        <v-app-bar-title class="white--text">{{
          componentItem.label
        }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-row class="no-gutters">
          <span class="white--text">URL Karşılaştır</span>
          <v-switch
            v-model="compareMode"
            true-value="page"
            false-value="url"
            hide-details
            class="align-center ml-4"
            color="white"
            inset
          />
          <span class="white--text">Sayfa Karşılaştır</span>
        </v-row>
        <v-col class="col-2">
          <v-autocomplete
            label="Sözlük API seçiniz"
            v-model="dictModel"
            :items="dictionaries"
            item-text="name"
            item-value="url"
            hide-details
            dense
            dark
          />
        </v-col>
        <v-btn
          @click="request"
          color="white"
          medium
          fab
          icon
          :loading="buttonLoading"
          :disabled="buttonLoading"
          ><v-icon>mdi-download</v-icon></v-btn
        >
        <v-btn
          @click="showDialog = true"
          color="white"
          medium
          fab
          icon
          :disabled="buttonDisabled"
          ><v-icon>mdi-eye</v-icon></v-btn
        >
      </v-app-bar>
      <v-card-text>
        <v-form ref="semantic-form">
          <v-row no-gutters>
            <v-col class="col-6 pr-2">
              <v-combobox
                v-model="urlFieldFix"
                label="Karşılaştırma yapılacak URL"
                :items="getUrlSet"
                :rules="getDefaultRule"
              />
            </v-col>
            <v-col class="col-6 pl-2">
              <v-combobox
                multiple
                v-model="urlFieldModel"
                label="Url Set"
                :rules="getDefaultRule"
                :items="getUrlSet"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-col class="col-12">
        <span class="mb-0"
          >Filtreler:
          <span style="font-size: 14px !important;"
            >(Web Siteleri ile ilgili anahtar kelimeleri/etiketleri meta ya da
            title etiketine bakarak bulabiliriz.)</span
          ></span
        >
        <v-chip-group v-model="chipModel" :multiple="false" show-arrows>
          <v-chip
            class="lighten-2"
            text-color="white"
            color="blue-grey"
            active-class="darken-2"
            v-for="(chip, i) in chips"
            :key="i"
            filter
          >
            {{ chip }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-card>
    <v-row v-if="compareMode === 'url'" no-gutters>
      <compare-urls v-if="showDialog" :data-first-url="resolvedData" :data-url-set="resolvedDataSet" />
    </v-row>
    <v-row v-else-if="compareMode === 'page'" no-gutters>
      <v-col class="col-6">
        <p>{{ resolvedData }}</p>
      </v-col>
      <v-col class="col-6">
        <p>{{ resolvedDataSet }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CompareUrls from "@/components/childs/SemantikAnaliz/CompareUrls";
import {
  defaultRule,
  keywordRegex,
  urlSet,
  whichURL,
  returnURLWithFrequencyList
} from "@/components/utils";
import axios from "axios";

export default {
  name: "SemantikAnalizComponent",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  components: {
    CompareUrls
  },
  data() {
    return {
      urlFieldModel: "",
      urlFieldFix: "",
      chipModel: 0,
      chips: ["description", "title"],
      buttonLoading: false,
      buttonDisabled: true,
      showDialog: false,
      resolvedData: [],
      resolvedDataSet: [],
      dictModel: "https://www.thesaurus.com/browse/",
      dictionaries: [
        {
          name: "Türkçe sözlük",
          url: "https://es-anlam.com/kelime/"
        },
        {
          name: "İngilizce sözlük",
          url: "https://www.thesaurus.com/browse/"
        }
      ],
      compareMode: "url"
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
      if (!this.$refs["semantic-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      console.log("Semantic");
      if (this.compareMode === "url") {
        this.urlParser();
      } else {
        console.log("Page Parser Called");
        const firstRequest = axios.post(whichURL, { url: this.urlFieldFix });
        const urlSetRequests = this.urlFieldModel.map(v =>
          axios.post(whichURL, { url: v })
        );
        axios
          .all([firstRequest, ...urlSetRequests])
          .then(
            axios.spread((...responses) => {
              console.log("URL Set Responses", responses[0]);
              //const selectors = this.chipModel.map(v => this.chips[v]).join(",");
              const html1 = new DOMParser().parseFromString(
                responses[0].data,
                "text/html"
              );
              const firstElements = [...html1.querySelectorAll("meta")];
              console.log("Elements Found", firstElements);
              //console.log("URL Set Responses", responses.splice(1));
              const filtered = firstElements
                .filter(m => {
                  const attribute = m.getAttribute("name");
                  return this.chips[this.chipModel] === attribute && m;
                })
                .map(m => m.getAttribute("content"))
                .join("")
                .replace(keywordRegex, " ")
                .split(" ")
                .filter(m => m.length !== 0);
              console.log("FİLTERED", filtered);
            })
          )
          .catch(e => {
            console.log("Error Received", e);
          });
        //this.pageParser();
      }
    },
    pageParser: function(v) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      const html1 = new DOMParser().parseFromString(v, "text/html");
      const firstElements = [...html1.querySelectorAll(selectors)];

      const tags = firstElements
        .filter(tag => {
          if (tag.hasAttribute("name")) {
            console.log("HAS NAME", tag);
            const name = tag.getAttribute("name");
            console.log("NAME", name);
            if (
              name.includes("title") ||
              name.includes("description") ||
              name.includes("Description") ||
              name.includes("keywords") ||
              name.includes("Keywords")
            ) {
              console.log("CONTENT ATTR", tag.getAttribute("content"));
              return tag;
            }
          }
        })
        .map(m => m.getAttribute("content"));
      console.log("Tags First", tags);

      const eachKeyword = tags
        .join("")
        .replace(keywordRegex, " ")
        .split(" ")
        .filter(m => m.length !== 0);
      console.log("Each Keyword", eachKeyword);
    },
    urlParser: async function() {
      console.log("Selected Fields", this.urlFieldModel);

      const freqListFixed = returnURLWithFrequencyList([this.urlFieldFix]);
      console.log("FIELD FIXED", freqListFixed);
      const freqListSet = returnURLWithFrequencyList(this.urlFieldModel);
      console.log("Freq List", freqListSet);

      this.resolvedData = await this.resolvePromises(freqListFixed);
      this.resolvedDataSet = await this.resolvePromises(freqListSet);

      console.log("RESOLVED FOR FIXED", this.resolvedData);
      console.log("RESOLVED FOR SET", this.resolvedDataSet);
      this.buttonLoading = false;
      this.buttonDisabled = false;
    },
    resolvePromises: async function(data) {
      const freqListUpdated = data.map(m => {
        const { frequencyList } = m;
        return {
          ...m,
          frequencyList: frequencyList.map(v => {
            const { text } = v;
            return {
              ...v,
              request: axios.post(whichURL, {
                //url: `https://www.thesaurus.com/browse/${text}`
                url: `https://tuna.thesaurus.com/pageData/${text}`
              })
            };
          })
        };
      });

      return await Promise.all(
        freqListUpdated.map(async item => {
          console.log("PROMISE ALL ITEM", item);
          const obj = item;
          const value = await Promise.all(
            obj.frequencyList.map(async i => {
              const request = await i.request;
              return {
                ...i,
                request: this.getSynonymsFromAPI(request["data"]["data"])
                //request: this.getWordsFromData(request["data"]).split(" ")
              };
            })
          ).catch(e => {
            console.log("ERROR received", e);
          });
          console.log("VALUE RES", value);
          return { ...obj, frequencyList: value };
        })
      ).catch(e => {
        console.log("ERROR MAIN", e);
      });
    },
    /*
     * This is used for parsing text from html page
     * */
    getWordsFromData: function(data) {
      const newDomHtml = new DOMParser().parseFromString(data, "text/html");
      const selected = [
        ...newDomHtml.querySelectorAll(
          "#meanings > div.css-i3pbo.e1i572590 > ul"
        )
      ];
      console.log("Selected XPath", selected);
      return selected[0]["outerText"];
    },
    /*
     * Deconstructing data that we received from API
     * */
    getSynonymsFromAPI: function(data) {
      //return empty array if data is null
      if (data === null) {
        return [];
      }
      const { definitionData } = data;
      const { definitions } = definitionData;
      return definitions.map(m => {
        const { synonyms } = m;
        return { syn: synonyms };
      });
    }
  }
};
</script>

<style scoped></style>
