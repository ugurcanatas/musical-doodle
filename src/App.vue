<template>
  <v-app>
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
  </v-app>
</template>

<script>
import URLFrekans from "@/components/childs/URLFrekansComponents/URLFrekans";
import URLAnahtarKelime from "@/components/childs/URLAnahtarKelimeComponent/URLAnahtarKelime";
import SiteRankingComponent from "@/components/childs/SiteSıralama/SiteRankingComponent";
import SemantikAnalizComponent from "@/components/childs/SemantikAnaliz/SemantikAnalizComponent";

export default {
  name: "App",

  data: () => ({
    //
    propsCars: [
      {
        path: "/url_frekans",
        label: "URL Kelime Frekans",
        component: URLFrekans,
        barColor: "#3d52d4"
      },
      {
        path: "/url_keywords",
        label: "URL Anahtar Kelime/Etiket",
        component: URLAnahtarKelime,
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
  })
};
</script>

<style>
svg text {
  font-family: "Roboto", sans-serif;
}
</style>
