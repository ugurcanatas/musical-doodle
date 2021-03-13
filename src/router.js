import Vue from "vue";
import Router from "vue-router";
import URLFrekans from "@/components/childs/URLFrekansComponents/URLFrekans";
import SiteRankingComponent from "@/components/childs/SiteSıralama/SiteRankingComponent";
import SemantikAnalizComponent from "@/components/childs/SemantikAnaliz/SemantikAnalizComponent";
import KeywordsFromWebpage from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordComponents/KeywordsFromWebpage";

Vue.use(Router);

const routes = [
  {
    path: "/url_frekans",
    props: {
      componentItem: {
        label: "Website Kelime Scraping",
        excerpt:
          "Girilen URL içeriğinden kelime bulma ve bu kelimelerin frekanslarının hesaplanması.",
        barColor: "#224fd7"
      }
    },
    component: URLFrekans
  },
  {
    path: "/url_keywords",
    props: {
      componentItem: {
        label: "Webpage Keywords",
        barColor: "#5552ae"
      }
    },
    component: KeywordsFromWebpage
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
        excerpt:
          "URL'lerden çıkarılan anahtar kelimelerle semantik analiz yapılması.",
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
