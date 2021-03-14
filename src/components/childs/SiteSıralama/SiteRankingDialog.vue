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
        <div class="mx-4 pb-0 pt-4">
          <pre><label>İçerik & Frekanslar:</label>
            <v-row no-gutters>
              <div v-for="(freq, i) in mainList" :key="i" class="mr-4">
                <v-badge
                        offset-x="15"
                        :content="freq.size"
                        :value="freq.size"
                        color="#f74f60"
                        overlap
                >
                  <code class="code-semantics" :class="(i===0||i === 1 || i === 2) ? 'black--text': 'white--text'"
                        :style="`background-color:${getColors(i)} !important;`">{{freq
                      .text}}</code>
                </v-badge>
              </div>
            </v-row>
          </pre>
        </div>
      </v-card>
    </v-col>
    <v-col class="col-xl-6 col-lg-6 col-sm-12 pa-2">
      <v-card class="pb-4">
        <v-row
          style="background-color: deeppink"
          class="align-center"
          no-gutters
        >
          <v-card-title class="py-2 white--text">URL Set </v-card-title>
        </v-row>
        <v-row :key="item.url" v-for="item in urlSetList" no-gutters>
          <div class="mx-4 pb-0 pt-4">
            <pre
              class="my-0"
            ><label>URL:</label><code>{{ item.url }}</code></pre>
          </div>
          <v-divider class="mx-4"></v-divider>

          <v-card flat class="mx-4" width="100%">
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

            <v-expand-transition>
              <div v-show="item.showNodes">
                <v-divider></v-divider>

                <v-list
                  v-for="(node, nIndex) in item.anchors"
                  :key="nIndex"
                >
                  <v-row class="no-gutters justify-space-between">
                    <code>Derinlik: {{ node.depth }}</code>
                    <code>Full Path: {{ node.pathname }}</code>
                  </v-row>
                  <v-card-text>
                    <div
                      v-for="(tree, tIndex) in node.tree"
                      :key="tIndex"
                      :style="`margin-left:${tIndex * 10}px;`"
                    >
                      <div>
                        <v-row no-gutters>
                        <code class="my-2">
                          <v-icon>mdi-chevron-right</v-icon>{{ tree.path }}
                        </code>
                        </v-row>
                        <span>Kelimeler: </span>
                        <v-row no-gutters>
                        <div v-for="(w, wi) in tree.words" :key="wi" class="mb-4 mr-4">

                          <v-badge
                            offset-x="5"
                            :content="w.size"
                            :value="w.size"
                            color="#f74f60"
                            overlap
                          >
                            <code
                              class="code-semantics"
                              :class="
                                wi === 0 || wi === 1 || wi === 2
                                  ? 'black--text'
                                  : 'white--text'
                              "
                              :style="
                                `background-color:${getColors(wi)} !important;`
                              "
                              >{{ w.text }}</code
                            >
                          </v-badge>
                        </div>
                        </v-row>
                      </div>
                    </div>
                    <v-divider class="mx-0"></v-divider>
                  </v-card-text>
                </v-list>
              </div>
            </v-expand-transition>
          </v-card>
          <v-divider class="mx-4"></v-divider>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SiteRankingDialog",
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
      selectionModel: [],
      show: false
    };
  },
  computed: {},
  methods: {
    getColors: function(i) {
      switch (i) {
        case 0:
          return "#FFD700";
        case 1:
          return "#C0C0C0";
        case 2:
          return "#cd7f32";
        default:
          return "#7a8add";
      }
    },
    getPrize: function(i) {
      switch (i) {
        case 0:
          return "🥇";
        case 1:
          return "🥈";
        case 2:
          return "🥉";
        default:
          return "🏆";
      }
    }
  }
};
</script>

<style scoped></style>
