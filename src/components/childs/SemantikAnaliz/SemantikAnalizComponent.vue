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
import { defaultRule } from "@/components/utils";

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
    }
  }
};
</script>

<style scoped></style>
