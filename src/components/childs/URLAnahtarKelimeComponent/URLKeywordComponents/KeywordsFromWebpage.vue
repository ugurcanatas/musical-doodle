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
    <v-card elevation="6" class="pb-4">
      <v-row
        :style="`background-color: ${componentItem.barColor}`"
        class="align-center"
        no-gutters
      >
        <v-card-title class="py-2 white--text">Webpage Keywords </v-card-title>
      </v-row>
      <div class="subtitle-1 mx-4 pb-0 pt-4">
        Web sayfası meta etiketlerini inceleyerek anahtar kelimelerin bulunması
        işlemi
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-form ref="tag-form" v-model="valid">
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
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-title class="pb-2">Filtreler</v-card-title>
      <v-card-text class="pb-0">
        <div>
          Anahtar kelimeleri, <code>meta</code> etiketi içerisindeki
          <code>description</code>, <code>title</code>, <code>keywords</code>,
          <code>application-name</code>,
          <code>author</code>
          özelliklerine bakarak bulabiliriz.
        </div>
      </v-card-text>
      <v-card-text>
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
  </div>
</template>

<script>
/*eslint-disable*/
import AnahtarKelimeDialog from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordDialogs/AnahtarKelimeDialog";
import axios from "axios";
import {
  defaultRule,
  reducerFrequency,
  whichURL,
  urlSet
} from "@/components/utils";

export default {
  name: "KeywordsFromWebpage",
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
      buttonDisabled: true,
      buttonLoading: false,
      showDialog: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["description", "title", "keywords", "application-name", "author"],
      chipModel: [0],
      sortedFrequency1: [],
      sortedFrequency2: []
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
      console.log("MDE", this.urlFieldModel1);
      console.log("MDE", this.urlFieldModel2);
      if (!this.$refs["tag-form"].validate()) {
        return;
      }
      this.buttonLoading = true;
      const requestFirst = axios.post(whichURL, {
        url: this.urlFieldModel1
      });
      const requestSecond = axios.post(whichURL, {
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
      const selectors = this.chipModel.map(v => this.chips[v]);
      const html1 = new DOMParser().parseFromString(v1, "text/html");
      const firstElements = [...html1.querySelectorAll("meta")];
      const html2 = new DOMParser().parseFromString(v2, "text/html");
      const secondElements = [...html2.querySelectorAll("meta")];

      console.log("Parsed First", firstElements);
      const tagsFirst = firstElements
        .filter(meta => meta.getAttribute("name") !== null)
        .filter(meta => {
          const name = meta.getAttribute("name").toUpperCase();
          return (
            selectors.some(el => {
              return name.match(new RegExp(el.toUpperCase(), "i"));
            }) && meta
          );
        })
        .map(m => m.getAttribute("content"));

      console.log("TAGS FIRST", tagsFirst);

      //console.log("Parsed Second", secondElements);

      /*      const tagsFirst = firstElements
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

      console.log("TAGS FIRST", tagsFirst);*/
      /*
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
      this.sortedFrequency2 = reducerFrequency(eachWordSecond);*/

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

<style scoped>
code {
  color: #000000 !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #e0e0e0 !important;
}
pre {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-left: 3px solid #f36d33;
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
}
</style>
