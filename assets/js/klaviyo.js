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

function addedToCart(productCode) {
    console.log(productCode)
    axios.get(`${api_url}/products`)
        .then(result => {
            const products = result.data;
            let addedProduct = products.find(product => product.productCode === productCode);

            // Create Cart Items
            let currentCart = JSON.parse(localStorage.getItem("cart"));
            let items = []
            currentCart.forEach(item => {
                let product = products.find(product => product.productCode === item.id);
                items.push(product)
            });
            console.log(items)
            // _learnq.push(["track", "Added to Cart", {
            //     "$value": addedProduct.price,
            //     "AddedItemProductName": addedProduct.name,
            //     "AddedItemProductID": addedProduct.code,
            //     "AddedItemSKU": addedProduct.code,
            //     "AddedItemCategories": [addedProduct.category, addedProduct.gender],
            //     "AddedItemImageURL": addedProduct.productThumbnailUrl,
            //     "AddedItemURL": `http://www.varkhart.co.za/produk.html#${addedProduct.productCode}`,
            //     "AddedItemPrice": addedProduct.price,
            //     "AddedItemQuantity": 1,
            //     "ItemNames": ["Winnie the Pooh", "A Tale of Two Cities"],
            //     "CheckoutURL": "http://www.varkhart..co.za/mandjie.html",
            //     "Items": [{
            //         "ProductID": "1111",
            //         "SKU": "WINNIEPOOH",
            //         "ProductName": "Winnie the Pooh",
            //         "Quantity": 1,
            //         "ItemPrice": 9.99,
            //         "RowTotal": 9.99,
            //         "ProductURL": "http://www.example.com/path/to/product",
            //         "ImageURL": "http://www.example.com/path/to/product/image.png",
            //         "ProductCategories": ["Fiction", "Children"]
            //     },
            //     {
            //         "ProductID": "1112",
            //         "SKU": "TALEOFTWO",
            //         "ProductName": "A Tale of Two Cities",
            //         "Quantity": 1,
            //         "ItemPrice": 19.99,
            //         "RowTotal": 19.99,
            //         "ProductURL": "http://www.example.com/path/to/product2",
            //         "ImageURL": "http://www.example.com/path/to/product/image2.png",
            //         "ProductCategories": ["Fiction", "Classics"]
            //     }
            //     ]
            // }]);
        })
        .catch(err => console.log(err))

    console.log("addedToCart")
}
