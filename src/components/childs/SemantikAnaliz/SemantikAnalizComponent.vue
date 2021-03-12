<template>
  <div>
    <template>
      <v-card elevation="6" :loading="buttonLoading" class="mx-auto my-0">
        <template slot="progress">
          <v-progress-linear
            color="pink lighten-2"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-row
          :style="`background-color:${componentItem.barColor}`"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text"
            >{{ componentItem.label }}
          </v-card-title>
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
          <div>
            <v-select
              class="pa-4"
              dark
              dense
              hide-details
              v-model="dictModel"
              :items="dictionaries"
              item-text="name"
              item-value="url"
              label="Sözlük API Seçiniz"
            ></v-select>
          </div>
        </v-row>

        <v-card-text class="pb-0 pt-4">
          <div class="my-0 subtitle-1">
            {{ componentItem.excerpt }}
          </div>
        </v-card-text>

        <v-card-text>
          <v-form ref="semantic-form">
            <v-row no-gutters>
              <v-col class="col-12">
                <v-combobox
                  v-model="urlFieldFix"
                  label="Karşılaştırma yapılacak URL"
                  :items="getUrlSet"
                  :rules="getDefaultRule"
                />
              </v-col>
              <v-col class="col-12">
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
        <v-divider class="mx-4"></v-divider>

        <v-card-title class="pb-2">Filtreler</v-card-title>
        <v-card-text class="pb-0">
          <div>
            Anahtar kelimeleri, <code>meta</code> etiketi içerisindeki
            <code>description</code> veya <code>title</code> özelliklerine
            bakarak bulabiliriz. (Sayfa Modu için geçerlidir.)
          </div>
        </v-card-text>

        <v-card-text>
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
            Frekans Ara
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
    </template>
    <component
      :is="compareMode === 'url' && 'CompareUrls'"
      v-if="showDialog"
      :data-first-url="resolvedData"
      :data-url-set="resolvedDataSet"
    />
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
          name: "Türkçe Sözlük",
          url: "https://es-anlam.com/kelime/"
        },
        {
          name: "The Saurus",
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
      } /*else {
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
      }*/
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

      //returnURLWithFrequencyList param is array. That's why we are passing this as an array
      const freqListFixed = returnURLWithFrequencyList([this.urlFieldFix]);
      console.log("FIELD FIXED", freqListFixed);
      const freqListSet = returnURLWithFrequencyList(this.urlFieldModel);
      console.log("Freq List", freqListSet);

      this.resolvedData = await this.postRequests(freqListFixed);
      this.resolvedDataSet = await this.postRequests(freqListSet);

      console.log("RESOLVED FOR FIXED", this.resolvedData);
      console.log("RESOLVED FOR SET", this.resolvedDataSet);
      this.buttonLoading = false;
      this.buttonDisabled = false;
    },
    postRequests: async function(data) {
      const freqListUpdated = data.map(m => {
        const { frequencyList } = m;
        return {
          ...m,
          frequencyList: frequencyList.map(v => {
            const { text } = v;
            return {
              ...v,
              request: axios.post(whichURL, {
                url: `https://tuna.thesaurus.com/pageData/${text}?limit=10`
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
      return definitions.map(m => m.synonyms);
    }
  }
};
</script>

<style scoped>


code {
  color: #000000 !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: 'Menlo', sans-serif !important;
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
