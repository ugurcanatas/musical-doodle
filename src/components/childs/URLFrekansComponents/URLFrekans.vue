<template>
  <div>
    <v-snackbar v-model="snackbar" :color="snack_color">
      {{ snack_text }}
    </v-snackbar>
    <template>
      <v-card elevation="6" :loading="buttonLoading" class="mx-auto my-0">
        <template slot="progress">
          <v-progress-linear
            color="pink lighten-2"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title
          :style="`background-color:${componentItem.barColor}`"
          class="py-2 white--text"
          >{{ componentItem.label }}</v-card-title
        >
        <v-card-text class="pb-0 pt-4">
          <div class="my-0 subtitle-1">
            {{ componentItem.excerpt }}
          </div>
        </v-card-text>

        <v-card-text>
          <v-form ref="url-form" v-model="formValid">
            <v-combobox
              class="pt-0"
              v-model="urlFieldModel"
              label="Url giriniz"
              :rules="getDefaultRule"
              :items="getUrlSet"
            />
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
    <u-r-l-frekans-dialog
      v-if="showDialog"
      :sorted-frequency="sortedFrequency"
      :overlay-value="buttonLoading"
    />
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
      snack_text: "",
      snackbar: false,
      snack_color: "error"
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
        this.snack_text =
          "İstek yapabilmek için form dolu olmalı ve en az bir filtre seçilmelidir.";
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
          this.snack_text = "Başarılı";
          this.snack_color = "success";
          this.createTexts(res.data);
        })
        .catch(e => {
          console.log("Error ", e);
          this.buttonLoading = false;
          this.snackbar = true;
          this.snack_text = "Bir hata oluştu";
          this.snack_color = "error";
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

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
