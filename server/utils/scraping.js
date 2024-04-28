const axios = require("axios");
const cheerio = require("cheerio");

const fetchSearchHTML = async (keyword) => {
  const baseUrl = "https://www.amazon.com/s";
  const headers = {
    // Send header simulating a browser because Amazon refuses the request otherwise
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
  };
  const response = await axios.get(baseUrl, {
    headers,
    params: { k: keyword },
  });
  return response.data;
};

const parseSearchHTML = (html) => {
  const $ = cheerio.load(html);
  const products = [];

  $('[data-component-type="s-search-result"]').each((i, el) => {
    const title = $(el).find("h2").text().trim();
    const rating = $(el).find(".a-icon-star-small").text();
    const reviewAmount = $(el)
      .find('[data-component-type="s-client-side-analytics"]')
      .text()
      .trim();
    const imageURL = $(el).find(".s-image").attr("src");

    // Only add to products when has all properties
    if (title && rating && reviewAmount && imageURL) {
      products.push({ title, rating, reviewAmount, imageURL });
    }
  });

  return products;
};

module.exports = { fetchSearchHTML, parseSearchHTML };
