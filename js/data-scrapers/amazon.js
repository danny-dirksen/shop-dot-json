let resultsContainer = document.querySelector(".s-main-slot.s-search-results");
let resultEls = Array.from(resultsContainer.querySelectorAll(".s-result-item"))

let inventory = resultEls.map(el => {
    try {
      let titleEl = el.querySelector("h2");
      name = titleEl.innerText
      url = titleEl.querySelector('a').href;
      img = el.querySelector("img").src;
      price = el.querySelector(".a-price").querySelector('.a-offscreen').innerText
      inStock = true;
      return {
        "name": name,
        "url": url,
        "image": img,
        "price": price,
        "inStock": inStock,
      }
    } catch {
        return null
    }
});

inventory = inventory.filter(item => item != null);

JSON.stringify(inventory, null, 2)