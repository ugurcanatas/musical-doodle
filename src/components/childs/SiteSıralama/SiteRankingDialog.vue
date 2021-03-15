<template>
  <v-row no-gutters>
    <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
      <v-card class="pb-4">
        <v-row
          style="background-color: deeppink"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text">Ana Url </v-card-title>
        </v-row>
        <div class="mx-4 pb-0 pt-4">
          <pre class="my-0"><label>URL:</label><code>{{ urlName }}</code></pre>
        </div>
        <v-divider class="mx-4"></v-divider>
        <keywords-comp :frequency-list="mainList" />
      </v-card>
    </v-col>
    <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
      <v-card>
        <v-row
          style="background-color: deeppink"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text">URL Set </v-card-title>
        </v-row>
        <v-row
          class="my-0 pt-0 pb-4"
          :style="
            key % 2 === 0
              ? `background-color:#fbfbfb`
              : `background-color:#efefef`
          "
          :key="item.url"
          v-for="(item, key) in urlSetList"
          no-gutters
        >
          <div class="mx-4 pb-0 pt-4">
            <pre
              class="my-0"
            ><label>URL:</label><code>{{ item.url }}</code></pre>
          </div>
          <v-divider class="ma-4"></v-divider>

          <v-card elevation="2" class="mx-4" width="100%">
            <v-card-actions>
              <code class="code-card-title">🔑 URL anahtar kelimeler</code>
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize"
                text
                medium
                @click="item.showKeywords = !item.showKeywords"
              >
                <v-icon color="red">{{
                  item.showKeywords ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
                {{ item.showKeywords ? "Kapat" : "Göster" }}
              </v-btn>
            </v-card-actions>

            <v-lazy
              v-model="active"
              :options="{
                threshold: 0.5
              }"
              transition="fade-transition"
              min-height="0"
            >
              <div v-show="item.showKeywords">
                <v-divider></v-divider>
                <keywords-comp :frequency-list="item.frequencyList" />
              </div>
            </v-lazy>
          </v-card>

          <v-divider class="ma-4"></v-divider>

          <v-card elevation="2" class="mx-4" width="100%">
            <v-card-actions>
              <code class="code-card-title">🌲 URL ağaç yapısı</code>
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize"
                text
                medium
                @click="item.showNodes = !item.showNodes"
              >
                <v-icon color="red">{{
                  item.showNodes ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
                {{ item.showNodes ? "Kapat" : "Göster" }}
              </v-btn>
            </v-card-actions>

            <v-lazy
              v-model="active"
              :options="{
                threshold: 0.5
              }"
              transition="fade-transition"
              min-height="0"
            >
              <div v-show="item.showNodes">
                <treeview-dialog :tree-list="item.anchors" />
              </div>
            </v-lazy>
          </v-card>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import TreeviewDialog from "@/components/childs/SiteSıralama/TreeviewComp";
import KeywordsComp from "@/components/childs/SiteSıralama/KeywordsComp";
export default {
  name: "SiteRankingDialog",
  components: {
    TreeviewDialog,
    KeywordsComp
  },
  props: {
    dialogModel: {
      type: Boolean,
      required: false,
      default: false
    },
    urlName: {
      type: String,
      required: false
    },
    mainList: {
      type: Array,
      required: false,
      default: () => []
    },
    urlSetList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      showSelect: {},
      selectionModel: [],
      show: false,
      active: true,
    };
  },
  created () {
    console.log("JSON", this.urlSetList);
  }
};
</script>

<style scoped></style>
