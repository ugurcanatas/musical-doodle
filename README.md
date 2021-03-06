# web_indexing_kou
A small web scraping test project using Javascript & Vue.js.  

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Dependencies
```
- [axios]: used for fetching data. (Can be replaced with javascript fetch API)
- [vuetify]: UI components
```

## Main Components
```1- URLFrekans.vue```
![](gifs/gif-page-1.gif)

```2- KeywordsFromWebPage.vue```
- By URL
  ![](gifs/gif-page-2.gif)
- By WebPage
  
```3- SiteRankingComponent.vue```

```4- SemantikAnalizComponent.vue```

#TODO Status (components)
```1- URLFrekans.vue```
- [x] Component Completed

```2- KeywordsFromWebPage.vue```
- [x] Component Completed
- [x] Create a new scoring formula
- [x] Try to implement same logic when comparing urls & webpages (Parsed object
  structures are different.)

```3- SiteRankingComponent.vue(incomplete)```
- [X] Component Completed
- [ ] Scoring logic

```4- SemantikAnalizComponent.vue```
- [x] Component Completed
- [x] URL implemented
- [ ] WebPage implemented

### See [live version](https://musical-doodle.vercel.app/).

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
