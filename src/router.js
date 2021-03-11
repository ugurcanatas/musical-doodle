import Vue from "vue";
import Router from "vue-router";
import URLFrekans from "@/components/childs/URLFrekansComponents/URLFrekans";
import URLAnahtarKelime from "@/components/childs/URLAnahtarKelimeComponent/URLAnahtarKelime";
import SiteRankingComponent from "@/components/childs/SiteSıralama/SiteRankingComponent";
import SemantikAnalizComponent from "@/components/childs/SemantikAnaliz/SemantikAnalizComponent";

Vue.use(Router);

const routes = [
  {
    path: "/url_frekans",
    props: {
      componentItem: {
        label: "Website Kelime Scraping",
        excerpt:
          "Girilen URL içeriğinden kelime bulma ve bu kelimelerin frekanslarının hesaplanması.",
        barColor: "#3d52d4"
      }
    },
    component: URLFrekans
  },
  {
    path: "/url_keywords",
    props: {
      componentItem1: {
        label: "Webpage Keywords",
        barColor: "#52abae"
      },
      componentItem2: {
        label: "URL Keywords",
        barColor: "#5552ae"
      }
    },
    component: URLAnahtarKelime
  },
  {
    path: "/site_ranking",
    props: {
      componentItem: {
        label: "Site Sıralamaları",
        barColor: "#c19641"
      }
    },
    component: SiteRankingComponent
  },
  {
    path: "/semantics",
    props: {
      componentItem: {
        label: "Semantik Analiz Denemesi",
        barColor: "#a548e7"
      }
    },
    component: SemantikAnalizComponent
  }
];

const router = new Router({
  mode: "history",
  routes
});

export default router;
