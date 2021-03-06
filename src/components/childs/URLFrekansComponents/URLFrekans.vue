<template>
  <div>
    <u-r-l-frekans-dialog
      :sorted-frequency="sortedFrequency"
        :dialog-model="showDialog"
      @frekansDialogClosed="frekansDialogClosed"
    />
    <v-card>
      <v-app-bar color="indigo" dense>
        <v-app-bar-title class="white--text">{{ label }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn
          @click="request"
          color="white"
          medium
          fab
          icon
          :loading="buttonLoading"
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
        <v-form ref="url-form" v-model="formValid">
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
          >Filtreler: (İstenilen HTML etiketlerini seçebilirsiniz.)</span
        >
        <v-chip-group v-model="chipModel" multiple show-arrows>
          <v-chip v-for="(chip, i) in chips" :key="i" filter outlined>
            {{ chip }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import URLFrekansDialog from "@/components/childs/URLFrekansComponents/URLFrekansDialog";
import axios from "axios";
import { defaultRule } from "@/components/utils";

export default {
  name: "URLFrekans",
  props: {
    label: {
      required: false,
      type: String
    }
  },
  components: {
    URLFrekansDialog
  },
  data() {
    return {
      urlFieldModel: "",
      formValid: false,
      defaultComboItems: [
        "https://loremipsum.io/",
        "https://lite.cnn.com/en",
        "https://en.m.wikipedia.org/wiki/Riegelmann_Boardwalk",
        "https://rawtext.club/"
      ],
      chipModel: [0],
      chips: ["p", "h1", "h2", "h3", "h4", "h5", "blockquote"],
      htmlData: "",
      eachWordArray: [],
      scrapedText: "",
      buttonLoading: false,
      dialog: false,
      showDialog: false,
      sortedFrequency: [],
      buttonDisabled: true,
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  methods: {
    request: function() {
      if (!this.$refs["url-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      console.log("Model", this.urlFieldModel);
      axios
        .post("http://localhost:3000/urltest", {
          url: this.urlFieldModel
        })
        .then(res => {
          console.log("Response Axios", res);
          this.buttonLoading = false;
          this.createTexts(res.data);
        })
        .catch(e => {
          console.log("Error ", e);
        });
    },
    createTexts: function(data) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      console.log("FİLTERS", selectors);
      this.htmlData = new DOMParser().parseFromString(data, "text/html");
      const pElements = [...this.htmlData.querySelectorAll(selectors)];
      console.log("Pler", pElements);
      const texts = pElements.map(p => p.innerText);
      console.log("HTML", this.htmlData);
      this.scrapedText = texts.join(" ").replace(/[.()-,\n?!,*'":;]/g, "");
      this.eachWordArray = this.scrapedText
        .split(" ")
        .filter(m => m.length !== 0 || m === "↵");
      console.log("Scraped Text = > ", this.scrapedText);
      console.log("Each Word Array = > ", this.eachWordArray);

      const freq = this.eachWordArray.reduce((p, c) => {
        p[c] = (p[c] || 0) + 1;
        return p;
      }, {});

      this.sortedFrequency = Object.keys(freq)
        .map(m => {
          return { text: m, size: freq[m] };
        })
        .sort((a, b) => (a.size < b.size ? 1 : -1));
      console.log("Frequency", this.sortedFrequency);
      this.buttonDisabled = false;
    },
    frekansDialogClosed: function() {
      this.showDialog = false;
    }
  }
};
</script>

<style scoped></style>
