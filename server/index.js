const express = require("express");
const cors = require("cors");
const { fetchSearchHTML, parseSearchHTML } = require("./utils/scraping");

const app = express();

// Set cross origin header to '*' so client-side can use it
app.use(cors());

app.get("/api/scrape", async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      const error = new Error("Keyword is required");
      error.statusCode = 400;
      throw error;
    }
    const searchHTML = await fetchSearchHTML(keyword);
    const products = parseSearchHTML(searchHTML);
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  return res.status(statusCode).json({ error: message });
});

app.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
