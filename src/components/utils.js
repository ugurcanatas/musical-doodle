import { v4 as uuidv4 } from "uuid";

export const defaultRule = [v => !!v || "URL Girmelisiniz"];

export const keywordRegex = /[()-,\n?!,*_'":;-]/g;

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

/**
 * @param data : Array of url objects
 * @param depth : Number selected depth filter
 * @param url : String url
 * */
export const convertUrlsToTreeViews = (data, depth, url) => {
  console.log("Convert URLS ", data, depth, url);

  /*const mappedURLS = data
    .map(v => v.url.split("/").slice(1))
    .filter(v => v.length === depth);*/

  let treeview = data.map(m => {
    const [, first, second, third] = m.url.split("/");
    if (depth === 1) {
      return {
        name: first,
        key: uuidv4(),
        children: []
      };
    } else if (depth === 2) {
      return {
        name: first,
        key: uuidv4(),
        children: [
          {
            name: second === "" ? "/" : second,
            key: uuidv4()
          }
        ]
      };
    } else if (depth === 3) {
      return {
        name: first,
        key: uuidv4(),
        children: [
          {
            name: second,
            key: uuidv4(),
            children: [
              {
                name: third,
                key: uuidv4()
              }
            ]
          }
        ]
      };
    }
  });

  console.log("TEST", treeview);
  return treeview;
};
/*eslint-disable*/
const convertToArrayOfObjects = array => {
  return array.map(m => {
    return {
      name: m,
      key: uuidv4()
    };
  });
};
