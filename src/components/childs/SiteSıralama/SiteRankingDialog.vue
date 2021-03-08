<template>
  <v-dialog v-model="dialogModel" persistent width="500" min-width="500">
    <v-app-bar color="indigo accent-4">
      <v-app-bar-title class="white--text">Bulunan Kelimeler</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" @click="requestLink" fab icon
      ><v-icon>mdi-download</v-icon></v-btn
      >
      <v-btn class="white--text" @click="$emit('rankingDialogClosed')" fab icon
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-app-bar>
    <v-card min-height="300" style="overflow-y: scroll !important;">
      <v-col>
        <p>{{selectionModel}}</p>
        <v-treeview
          selection-type="leaf"
          selectable
          v-model="selectionModel"
          return-object
          :items="treeview"
          item-key="key"
          open-on-click
          @click="treeclick"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? "mdi-folder-open" : "mdi-folder" }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.file] }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
    </v-card>
  </v-dialog>
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
    treeview: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      selectionModel: []
    }
  },
  methods: {
    requestLink: function () {
      console.log("This. selection", this.selectionModel);
    },
    treeclick: function (v) {
      console.log("Tree Clicked", v);
    }
  }
};
</script>

<style scoped></style>
