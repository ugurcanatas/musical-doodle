<template>
  <div>
    <v-snackbar
        v-model="snackbar"
        :color="snack_color"
    >
      {{ snack_text }}
    </v-snackbar>
    <u-r-l-frekans-dialog
      :sorted-frequency="sortedFrequency"
      :dialog-model="showDialog"
      @frekansDialogClosed="frekansDialogClosed"
    />
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
        <v-form ref="url-form" v-model="formValid">
          <v-combobox
            v-model="urlFieldModel"
            label="Url giriniz"
            :rules="getDefaultRule"
            :items="getUrlSet"
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
import {
  defaultRule,
  reducerFrequency,
  urlSet,
  whichURL
} from "@/components/utils";

export default {
  name: "URLFrekans",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  components: {
    URLFrekansDialog
  },
  data() {
    return {
      urlFieldModel: "",
      formValid: false,
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
      snack_text: '',
      snackbar: false,
      snack_color: 'error'
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
      if (!this.$refs["url-form"].validate() || this.chipModel.length === 0) {
        this.snackbar = true;
        this.snack_text = "İstek yapabilmek için form dolu olmalı ve en az bir filtre seçilmelidir."
        return;
      }
      this.buttonLoading = true;
      console.log("Model", this.urlFieldModel);
      axios
        .post(whichURL, {
          url: this.urlFieldModel
        })
        .then(res => {
          console.log("Response Axios", res);
          this.buttonLoading = false;
          this.snackbar = true;
          this.snack_text = 'Başarılı'
          this.snack_color = 'success';
          this.createTexts(res.data);
        })
        .catch(e => {
          console.log("Error ", e);
          this.buttonLoading = false;
          this.snackbar = true;
          this.snack_text = 'Bir hata oluştu'
          this.snack_color = 'error';
        });
    },
    /**
     * @param data : String
     * */
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
        .filter(m => m.length !== 0);
      console.log("Scraped Text = > ", this.scrapedText);
      console.log("Each Word Array = > ", this.eachWordArray);

      this.sortedFrequency = reducerFrequency(this.eachWordArray);
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
