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
      <v-form ref="tag-form" v-model="valid">
        <v-row no-gutters>
          <v-col class="col-6 pr-2">
            <v-combobox
              label="Url 1"
              :rules="getDefaultRule"
              :items="defaultComboItems"
              v-model="urlFieldModel1"
            />
          </v-col>
          <v-col class="col-6 pl-2">
            <v-combobox
              label="Url 2"
              :rules="getDefaultRule"
              :items="defaultComboItems"
              v-model="urlFieldModel2"
            />
          </v-col>
        </v-row>
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
        <v-chip v-for="(chip, i) in chips" :key="i" filter outlined>
          {{ chip }}
        </v-chip>
      </v-chip-group>
    </v-col>
  </v-card>
</template>

<script>
import axios from "axios";
import { defaultRule } from "@/components/utils";

export default {
  name: "URLAnahtarKelime",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  data() {
    return {
      valid: false,
      defaultComboItems: [
        "https://loremipsum.io/",
        "https://lite.cnn.com/en",
        "https://en.m.wikipedia.org/wiki/Riegelmann_Boardwalk",
        "https://rawtext.club/",
        "https://lite.poandpo.com/",
        "https://www.w3schools.com/"
      ],
      buttonDisabled: true,
      buttonLoading: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["meta", "title"],
      chipModel: [0]
    };
  },
  methods: {
    request: function() {
      console.log("MDE", this.urlFieldModel1);
      console.log("MDE", this.urlFieldModel2);
      if (!this.$refs["tag-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      const requestFirst = axios.post("http://localhost:3000/urltest", {
        url: this.urlFieldModel1
      });
      const requestSecond = axios.post("http://localhost:3000/urltest", {
        url: this.urlFieldModel2
      });
      axios
        .all([requestFirst, requestSecond])
        .then(
          axios.spread((...responses) => {
            const [responseFirst, responseSecond] = responses;
            /*console.log("Res First", responseFirst.data);
            console.log("Res Second", responseSecond.data);*/
            this.parser(responseFirst.data, responseSecond.data);
            this.buttonLoading = false;
          })
        )
        .catch(e => {
          console.log("Error Received", e);
        });
      console.log("ASDLKSAMDKASMDSAMD");
    },
    parser: function(v1, v2) {
      const selectors = this.chipModel.map(v => this.chips[v]).join(",");
      const html1 = new DOMParser().parseFromString(v1, "text/html");
      const firstElements = [...html1.querySelectorAll(selectors)];
      const html2 = new DOMParser().parseFromString(v2, "text/html");
      const secondElements = [...html2.querySelectorAll(selectors)];

      console.log("Parsed First", firstElements);
      console.log("Parsed Second", secondElements);

      const tagsFirst = firstElements
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

      console.log("Tags First", tagsFirst.join("").replace(/[.()-,\n?!,*'":;]/g, " "));
    }
  }
};
</script>

<style scoped></style>
