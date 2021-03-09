<template>
  <div>
    <keywords-from-webpage :component-item="componentItem1" />
    <keywords-from-url-set :component-item="componentItem2" />
  </div>
</template>

<script>
import KeywordsFromWebpage from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordComponents/KeywordsFromWebpage";
import KeywordsFromUrlSet from "@/components/childs/URLAnahtarKelimeComponent/URLKeywordComponents/KeywordsFromUrlSet";

export default {
  name: "URLAnahtarKelime",
  props: {
    componentItem1: {
      required: false,
      type: Object
    },
    componentItem2: {
      required: false,
      type: Object
    }
  },
  components: {
    KeywordsFromWebpage,
    KeywordsFromUrlSet
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
