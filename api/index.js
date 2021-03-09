const app = require("express")();
const { v4 } = require("uuid");
import axios from "axios";

app.get("/urltest", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
  res.json("RESPONSEEEEEEEE");
});

app.post("/urltest", async (request, response) => {
  console.log("PARAMS: ", request.body);
  const { url } = request.body;

  try {
    const res = await axios.get(url);
    console.log("RESPONSE FROM URL", res.data);
    response.json(res.data);
  } catch (e) {
    console.log("Error while fetchinn");
    response.json(e);
  }
});

module.exports = app;
