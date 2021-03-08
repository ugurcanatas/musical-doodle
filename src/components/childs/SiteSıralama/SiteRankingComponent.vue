<template>
  <v-card>
    <v-app-bar :color="componentItem.barColor" dense>
      <v-app-bar-title class="white--text">{{
        componentItem.label
      }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="visitWebsite" color="white" medium fab icon
        ><v-icon>mdi-web</v-icon></v-btn
      >
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
      <v-form ref="ranking-form">
        <v-combobox
          v-model="urlFieldModel"
          label="Url giriniz"
          :rules="getDefaultRule"
          :items="defaultComboItems"
        />
      </v-form>
    </v-card-text>
    <v-col class="col-12">
      <span class="mb-0"
        >Filtreler: (Sayfa içerisindeki linkleri anchor etiketine bakarak
        bulabiliriz.)</span
      >
      <v-chip-group v-model="chipModel" :multiple="false" show-arrows>
        <v-chip v-for="(chip, i) in chips" :key="i" filter outlined>
          {{ chip }}
        </v-chip>
      </v-chip-group>
    </v-col>
    <v-col class="col-12">
      <span class="mb-0">Derinlik Seçimi</span>
      <v-radio-group v-model="derinlikModel" row>
        <v-radio label="1" value="1"></v-radio>
        <v-radio label="2" value="2"></v-radio>
        <v-radio label="3" value="3"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col>
      <v-treeview
        selection-type="leaf"
        return-object
        :items="treeView"
        item-key="key"
        open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.file">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.file] }}
          </v-icon>
        </template>
      </v-treeview>
    </v-col>
  </v-card>
</template>

<script>
//import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { defaultRule } from "@/components/utils";
import axios from "axios";

export default {
  name: "SiteRankingComponent",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      urlFieldModel: "",
      defaultComboItems: [
        "https://www.washingtonpost.com/",
        "https://www.nytimes.com/",
        "https://www.wsj.com/",
        "https://github.com/"
      ],
      chipModel: [0],
      chips: ["url", "sitemap", "a"],
      derinlikModel: "1",
      buttonLoading: false,
      buttonDisabled: true,
      treeView: [],
      treeSelection: []
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  watch: {
    treeSelection: {
      deep: true,
      handler(v) {
        console.log("Deep Watch", v);
      }
    }
  },
  methods: {
    request: function() {
      if (!this.$refs["ranking-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      console.log("Model", this.urlFieldModel);
      axios
        .post("http://localhost:3000/urltest", {
          url: this.getDynamicURL()
        })
        .then(res => {
          console.log("Response Axios", res);
          this.buttonLoading = false;
          this.createHTML(res.data);
        })
        .catch(e => {
          console.log("Error ", e);
        });
    },
    getDynamicURL: function() {
      switch (this.chipModel) {
        case 0:
          return `${this.urlFieldModel}sitemap.xml`;
        case 1:
          return `${this.urlFieldModel}sitemap.xml`;
        case 2:
          return this.urlFieldModel;
        default:
          return this.urlFieldModel;
      }
    },
    createHTML: function(data) {
      const selectors = this.chips[this.chipModel];
      let sitemap = [];
      console.log("Pler", sitemap);
      //get the urlModel to substring

      if (this.chipModel === 0 || this.chipModel === 1) {
        const newDomHtml = new DOMParser().parseFromString(data, "text/xml");
        console.log("New DOM", newDomHtml);
        sitemap = [...newDomHtml.querySelector(selectors)];
        this.siteMapOrUrl(sitemap);
      } else if (this.chipModel === 2) {
        const newDomHtml = new DOMParser().parseFromString(data, "text/html");
        console.log("New DOM", newDomHtml);
        sitemap = [...newDomHtml.getElementsByTagName(selectors)];
        console.log("Anchor tags ", sitemap);
        this.anchorTags(sitemap);
      }
    },
    anchorTags: function(tags) {
      const hrefSet = tags
        .filter(m => !m.getAttribute("href").includes("#"))
        .map(m => {
          return {
            url: m.getAttribute("href")
          };
        });
      console.log("URLS", hrefSet);
      const urls = hrefSet
        .filter(s => s.url !== this.urlFieldModel)
        .map(m => {
          return {
            url: m.url
              .slice(this.urlFieldModel.length - 1)
              .split("/")
              .filter(m => m !== "")
          };
        })
        .filter(x => x.url.length === Number(this.derinlikModel))
        /*.map(m => {
          if (this.derinlikModel === "1") {
            return {
              name: m.url[0],
              key: uuidv4()
            };
          } else if (this.derinlikModel === "2" || this.derinlikModel === "3") {
            return {
              name: m.url[0],
              key: uuidv4(),
              children: this.convertToArrayOfObjects(m.url.slice(1))
            };
          }
        });
      console.log("URLS MAPPED DEPTH" + this.derinlikModel, { ...urls });
      this.treeView = urls;*/
      console.log("URLS", urls);
    },
    siteMapOrUrl: function(sitemap) {
      const urls = sitemap.map(s => {
        //console.log("Sitemap S", s);
        return {
          url: s
            .getElementsByTagName("loc")[0]
            .textContent.slice(this.urlFieldModel.length - 1)
        };
      });
      console.log("URLS", urls);
      const depthSearch = urls.filter(
        m => (m.url.match(/[/]/g) || []).length === Number(this.derinlikModel)
      );
      console.log("DEPTH", depthSearch);
      let treeview = {};
      depthSearch.forEach(m => {
        let depth1 = m.url.slice(
          m.url.indexOf("/"),
          m.url.indexOf("/", m.url.indexOf("/") + 1)
        );
        let depth2 = m.url.slice(
          m.url.indexOf("/", m.url.indexOf("/") + 1),
          m.url.length + 1
        );
        //console.log("Sliced1", depth1);
        //console.log("Sliced 2", depth2);
        if (treeview[depth1] !== undefined) {
          treeview[depth1].push(depth2);
        } else {
          treeview[depth1] = [depth2];
        }
      });

      this.treeView = Object.keys(treeview).map(key => {
        return {
          name: key,
          key: uuidv4(),
          children: this.convertToArrayOfObjects(treeview[key])
        };
      });

      console.log("TREEVIEW", treeview);
      console.log("TREEVIEW MAPPED", this.treeView);
    },
    convertToArrayOfObjects: function(array) {
      return array.map(m => {
        return {
          name: m,
          key: uuidv4()
        };
      });
    },
    visitWebsite: function() {
      console.log("Tree Model", this.treeSelection);
    }
  }
};
</script>

<style scoped></style>
