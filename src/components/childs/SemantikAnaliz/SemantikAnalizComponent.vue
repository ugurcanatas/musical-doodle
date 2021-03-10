<template>
  <v-card>
    <v-app-bar :color="componentItem.barColor">
      <v-app-bar-title class="white--text">{{
        componentItem.label
      }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-select
        label="Sözlük seçiniz"
        v-model="dictModel"
        :items="dictionaries"
        item-text="name"
        item-value="url"
        hide-details
        dense
        dark
      />
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
        <v-combobox
          multiple
          v-model="urlFieldModel"
          label="Url giriniz"
          :rules="getDefaultRule"
          :items="getUrlSet"
        />
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
      <v-chip-group v-model="chipModel" multiple show-arrows>
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
      <p>{{ resolvedData }}</p>
    </v-col>
  </v-card>
</template>

<script>
import {
  defaultRule,
  keywordRegex,
  urlSet,
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
  data() {
    return {
      urlFieldModel: "",
      chipModel: [0],
      chips: ["meta", "title"],
      buttonLoading: false,
      buttonDisabled: true,
      showDialog: false,
      resolvedData: [],
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
      ]
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
      console.log("Semantic");
      /*      this.buttonLoading = true;
      axios
        .post(
          process.env.NODE_ENV === "development"
            ? process.env.VUE_APP_DEV_URL
            : process.env.VUE_APP_PROD_URL,
          {
            url: this.urlFieldModel
          }
        )
        .then(response => {
          console.log("RESPONSE DATA", response.data);
          this.parser(response.data);
          this.buttonLoading = false;
        })
        .catch(e => {
          console.log("Error", e);
        });*/
      this.urlParser();
    },
    parser: function(v) {
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

      const freqList = returnURLWithFrequencyList(this.urlFieldModel);
      //const axiosRequests = [];
      console.log("Freq List", freqList);
      const freqListUpdated = freqList.map(m => {
        const { frequencyList } = m;
        return {
          ...m,
          frequencyList: frequencyList.map(v => {
            const { text } = v;
            return {
              ...v,
              request: axios.post(
                process.env.NODE_ENV === "development"
                  ? process.env.VUE_APP_DEV_URL
                  : process.env.VUE_APP_PROD_URL,
                {
                  url: `https://www.thesaurus.com/browse/${text}`
                }
              )
            };
          })
        };
      });

      const returnV = await Promise.all(
        freqListUpdated.map(async item => {
          console.log("PROMISE ALL ITEM", item);
          const obj = item;
          const value = await Promise.all(
            obj.frequencyList.map(async i => {
              const request = await i.request;
              return {
                ...i,
                request: this.getWordsFromData(request["data"])
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

      console.log("RETURN V", returnV);
      this.resolvedData = returnV;
      console.log("Requests", this.resolvedData);
    },
    getWordsFromData: function(data) {
      const newDomHtml = new DOMParser().parseFromString(data, "text/html");
      const selected = [
        ...newDomHtml.querySelectorAll(
          "#meanings > div.css-i3pbo.e1i572590 > ul"
        )
      ];
      console.log("Selected XPath", selected);
      return selected[0]["outerText"];
    }
  }
};
</script>

<style scoped></style>
