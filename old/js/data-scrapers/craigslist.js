let resultContainer = document.getElementById('search-results');
let resultEls = Array.from(resultContainer.getElementsByClassName("result-row"));
let inventory = resultEls.map(el => {
  let titleEl = el.querySelector(".result-title");
  name = titleEl.innerText;
  url = titleEl.href;
  img = el.querySelector("img").src;
  price = el.querySelector(".result-price").innerText;
  inStock = true;
  return {
    "name": name,
    "url": url,
    "image": img,
    "price": price,
    "inStock": inStock,
}
})

JSON.stringify(inventory, null, 2)