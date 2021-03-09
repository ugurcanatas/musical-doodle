<template>
  <v-card class="mt-6">
    <v-app-bar :color="componentItem.barColor" dense>
      <v-app-bar-title class="white--text">{{
        componentItem.label
      }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$refs['tag-form'].reset()" color="white" medium fab icon
        ><v-icon>mdi-delete</v-icon></v-btn
      >
      <v-btn
        @click="compare"
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
              label="Temel Url"
              :rules="getDefaultRule"
              :items="defaultComboItems"
              v-model="urlFieldModel1"
            />
          </v-col>
          <v-col class="col-6 pl-2">
            <v-combobox
              multiple
              label="Karşılaştırılacak Url Set"
              :rules="getDefaultRule"
              :items="defaultComboItems"
              v-model="urlFieldModel2"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-text v-if="showBottom">
      <v-row no-gutters>
        <v-col class="col-6">
          <v-card-title class="pl-0"
            >Temel URL Anahtar Kelimeleri:</v-card-title
          >
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Kelime
                </th>
                <th class="text-left">
                  Tekrar
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in sortedFrequency1"
                  :key="item.name"
              >
                <td>{{ item.text }}</td>
                <td>{{ item.size }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col class="col-6">
          <v-card-title class="pl-0">Karşılaştırılacak URL'ler:</v-card-title>
          <v-row no-gutters>
            <v-col v-for="(item, i) in this.sortedFrequency2" :key="i">
              <p>Url Adı:</p>
              <p>{{ item.url }}</p>
              <div>
                {{ item.frequencyList }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { defaultRule, reducerFrequency } from "@/components/utils";

export default {
  name: "KeywordsFromUrlSet",
  props: {
    componentItem: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      valid: false,
      defaultComboItems: [
          "https://www.cumhuriyet.com.tr/haber/gunde-en-az-uc-kadin-olduruluyor-1819317",
        "https://www.wsj.com/articles/cdc-says-fully-vaccinated-people-can-gather-in-small-groups-without-masks-11615219222?mod=politics_lead_pos4",
        "https://www.wsj.com/articles/supreme-court-wont-review-banks-bid-to-arbitrate-stale-debts-11615242719",
        "https://www.wsj.com/articles/plastics-recycler-carbonlite-files-for-bankruptcy-11615226888",
        "https://www.wsj.com/articles/medley-unit-files-for-bankruptcy-aiming-for-debt-swap-with-bondholders-11615247245",
        "https://www.wsj.com/articles/law-firm-kirkland-ellis-resigns-from-travelport-over-disputed-1-billion-debt-deal-11591762991",
        "https://www.wsj.com/articles/citi-has-options-but-faces-hurdles-to-retrieving-500-million-revlon-goof-11614213945"
      ],
      buttonDisabled: true,
      buttonLoading: false,
      showDialog: false,
      urlFieldModel1: "",
      urlFieldModel2: "",
      chips: ["meta", "title"],
      chipModel: [0],
      sortedFrequency1: [],
      sortedFrequency2: [],
      showBottom: false
    };
  },
  computed: {
    getDefaultRule: function() {
      return defaultRule;
    }
  },
  methods: {
    createWords: function(url) {
      const tempAnchor = document.createElement("a");
      tempAnchor.setAttribute("href", url);
      const path = tempAnchor.pathname;
      const pathReplaced = path.replace(/[\W_-]/g, "-");
      return pathReplaced.split("-");
    },
    compare: function() {
      console.log("First URL Base", this.urlFieldModel1);
      console.log("Second Url Base", this.urlFieldModel2);

      // Bu kısmın tekrar etme aşamaları açıklanacak.
      const splittedWords = this.createWords(this.urlFieldModel1);
      console.log("First URL Keywords", splittedWords);
      this.sortedFrequency1 = reducerFrequency(splittedWords);
      console.log("FREQ 1", this.sortedFrequency1);

      const urlSetOfWords = this.urlFieldModel2.map(url => {
        console.log("Traverse url", url);
        return {
          url: url,
          keywords: this.createWords(url)
        };
      });

      this.sortedFrequency2 = urlSetOfWords.map(m => {
        return { url: m.url, frequencyList: reducerFrequency(m.keywords) };
      });

      console.log("FREQ 2", this.sortedFrequency2);

      //console.log("First Splitted", splittedWords);
      //console.log("Set Of Words", urlSetOfWords);

      this.showBottom = true;
    }
  }
};
</script>

<style scoped></style>
