export const defaultRule = [v => !!v || "URL Girmelisiniz"];

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
