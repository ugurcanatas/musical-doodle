<template>
  <div>
    <anahtar-kelime-dialog
      :sorted-frequency1="sortedFrequency1"
      :sorted-frequency2="sortedFrequency2"
      :dialog-model="showDialog"
      @anahtarDialogClosed="anahtarDialogClosed"
      :url-name1="urlFieldModel1"
      :url-name2="urlFieldModel2"
    />
    <v-card>
      <v-app-bar :color="componentItem.barColor" dense>
        <v-app-bar-title class="white--text">{{
          componentItem.label
        }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn @click="$refs['tag-form'].reset()" color="white" medium fab icon
          ><v-icon>mdi-delete</v-icon></v-btn
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
  </div>
</template>

<script>
import AnahtarKelimeDialog from "@/components/childs/URLAnahtarKelimeComponent/AnahtarKelimeDialog";
import axios from "axios";
import { defaultRule, reducerFrequency } from "@/components/utils";

export default {
  name: "URLAnahtarKelime",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  components: {
    AnahtarKelimeDialog
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
        "https://www.w3schools.com/",
        "https://www.washingtonpost.com/",
        "https://www.nytimes.com/",
        "https://www.wsj.com/"
      ],
      buttonDisabled: true,
      buttonLoading: false,
      showDialog: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["meta", "title"],
      chipModel: [0],
      sortedFrequency1: [],
      sortedFrequency2: []
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
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

      const tagsSecond = secondElements
        .filter(tag => {
          if (tag.hasAttribute("name")) {
            console.log("HAS NAME", tag);
            const name = tag.getAttribute("name").toLowerCase();
            console.log("NAME", name);
            if (
              name.includes("title") ||
              name.includes("description") ||
              name.includes("keywords")
            ) {
              console.log("CONTENT ATTR", tag.getAttribute("content"));
              return tag;
            }
          }
        })
        .map(m => m.getAttribute("content"));

      const eachWordFirst = tagsFirst
        .join("")
        .replace(/[()-,\n?!,*'":;]/g, " ")
        .split(" ")
        .filter(m => m.length !== 0);
      console.log("Tags First", eachWordFirst);
      const eachWordSecond = tagsSecond
        .join("")
        .replace(/[()-,\n?!,*'":;]/g, " ")
        .split(" ")
        .filter(m => m.length !== 0);
      console.log("Tags Second", eachWordSecond);

      this.sortedFrequency1 = reducerFrequency(eachWordFirst);
      this.sortedFrequency2 = reducerFrequency(eachWordSecond);

      this.buttonDisabled = false;
      console.log("Frequency 1", this.sortedFrequency1);
      console.log("Frequency 2", this.sortedFrequency2);
    },
    anahtarDialogClosed: function() {
      this.showDialog = false;
    }
  }
};
</script>

<style scoped></style>
