<template>
  <v-lazy
    v-model="active"
    :options="{
      threshold: 0.5
    }"
    transition="fade-transition"
    min-height="0"
  >
    <v-card flat>
      <v-list
        class="px-4"
        :style="
          nIndex % 2 === 0
            ? `background-color:#fbfbfb`
            : `background-color:#efefef`
        "
        v-for="(node, nIndex) in treeList"
        :key="nIndex"
      >
        <v-row class="no-gutters justify-space-between">
          <code class="code-depth-label">Derinlik: {{ node.depth }}</code>
          <code class="code-url-path">Full Path: {{ node.pathname }}</code>
        </v-row>
        <v-card-text class="px-0 py-2">
          <div
            v-for="(tree, tIndex) in node.tree"
            :key="tIndex"
            :style="`margin-left:${getMargin(tIndex)}px;`"
          >
            <div>
              <v-row no-gutters>
                <code
                  :style="
                    `cursor: pointer; background-color:${
                      tree.showUrlWords ? tree.colorOpen : tree.colorClose
                    }!important; border:1px solid ${
                      !tree.showUrlWords && tree.colorOpen
                    }!important;`
                  "
                  @click="tree.showUrlWords = !tree.showUrlWords"
                  class="my-2"
                >{{tIndex}}
                  <v-icon>{{
                    tree.showUrlWords ? "mdi-chevron-down" : "mdi-chevron-right"
                  }}</v-icon
                  >{{ tree.path }}
                </code>
              </v-row>
              <v-row v-if="tree.showUrlWords" no-gutters>
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
                      :style="`background-color:${getColors(wi)} !important;`"
                      >{{ w.text }}</code
                    >
                  </v-badge>
                </div>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-list>
    </v-card>
  </v-lazy>
</template>

<script>
export default {
  name: "TreeviewDialog",
  props: {
    treeList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      active: false
    };
  },
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
    getMargin: function (i) {
      switch (i) {
        case 0:
          return 0;
        case 1:
          return 30;
        case 2:
          return 60;
        default:
          return 0;
      }
    }
  }
};
</script>

<style scoped></style>
