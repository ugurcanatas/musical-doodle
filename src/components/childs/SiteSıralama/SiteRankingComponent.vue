<template>
  <v-card>
    <v-app-bar :color="componentItem.barColor" dense>
      <v-app-bar-title class="white--text">{{
        componentItem.label
      }}</v-app-bar-title>
      <v-spacer></v-spacer>
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
      <v-chip-group v-model="chipModel" multiple show-arrows>
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
  </v-card>
</template>

<script>
//import axios from "axios";
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
      buttonDisabled: true
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
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
          url: `${this.urlFieldModel}sitemap.xml`
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
    createHTML: function(data) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      const newDomHtml = new DOMParser().parseFromString(data, "text/xml");
      console.log("New DOM", newDomHtml);
      const sitemap = [...newDomHtml.querySelectorAll(selectors)];
      console.log("Pler", sitemap);
      //get the urlModel to substring

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

      console.log("TREEVIEW", treeview);
      /*eslint-disable*/
      const sample = {
        news: [
          { types: ["url"] },
          { business: ["url", "url"] },
          { tech: ["url", "url"] }
        ],
        graphics: [{ econsurvey: ["url"] }]
      };
    }
  }
};
</script>

<style scoped></style>
