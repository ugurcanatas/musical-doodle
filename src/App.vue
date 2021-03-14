<template>
  <v-app id="main-wrap">
    <v-app-bar app style="background-color: wheat">
      <v-menu nudge-bottom="50" bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab icon dark v-bind="attrs" v-on="on">
            <v-icon color="black">mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in propsCars" :key="i">
            <v-list-item
              :active-class="'drawerActive' + '--text'"
              :key="item.path"
              :to="item.path"
              link
            >
              <v-list-item-title color="drawerText">{{
                item.label
              }}</v-list-item-title>
            </v-list-item>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-app-bar-title>Web Indexing/Scraping</v-app-bar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-row no-gutters>
        <v-col class="col-12 pa-6">
          <router-view :key="$route.path" />
        </v-col>
      </v-row>
    </v-main>
    <v-fade-transition>
      <v-btn
        @click="goTop"
        v-show="showUpBtn"
        small
        fixed
        right
        bottom
        class="indigo accent-3"
        fab
        icon
      >
        <v-icon class="white--text">mdi-chevron-up</v-icon>
      </v-btn>
    </v-fade-transition>
  </v-app>
</template>

<script>
import URLFrekans from "@/components/childs/URLFrekansComponents/URLFrekans";
import SiteRankingComponent from "@/components/childs/SiteSıralama/SiteRankingComponent";
import SemantikAnalizComponent from "@/components/childs/SemantikAnaliz/SemantikAnalizComponent";
import KeywordsFromWebpage from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordComponents/KeywordsFromWebpage";

export default {
  name: "App",

  data: () => ({
    //
    showUpBtn: false,
    propsCars: [
      {
        path: "/url_frekans",
        label: "Website Kelime Scraping",
        component: URLFrekans,
        barColor: "#3d52d4"
      },
      {
        path: "/url_keywords",
        label: "URL Anahtar Kelime/Etiket",
        component: KeywordsFromWebpage,
        barColor: "#52abae"
      },
      {
        path: "/site_ranking",
        label: "Site Sıralamaları",
        component: SiteRankingComponent,
        barColor: "#c19641"
      },
      {
        path: "/semantics",
        label: "Semantik Analiz Denemesi",
        component: SemantikAnalizComponent,
        barColor: "#a548e7"
      }
    ]
  }),
  mounted() {
    document.addEventListener("scroll", this.scrollEvent, false);
  },
  methods: {
    scrollEvent: function() {
      this.showUpBtn = window.scrollY > 300;
    },
    goTop: function() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style>
svg text {
  font-family: "Roboto", sans-serif;
}
.code-url-path {
  color: white !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #e7b536 !important;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.15);
}
.code-depth-label {
  color: white !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #365ce7 !important;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.15);
}
.code-matched-ratio {
  color: white !important;
  font-size: 24px !important;
  font-weight: 600 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #e73650 !important;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);
}
.code-semantics {
  color: white !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  font-family: "Menlo", sans-serif !important;
  border-bottom: 3px solid rgba(0, 0, 0, 0.3);
}
.code-single-text {
  color: white !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #339236 !important;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);
}

.code-card-title {
  color: #000000 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #f3c520 !important;
  border: 1px solid rgba(0,0,0,0.2);
}

code {
  color: #000000 !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: "Menlo", sans-serif !important;
  background-color: #e0e0e0 !important;
}
pre {
  background: #f5f5f5;
  border: 1px solid #c8c8c8;
  border-left: 3px solid #339236;
  color: #666;
  page-break-inside: avoid;
  font-family: "Menlo", sans-serif !important;
  font-size: 15px;
  line-height: 1.6;
  max-width: 100%;
  width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
  white-space: pre-line;
}
</style>
