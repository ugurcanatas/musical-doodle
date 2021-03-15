<template>
  <div>
    <v-card :loading="buttonLoading" elevation="6">
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
        <v-card-title class="py-2 white--text"
          >{{ componentItem.label }}
        </v-card-title>
      </v-row>

      <div class="subtitle-1 mx-4 pb-0 pt-4">
        Web Sayfası içeriği ve web site kümesine bakılarak hesap.
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-form ref="ranking-form" v-model="valid">
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
                multiple
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider class="mx-4"></v-divider>

      <v-card-title class="pb-2">Filtreler</v-card-title>
      <v-card-text class="pb-0">
        <div>
          Seçtiğiniz HTML etiketlerine göre filtreleme yapılacaktır.
        </div>
      </v-card-text>

      <v-card-text>
        <v-chip-group v-model="chipModel" multiple column>
          <v-chip v-for="(chip, i) in chips" :key="i" filter outlined>
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
    <site-ranking-dialog
      v-if="showDialog"
      :url-name="urlFieldModel1"
      :main-list="mainList"
      :url-set-list="urlSetList"
    />
  </div>
</template>

<script>
import SiteRankingDialog from "@/components/childs/SiteSıralama/SiteRankingDialog";
import {
  defaultRule,
  reducerFrequency,
  whichURL,
  urlSet,
  keywordRegex
} from "@/components/utils";
import axios from "axios";

export default {
  name: "SiteRankingComponent",
  components: {
    SiteRankingDialog
  },
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      urlFieldModel1: "",
      urlFieldModel2: [],
      valid: false,
      chipModel: [0],
      chips: ["p", "h1", "h2", "h3", "h4", "h5", "blockquote"],
      derinlikModel: "1",
      buttonLoading: false,
      buttonDisabled: true,
      showDialog: false,
      urlSet: [],
      mainList: [],
      urlSetList: []
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
      if (!this.$refs["ranking-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      console.log("Model", this.urlFieldModel1);
      const requestMain = axios.post(whichURL, {
        url: this.urlFieldModel1
      });

      const requestSet = this.urlFieldModel2.map(v =>
        axios.post(whichURL, {
          url: v
        })
      );

      axios
        .all([requestMain, ...requestSet])
        .then(
          axios.spread((...responses) => {
            const mainResponse = responses[0];
            const setResponses = responses.splice(1).map(v => v.data);
            console.log("RESPONSES RANKING", setResponses);
            this.mainList = this.parseMain(mainResponse.data);
            const s = this.parseSet(setResponses);
            this.urlSetList = this.parseAll(this.mainList, s);

            this.buttonLoading = false;
            this.buttonDisabled = false;
          })
        )
        .catch(e => {
          console.log("Error Received", e);
          this.buttonLoading = false;
          this.buttonDisabled = true;
        });
    },
    parseAll: function(f, s) {
      return s
        .map(obj => {
          const { frequencyList } = obj;
          return {
            ...obj,
            frequencyList: frequencyList
              .map(flist => {
                return {
                  ...flist,
                  matched: f.some(item => {
                    return item.text === flist.text;
                  }),
                  original_frequency: f.filter(
                    item => flist.text === item.text
                  )[0]
                };
              })
              .map(flist => {
                return {
                  ...flist,
                  matchedRatio: flist.matched
                    ? flist.size / flist.original_frequency.size
                    : 0
                };
              })
          };
        })
        .map(a => {
          const { frequencyList } = a;
          return {
            ...a,
            total: frequencyList.reduce((c, d) => {
              return c + d.matchedRatio;
            },0)
          };
        });
    },
    parseMain: function(data) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      console.log("FİLTERS", selectors);
      const htmlData = new DOMParser().parseFromString(data, "text/html");
      const domElements = [...htmlData.querySelectorAll(selectors)];

      const words = domElements
        .map(m => m.innerText)
        .join(" ")
        .replace(keywordRegex, "")
        .split(" ")
        .filter(m => m !== "");
      console.log("Elements Parsed Text", words);
      this.mainList = reducerFrequency(words);
      console.log("mainFrequency", this.mainList);
      return reducerFrequency(words);
    },
    parseSet: function(datas) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      return datas.map((v, i) => {
        console.log("FİLTERS", selectors);
        const htmlData = new DOMParser().parseFromString(v, "text/html");
        const domElements = [...htmlData.querySelectorAll(selectors)];
        const anchorElements = [...htmlData.querySelectorAll("a")];
        console.log("Anchors", anchorElements);
        const words = domElements
          .map(m => m.innerText)
          .join(" ")
          .replace(keywordRegex, "")
          .split(" ")
          .filter(m => m !== "");
        console.log("Elements Parsed for Second", words);
        return {
          url: this.urlFieldModel2[i],
          frequencyList: reducerFrequency(words),
          showNodes: false,
          showKeywords: false,
          anchors: anchorElements
            .map(m => {
              const pathname = m.pathname;
              if (pathname !== "/") {
                const splittedPath = pathname.split("/");
                if (splittedPath.length < 4) {
                  return {
                    pathname,
                    depth: splittedPath.length,
                    tree: splittedPath.map((v, index) => {
                      return {
                        path: v === "" ? "/" : v,
                        depthIndex: index
                      };
                    })
                  };
                }
              }
            })
            .filter(m => m)
            .map(m => {
              const { tree } = m;
              return {
                ...m,
                tree: tree.map(v => {
                  const { path } = v;
                  const words = path.replace(keywordRegex, " ").split(" ");
                  return {
                    ...v,
                    showUrlWords: false,
                    colorOpen: "#5ade7f",
                    colorClose: "#e7e7e7",
                    words: reducerFrequency(words.filter(w => isNaN(w)))
                  };
                })
              };
            })
        };
      });
    }
  }
};
</script>

<style scoped></style>
