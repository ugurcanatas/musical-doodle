<template>
  <v-app>
    <v-app-bar
      app
      style="background-color: wheat"
    >
      <div class="d-flex align-center">
        <v-app-bar-title>Web Indeksleme (KOU)</v-app-bar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <tab-wrapper :layout="propsCars"/>
    </v-main>
  </v-app>
</template>

<script>
import TabWrapper from "@/components/TabWrapper";
import URLFrekans from "@/components/childs/URLFrekansComponents/URLFrekans";
import URLAnahtarKelime from "@/components/childs/URLAnahtarKelime";

export default {
  name: 'App',
  components: {
    TabWrapper
  },

  data: () => ({
    //
    propsCars: [
      {
        label: 'URL Kelime Frekans',
        component: URLFrekans,
        barColor: '#3d52d4'
      },
      {
        label: 'URL Anahtar Kelime/Etiket',
        component: URLAnahtarKelime,
        barColor: '#52abae'
      }
    ]
  }),
};
</script>
