let els = Array.from(document.querySelectorAll('.product-tiles-grid-item')).filter(el => el.dataset['componentContainer'] != 'promoComponent');
let inventory = els.map((el, index) => {
    let inStock = !(Array.from(el.classList).some(classTag => classTag == "instock-false"));
    let img = el.querySelector("source").srcset.substr(2);
    let infoEl = el.querySelector(".product-tiles-grid-item-info");
    //if (infoEl == null) console.log(el, index);
    let name = el.querySelector("h2").innerText;
    let priceEL = el.querySelector(".price");
    let saleEl = el.querySelector(".sale");
    let price;
    if (saleEl == null) {
        price = priceEL.textContent.replace("\n", "").replace("\t", "");
    } else {
        price = saleEl.innerText;
    }
    return {
        "name": name,
        "image": img,
        "price": price,
        "inStock": inStock
    }
});

JSON.stringify(inventory)