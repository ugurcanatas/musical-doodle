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
        <v-card-title class="py-2 white--text">Webpage Keywords </v-card-title>
      </v-row>


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
  </div>
</template>

<script>
/*eslint-disable*/
import SiteRankingDialog from "@/components/childs/SiteSıralama/SiteRankingDialog";
import { v4 as uuidv4 } from "uuid";
import { defaultRule, convertUrlsToTreeViews, whichURL, urlSet } from "@/components/utils";
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
      urlFieldModel: "",
      defaultComboItems: [
        "https://www.washingtonpost.com/",
        "https://www.nytimes.com/",
        "https://www.wsj.com/",
        "https://github.com/"
      ],
      chipModel: [],
      chips: ["url", "sitemap", "a"],
      derinlikModel: "1",
      buttonLoading: false,
      buttonDisabled: true,
      showDialog: false,
      treeView: [],
      depthURLS: [],
      treeSelection: [],
      urlSet: []
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    },
    getUrlSet: function() {
      return urlSet;
    },
  },
  methods: {
    request: function () {
      if (!this.$refs["ranking-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      console.log("Model", this.urlFieldModel);
      axios
          .post(whichURL, {
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
    /*
     * Return url concat.
     * determined by which filter is selected.
     * */
    getDynamicURL: function () {
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
  }
};
</script>

<style scoped></style>
