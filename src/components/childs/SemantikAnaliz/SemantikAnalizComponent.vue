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
      <v-form ref="semantic-form">
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
    </v-col>
  </v-card>
</template>

<script>
import { defaultRule, keywordRegex } from "@/components/utils";
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
      defaultComboItems: [
        "https://www.washingtonpost.com/",
        "https://www.nytimes.com/",
        "https://www.wsj.com/",
        "https://github.com/"
      ],
      chipModel: [0],
      chips: ["meta", "title"],
      buttonLoading: false,
      buttonDisabled: true,
      showDialog: false
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  methods: {
    request: function() {
      if (!this.$refs["semantic-form"].validate()) {
        return;
      }
      console.log("Semantic");
      this.buttonLoading = true;
      if (process.env.NODE_ENV === "development") {
        axios
          .post(process.env.VUE_APP_DEV_URL, {
            url: this.urlFieldModel
          })
          .then(response => {
            console.log("RESPONSE DATA", response.data);
            this.parser(response.data);
            this.buttonLoading = false;
          })
          .catch(e => {
            console.log("Error", e);
          });
      } else {
        axios
          .get(this.urlFieldModel, {
            headers: {
              "Access-Control-Allow-Origin":
                "https://musical-doodle.vercel.app/",
              "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
              "Access-Control-Allow-Headers":
                "Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent"
            }
          })
          .then(response => {
            console.log("RESPONSE DATA", response.data);
            this.parser(response.data);
            this.buttonLoading = false;
          })
          .catch(e => {
            console.log("Error", e);
          });
      }
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
    }
  }
};
</script>

<style scoped></style>
