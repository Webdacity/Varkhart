// Klaviyo Functions

function identify(email) {
    var _learnq = _learnq || [];
    _learnq.push(['identify', {
        '$email': email
    }]);
    setTimeout(() => {
        startedCheckout()
    }, 5000);
}

function viewedProduct(product) {
    var _learnq = _learnq || [];
    var item = {
        "ProductName": product.name,
        "ProductID": product.productCode,
        "SKU": product.productCode,
        "Categories": [product.category, product.gender],
        "ImageURL": product.productThumbnailUrl,
        "URL": `http://www.varkhart.co.za/produk.html#${product.productCode}`,
        "Brand": "Varkhart",
        "Price": product.price,
    };
    _learnq.push(["track", "Viewed Product", item]);

    _learnq.push(["trackViewedItem", {
        "Title": product.name,
        "ItemId": product.productCode,
        "Categories": [product.category, product.gender],
        "ImageUrl": product.productThumbnailUrl,
        "Url": `http://www.varkhart.co.za/produk.html#${product.productCode}`,
        "Metadata": {
            "Brand": "Varkhart",
            "Price": product.price,
        }
    }]);
    console.log("Viewed product")
}

function addedToCart(productCode, size) {
    axios.get(`${api_url}/products`)
        .then(result => {
            const products = result.data;
            let addedProduct = products.find(product => product.productCode === productCode);
            let data = {
                "$value": getCartTotal(products),
                "AddedItemProductName": addedProduct.name,
                "AddedItemProductID": addedProduct.productCode,
                "AddedItemSKU": addedProduct.productCode,
                "AddedItemCategories": [addedProduct.category, addedProduct.gender],
                "AddedItemImageURL": addedProduct.productThumbnailUrl,
                "AddedItemURL": `http://www.varkhart.co.za/produk.html#${addedProduct.productCode}`,
                "AddedItemPrice": addedProduct.price,
                "AddedItemQuantity": getAddedItemQuant(addedProduct, size),
                "ItemNames": getCartItemNames(products),
                "CheckoutURL": "http://www.varkhart..co.za/mandjie.html",
                "Items": getCartItems(products)
            }
            console.log(data)
            _learnq.push(["track", "Added to Cart", data]);
            console.log("addedToCart");
        })
        .catch(err => console.log(err))
}

function startedCheckout() {
    axios.get(`${api_url}/products`)
        .then(result => {
            const products = result.data;
            let data = {
                "$value": getCartTotal(products),
                "ItemNames": getCartItemNames(products),
                "CheckoutURL": "http://www.varkhart..co.za/mandjie.html",
                "Categories": getCartItemCategories(products),
                "Items": getCartItems(products)
            }
            console.log(data)
            _learnq.push(["track", "Started Checkout", data]);
            console.log("startedCheckout");
        })
        .catch(err => console.log(err))
}


// Helpers

function getCartItems(products) {
    let items = [];
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    currentCart.forEach(item => {
        let product = products.find(product => product.productCode === item.id);
        let itemToAdd =
        {
            "ProductID": product.productCode,
            "SKU": product.productCode,
            "ProductName": product.name,
            "Quantity": item.quantity,
            "ItemPrice": product.price,
            "RowTotal": product.price * item.quantity,
            "ProductURL": `http://www.varkhart.co.za/produk.html#${product.productCode}`,
            "ImageURL": product.productThumbnailUrl,
            "ProductCategories": [product.category, product.gender],
        }
        items.push(itemToAdd)
    });
    return items
}

function getCartItemNames(products) {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    itemNames = [];
    currentCart.forEach(item => {
        let product = products.find(product => product.productCode === item.id);
        itemNames.push(product.name)
    });
    return itemNames
}

function getCartItemCategories(products) {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    itemCategories = [];
    currentCart.forEach(item => {
        let product = products.find(product => product.productCode === item.id);
        if (!itemCategories.includes(product.category)) {
            itemCategories.push(product.category)
        }
    });
    return itemCategories
}

function getAddedItemQuant(addedItem, size) {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let item = currentCart.find(item => item.id === addedItem.productCode && item.size === size);
    return item.quantity
}

function getCartTotal(products) {
    let total = 0;
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    currentCart.forEach(item => {
        let product = products.find(product => product.productCode === item.id);
        total += product.price * item.quantity
    });
    return total
}