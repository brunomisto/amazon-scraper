const form = document.querySelector("form");
const keywordInput = document.getElementById("keyword");
const productsList = document.getElementById("products");
const errorElement = document.getElementById("error");
const baseUrl = "http://localhost:3000/api/scrape";

let errorTimeout;
const displayError = (message) => {
  // Clear current timeout if any
  clearTimeout(errorTimeout);

  errorElement.innerText = message;
  errorElement.className = "enabled";

  // Clear error after 5 seconds
  errorTimeout = setTimeout(() => {
    errorElement.innerText = "";
    errorElement.className = "disabled";
  }, 5000);
};

const fetchProducts = async (keyword) => {
  const response = await fetch(`${baseUrl}?keyword=${keyword}`);
  const json = await response.json();

  // Throw error so it can be handled
  if (json.error) {
    throw new Error(json.error);
  }

  return json;
};

const renderProducts = (products) => {
  productsList.innerHTML = "";
  products.forEach((product) => {
    const productElement = document.createElement("li");
    productElement.className = "product";

    const titleElement = document.createElement("h2");
    titleElement.className = "title";
    titleElement.innerText = product.title;

    const ratingElement = document.createElement("p");
    ratingElement.className = "rating";
    ratingElement.innerText = `Rating: ${product.rating}`;

    const reviewsElement = document.createElement("p");
    reviewsElement.className = "reviews";
    reviewsElement.innerText = `Reviews: ${product.reviewAmount}`;

    const imageElement = document.createElement("img");
    imageElement.className = "image";
    imageElement.src = product.imageURL;

    productElement.appendChild(imageElement);
    productElement.appendChild(titleElement);
    productElement.appendChild(ratingElement);
    productElement.appendChild(reviewsElement);

    productsList.appendChild(productElement);
  });
};

form.addEventListener("submit", async (event) => {
  // Prevent form from submitting because we are making AJAX calls
  event.preventDefault();
  try {
    // Disable input for better user experience
    keywordInput.disabled = true;

    const products = await fetchProducts(keywordInput.value);
    renderProducts(products);

    // Empty keyword input only when successful
    keywordInput.value = "";
  } catch (error) {
    displayError(error.message);
  }

  keywordInput.disabled = false;
});
