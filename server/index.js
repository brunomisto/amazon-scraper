const express = require("express");
const { fetchSearchHTML, parseSearchHTML } = require("./utils/scraping");

const app = express();

app.get("/api/scrape", async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const searchHTML = await fetchSearchHTML(keyword);
    const products = parseSearchHTML(searchHTML);
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

app.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
