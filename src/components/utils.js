/*
 * Field Validation.
 * */
export const defaultRule = [v => !!v || "URL Girmelisiniz"];

/*
 * Search regex that we use for replacing characters
 * other than alphabetical characters
 * */
export const keywordRegex = /[()-,\n?.@!,*_'":;-]/g;

/*
 * Decides which URL to use on dev/production
 * */
export const whichURL =
  process.env.NODE_ENV === "development"
    ? process.env.VUE_APP_DEV_URL
    : process.env.VUE_APP_PROD_URL;

/*
 * URL Array that we use in combobox fields
 * */
export const urlSet = [
  "https://www.w3schools.com/",
  "https://reactnavigation.org/docs/nesting-navigators",
  "https://reactnavigation.org/docs/headers/",
  "https://reactnavigation.org/docs/drawer-navigator/",
  "https://www.wsj.com/articles/cdc-says-fully-vaccinated-people-can-gather-in-small-groups-without-masks-11615219222?mod=politics_lead_pos4",
  "https://www.wsj.com/articles/supreme-court-wont-review-banks-bid-to-arbitrate-stale-debts-11615242719",
  "https://www.wsj.com/articles/plastics-recycler-carbonlite-files-for-bankruptcy-11615226888",
  "https://www.wsj.com/articles/medley-unit-files-for-bankruptcy-aiming-for-debt-swap-with-bondholders-11615247245",
  "https://www.wsj.com/articles/law-firm-kirkland-ellis-resigns-from-travelport-over-disputed-1-billion-debt-deal-11591762991",
  "https://www.wsj.com/articles/citi-has-options-but-faces-hurdles-to-retrieving-500-million-revlon-goof-11614213945",
  "https://www.wsj.com/articles/global-stock-markets-dow-update-03-09-2021-11615279243?mod=hp_lead_pos1",
  "https://www.wsj.com/articles/widows-run-for-congress-after-husbands-covid-19-deaths-11614263703",
  "https://www.wsj.com/articles/dominion-sues-mypillow-ceo-mike-lindell-over-election-claims-11613996104",
  "https://www.wsj.com/articles/trump-faces-uncertain-future-as-he-leaves-white-house-11611157651",
  "https://www.wsj.com/articles/trumps-final-day-in-office-where-will-he-go-and-what-comes-next-11611078173",
  "https://www.wsj.com/articles/black-women-ready-to-virtually-cheer-on-kamala-harriss-inauguration-11610895600",
  "https://www.wsj.com/articles/u-s-and-china-engage-tentatively-on-climate-change-11615301108"
];

/**
 * Returns array of objects that contains url and frequecyList
 * @param model : Array -> Contains url set.
 * First map functipn returns array of objects containing
 * words extracted from URL. Chained map function takes those keywords,
 * tries to remove all Numbers & empty elements inside array of strings
 * */
export const returnURLWithFrequencyList = model => {
  return model
    .map(url => {
      console.log("Traverse url", url);
      return {
        url: url,
        keywords: createWords(url)
      };
    })
    .map(m => {
      return {
        url: m.url,
        frequencyList: reducerFrequency(m.keywords).filter(
          m => m.text !== "" && isNaN(m.text)
        )
      };
    });
};

/**
 * Gets the url string as a parameter, creates an anchor tag and returns the path name
 * @param url : String
 * */
export const createWords = url => {
  const tempAnchor = document.createElement("a");
  tempAnchor.setAttribute("href", url);
  const path = tempAnchor.pathname;
  const pathReplaced = path.replace(/[\W_-]/g, "-");
  return pathReplaced.split("-");
};

/**
 * @param data : Array - array that contains words
 * -Reduce Function: Creates an object that contains each word & frequency values
 * as key/value pairs. eg { "Surely": 5, .... }
 * -Return portion: Takes the created object returns key as text property
 * and value as size property. Then sort by size.
 * */
export const reducerFrequency = data => {
  const obj = data.reduce((p, c) => {
    p[c] = (p[c] || 0) + 1;
    return p;
  }, {});
  return Object.entries(obj)
    .map(([k, v]) => {
      return { text: k, size: v };
    })
    .sort((a, b) => (a.size < b.size ? 1 : -1));
};

/*
 * UI Stuff. getPrize returns an emoji for index 0,1 and 2
 * */
export const getPrize = i => {
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
};

/*
 * UI Stuff. getColors returns a color for index 0,1 and 2
 * */
export const getColors = i => {
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
};

/*
 * UI Stuff. getFileMargin returns a fixed margin for index.
 * (Used in treeview (see: TreeviewComp.vue))
 * */
export const getFileMargin = i => {
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
};
